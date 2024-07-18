import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import roomModel from '../models/RoomModel';
import bodyParser from 'body-parser';
import axios from 'axios';
import Timer from '../utils/Timer';
import {
  calculateScore,
  generateRoomCode,
  getNewPlayersAndSpectators,
  getNextPlayer,
  isRoomEmpty,
  preparePlayer,
  updateRoomAfterTurnChange,
} from '../utils/RoomUtils';
import { ICustomRequest } from '../@types';
import { getCurrentUrl } from '../utils/GetCurrentUrl';
import { logger } from '../utils/Logger';

// Load environment variables
dotenv.config();

// Middleware for parsing JSON bodies
const jsonParser = bodyParser.json();

// Create a new router
const router: Router = express.Router();

router.post('/', jsonParser, async (req: Request, res: Response) => {
  try {
    if (!req.body.player || (!req.body.player.id && !req.body.player.name)) {
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }

    const roomCode = req.body.roomCode || (await generateRoomCode());
    let room = await roomModel.findOne({ roomCode });
    const categories = await axios
      .get(`${getCurrentUrl()}/externalApi/categories`)
      .then(response => response.data);
    const player = preparePlayer(req.body.player, categories);

    if (!room) {
      const songs = await axios
        .post(`${getCurrentUrl()}/externalApi/songs/possibleSongs`, {
          maxRoundsPhaseOne: req.body.maxRoundsPhaseOne,
          maxRoundsPhaseTwo: req.body.maxRoundsPhaseTwo,
        })
        .then(response => response.data);

      await roomModel.create({
        roomCode,
        players: [player],
        maxRoundsPhaseOne:
          req.body.maxRoundsPhaseOne || roomModel.schema.paths.maxRoundsPhaseOne.options.default,
        maxRoundsPhaseTwo:
          req.body.maxRoundsPhaseTwo || roomModel.schema.paths.maxRoundsPhaseTwo.options.default,
        round: 1,
        isInGameLobby: true,
        isInSelectMode: true,
        songs: songs.songs,
      });
    } else if (room.players.length >= 8) {
      return res.status(400).json({ status: 'error', message: 'Room is full' });
    } else if (
      !room.players.some(player => player.id === req.body.player.id) &&
      !room.spectators.some(spectator => spectator.id === req.body.player.id)
    ) {
      const update =
        room.round > 1
          ? { $push: { spectators: req.body.player } }
          : { $push: { players: req.body.player } };
      room = await roomModel.findOneAndUpdate({ roomCode }, update, { new: true });
      (req as ICustomRequest).io
        .in(roomCode)
        .emit('updatePlayerList', room?.players, room?.spectators);
      return res.json(room);
    } else if (
      room.players.some(player => player.id === req.body.player.id) &&
      req.body.asSpectator
    ) {
      await roomModel.updateOne({ roomCode }, { $pull: { players: { id: req.body.player.id } } });
      room = await roomModel.findOneAndUpdate(
        { roomCode },
        { $push: { spectators: req.body.player } },
        { new: true },
      );
      (req as ICustomRequest).io
        .in(roomCode)
        .emit('updatePlayerList', room?.players, room?.spectators);
      return res.json({ status: 'success', message: 'Player moved to spectators' });
    }

    room = await roomModel.findOne({ roomCode });
    return res.json(room);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to create room' });
  }
});

router.post('/leave', jsonParser, async (req: Request, res: Response) => {
  try {
    const { roomCode, playerId } = req.body;

    if (!roomCode || !playerId)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });

    const room = await roomModel.findOneAndUpdate(
      { roomCode },
      { $pull: { players: { id: playerId }, spectators: { id: playerId } } },
      { new: true },
    );

    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    if (isRoomEmpty(room)) {
      await roomModel.deleteOne({ roomCode });
      Timer(roomCode, 0, (req as ICustomRequest).io).stop();
      return res.status(200).json({ message: 'Room deleted' });
    }

    return res.status(200).json(room);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to leave room' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await roomModel.find();
    return res.status(200).json({ rooms });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to get rooms' });
  }
});

router.get('/:roomCode', async (req: Request, res: Response) => {
  try {
    const roomCode = req.params.roomCode;

    const room = await roomModel.findOne({ roomCode: roomCode });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    return res.status(200).json(room);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to get room' });
  }
});

