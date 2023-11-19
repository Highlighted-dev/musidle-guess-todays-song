import express, { Router, Request, Response, NextFunction } from 'express';
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
  isOnlyPlayerInRoom,
  preparePlayer,
  updateRoomAfterTurnChange,
} from '../utils/RoomUtils';
import { ICustomRequest } from '../@types';

// Load environment variables
dotenv.config();

// Middleware for parsing JSON bodies
const jsonParser = bodyParser.json();

// Create a new router
const router: Router = express.Router();

// Determine the API URL based on the environment
const apiUrl = process.env.NODE_ENV == 'production' ? process.env.API_URL : 'http://localhost:5000';

router.post('/join', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.player) {
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }

    const roomCode = req.body.roomCode || (await generateRoomCode());
    let room = await roomModel.findOne({ roomCode });
    const categories = await axios
      .get(`${apiUrl}/externalApi/categories`)
      .then(response => response.data);
    const player = preparePlayer(req.body.player, categories);

    if (!room) {
      const songs = await axios
        .post(`${apiUrl}/externalApi/songs/possibleSongs`, {
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
        songs: songs.data.songs,
      });
    } else if (
      !room.players.some(player => player._id === req.body.player._id) &&
      !room.spectators.some(spectator => spectator._id === req.body.player._id)
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
      room.players.some(player => player._id === req.body.player._id) &&
      req.body.asSpectator
    ) {
      await roomModel.updateOne({ roomCode }, { $pull: { players: { _id: req.body.player._id } } });
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
    next(error);
  }
});

router.post('/leave', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomCode, playerId } = req.body;

    if (!roomCode || !playerId)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });

    let room = await roomModel.findOne({ roomCode });

    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    // If the player is the only one in the room, delete the room
    if (isOnlyPlayerInRoom(room)) {
      await roomModel.deleteOne({ roomCode });
      Timer(roomCode, 0, (req as ICustomRequest).io).stop();
      return res.status(200).json({ message: 'Room deleted' });
    }

    room = await roomModel.findOneAndUpdate(
      { roomCode },
      { $pull: { players: { _id: playerId } } },
      { new: true },
    );

    return res.status(200).json(room);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomModel.find();
    return res.status(200).json({ rooms });
  } catch (error) {
    next(error);
  }
});

router.get('/:roomCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomCode = req.params.roomCode;

    const room = await roomModel.findOne({ roomCode: roomCode });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    return res.status(200).json(room);
  } catch (error) {
    next(error);
  }
});

router.post('/start', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomCode = req.body.roomCode;
    if (!roomCode) return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const room = await roomModel.findOne({ roomCode: roomCode });
    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    const random = Math.floor(Math.random() * room.players.length);
    const currentPlayer = room.players[random];

    (req as ICustomRequest).io.in(roomCode).emit('togglePhaseOne', currentPlayer);

    await roomModel.findOneAndUpdate(
      { roomCode: roomCode },
      { currentPlayer: currentPlayer, isInGameLobby: false },
    );

    return res.status(200).json({ status: 'success', message: 'Game started' });
  } catch (error) {
    next(error);
  }
});

router.post('/turnChange', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomCode, songId } = req.body;

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

    await updateRoomAfterTurnChange(roomCode, currentPlayer, songId, room, req);

    return res.status(200).json({ status: 'success', message: 'Turn changed' });
  } catch (error) {
    next(error);
  }
});

router.post('/checkAnswer', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomCode, playerId, playerAnswer, songId, time, category } = req.body;

    if (!roomCode || !playerId || !songId || !time)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });

    Timer(roomCode, 0, (req as ICustomRequest).io).stop();

    const response = await axios.get(`${apiUrl}/externalApi/songs/${songId}`);
    const correctAnswer = response.data.data;

    if (category) {
      await roomModel.findOneAndUpdate(
        { roomCode, 'players._id': playerId },
        { $set: { 'players.$.completedCategories.$[category].completed': true } },
        { arrayFilters: [{ 'category.category': category }], new: true },
      );
    }

    if (!correctAnswer) {
      return res.status(404).json({ status: 'error', message: 'Answer not found' });
    }

    const score = calculateScore(time, songId);
    const isAnswerCorrect = playerAnswer.toLowerCase().includes(correctAnswer.value.toLowerCase());

    await axios.post(`${apiUrl}/externalApi/rooms/updateScore`, {
      roomCode,
      playerId,
      score: isAnswerCorrect ? score : 0,
    });

    return res.status(200).json({
      status: 'success',
      message: isAnswerCorrect ? 'Correct answer' : 'Wrong answer',
      score: isAnswerCorrect ? score : 0,
      playerId,
      answer: correctAnswer.value,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/updateScore', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.roomCode || !req.body.playerId || req.body.score === undefined) {
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }
    const { roomCode, playerId, score } = req.body;

    await roomModel.findOneAndUpdate(
      { roomCode: roomCode, 'players._id': playerId },
      { $inc: { 'players.$.score': score } },
      { new: true },
    );

    return res.status(200).json({ status: 'success', message: 'Score updated' });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
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
    next(error);
  }
});

export default router;