router.post('/start', jsonParser, async (req: Request, res: Response) => {
  try {
    const roomCode = req.body.roomCode;
    if (!roomCode) return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const room = await roomModel.findOne({ roomCode: roomCode });
    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    const random = Math.floor(Math.random() * room.players.length);
    const currentPlayer = room.players[random];

    (req as ICustomRequest).io?.in(roomCode).emit('togglePhaseOne', currentPlayer);

    await roomModel.findOneAndUpdate(
      { roomCode: roomCode },
      { currentPlayer: currentPlayer, isInGameLobby: false },
    );

    return res.status(200).json({ status: 'success', message: 'Game started' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to start game' });
  }
});

router.post('/turnChange', jsonParser, async (req: Request, res: Response) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) return res.status(400).json({ status: 'error', message: 'Missing parameters' });

    const room = await roomModel.findOne({ roomCode: roomCode });

    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    const { maxRoundsPhaseOne, round, players } = room;
    let currentPlayer = getNextPlayer(players, room.currentPlayer);

    if (round === maxRoundsPhaseOne && players.length > 1) {
      const { newPlayers, spectators } = getNewPlayersAndSpectators(players);
      currentPlayer = newPlayers[0];
      await roomModel.updateOne(
        { roomCode: roomCode },
        { players: newPlayers, currentPlayer: currentPlayer, spectators: spectators },
      );
      (req as ICustomRequest).io.in(roomCode).emit('updatePlayerList', newPlayers, spectators);
    }

    await updateRoomAfterTurnChange(roomCode, currentPlayer, room, req);

    return res.status(200).json({ status: 'success', message: 'Turn changed' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to change turn' });
  }
});

router.post('/checkAnswer', jsonParser, async (req: Request, res: Response) => {
  try {
    const { roomCode, playerId, playerAnswer, songId, time, category } = req.body;
    if (!playerId || !songId || !time)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });

    const response = await axios.get(`${getCurrentUrl()}/externalApi/songs/${songId}`);
    const correctAnswer = response.data.song;

    const score = calculateScore(time, songId);
    const isAnswerCorrect = playerAnswer.toLowerCase().includes(correctAnswer.value.toLowerCase());

    if (!roomCode) {
      return res.status(200).json({
        status: 'success',
        message: isAnswerCorrect ? 'Correct answer' : 'Wrong answer',
        score: isAnswerCorrect ? score : 0,
        playerId,
        answer: correctAnswer.value,
      });
    }

    Timer(roomCode, 0, (req as ICustomRequest).io).stop();

    await roomModel.updateOne(
      {
        roomCode: roomCode,
        'songs.songId': songId,
      },
      {
        $set: { 'songs.$.completed': true },
      },
    );

    if (category) {
      await roomModel.findOneAndUpdate(
        { roomCode, 'players.id': playerId },
        { $set: { 'players.$.completedCategories.$[category].completed': true } },
        { arrayFilters: [{ 'category.category': category }], new: true },
      );
    }

    if (!correctAnswer) {
      return res.status(404).json({ status: 'error', message: 'Answer not found' });
    }

    await axios.post(`${getCurrentUrl()}/externalApi/rooms/updateScore`, {
      roomCode,
      playerId,
      score: isAnswerCorrect ? score : 0,
    });

    if (songId.includes('final')) {
      //Check if all song with category 'final' are completed
      await roomModel.findOne({ roomCode: roomCode }).then(async room => {
        const songs = room?.songs.filter(
          song => song.category === 'final' && song.completed === true,
        );
        if (songs?.length === 6) {
          //If all songs with category 'final' are completed, then add +1 to round
          await axios.post(`${getCurrentUrl()}/externalApi/rooms/turnChange`, {
            roomCode: roomCode,
            songId: songId,
          });
          return res.status(200);
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      message: isAnswerCorrect ? 'Correct answer' : 'Wrong answer',
      score: isAnswerCorrect ? score : 0,
      playerId,
      answer: correctAnswer.value,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to check answer' });
  }
});

router.post('/updateScore', jsonParser, async (req: Request, res: Response) => {
  try {
    if (!req.body.roomCode || !req.body.playerId || req.body.score === undefined) {
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }
    const { roomCode, playerId, score } = req.body;

    await roomModel.findOneAndUpdate(
      { roomCode: roomCode, 'players.id': playerId },
      { $inc: { 'players.$.score': score } },
      { new: true },
    );

    return res.status(200).json({ status: 'success', message: 'Score updated' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to update score' });
  }
});

router.put('/settings', jsonParser, async (req: Request, res: Response) => {
  try {
    if (
      !req.body.roomCode ||
      !req.body.maxRoundsPhaseOne ||
      !req.body.maxRoundsPhaseTwo ||
      !req.body.maxTimer
    ) {
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }
    const { roomCode, maxRoundsPhaseOne, maxRoundsPhaseTwo, maxTimer } = req.body;

    await roomModel.findOneAndUpdate(
      { roomCode: roomCode },
      {
        maxRoundsPhaseOne: maxRoundsPhaseOne,
        maxRoundsPhaseTwo: maxRoundsPhaseTwo,
        maxTimer: maxTimer,
      },
    );
    (req as ICustomRequest).io
      .in(roomCode)
      .emit('roomSettingsUpdate', maxRoundsPhaseOne, maxRoundsPhaseTwo, maxTimer);

    return res.status(200).json({ status: 'success', message: 'Settings updated' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to update settings' });
  }
});

export default router;
