import express, { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import roomModel from '../models/RoomModel';
import bodyParser from 'body-parser';
import axios from 'axios';
import Timer from '../utils/Timer';
import { IPlayer } from '../@types/room';
import { ICategory } from '../@types/categories';

// Load environment variables
dotenv.config();

// Middleware for parsing JSON bodies
const jsonParser = bodyParser.json();

// Create a new router
const router: Router = express.Router();

// Determine the API URL based on the environment
const apiUrl = process.env.NODE_ENV == 'production' ? process.env.API_URL : 'http://localhost:5000';

// Extend the Request interface to include the socket.io server
interface ICustomRequest extends Request {
  io: Server;
}

// Helper function to generate a unique room code
async function generateRoomCode() {
  let roomCode;
  while (true) {
    roomCode = Math.random().toString(36).substr(2, 5);
    if ((await roomModel.findOne({ roomCode })) === null) {
      break;
    }
  }
  return roomCode;
}

// Helper function to prepare a player: add completedCategories and votedForTurnSkip
function preparePlayer(player: IPlayer, categories: ICategory[]) {
  player.completedCategories = categories.map((category: ICategory) => ({
    category: category.category,
    completed: false,
  }));
  player.votedForTurnSkip = false;
  return player;
}

router.post('/join', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    }

    room = await roomModel.findOne({ roomCode });
    return res.json(room);
  } catch (error) {
    next(error);
  }
});

router.post('/leave', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.roomCode || !req.body.playerId)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const roomCode = req.body.roomCode;
    const playerId = req.body.playerId;

    let room = await roomModel.findOne({ roomCode: roomCode });

    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    // If the player is the only one in the room, delete the room
    if (
      (room.players.length === 1 && room.spectators.length === 0) ||
      (room.players.length === 0 && room.spectators.length === 1)
    ) {
      await roomModel.deleteOne({ roomCode: roomCode });
      Timer(roomCode, 0, (req as ICustomRequest).io).stop();
      return res.status(200).json({ message: 'Room deleted' });
    }

    room = await roomModel.findOneAndUpdate(
      { roomCode: roomCode },
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
    if (!req.body.roomCode)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const roomCode = req.body.roomCode;
    const songId = req.body.songId;

    await roomModel.find({ roomCode: roomCode }).then(async room => {
      const maxRoundsPhaseOne = room[0].maxRoundsPhaseOne;
      const round = room[0].round;
      const players = room[0].players;

      let currentPlayer = room[0].currentPlayer;

      const index = players.findIndex(p => p._id === currentPlayer?._id);
      if (index === players.length - 1) {
        currentPlayer = players[0];
      } else {
        currentPlayer = players[index + 1];
      }

      if (round === maxRoundsPhaseOne) {
        if (players.length > 1) {
          const sortedPlayers = players.sort((a, b) => b.score - a.score);
          const newPlayers = sortedPlayers.splice(0, Math.ceil(players.length / 2));
          const spectators = sortedPlayers.filter(player => !newPlayers.includes(player));
          currentPlayer = newPlayers[0];
          await roomModel.updateOne(
            { roomCode: roomCode },
            { players: newPlayers, currentPlayer: currentPlayer, spectators: spectators },
          );

          (req as ICustomRequest).io.in(roomCode).emit('updatePlayerList', newPlayers, spectators);
        }
      }
      if (!songId) {
        await roomModel.updateOne(
          { roomCode: roomCode },
          {
            currentPlayer: currentPlayer,
            isInSelectMode: true,
            $inc: { round: 1 },
            timer: room[0].maxTimer,
          },
        );
        (req as ICustomRequest).io.in(roomCode).emit('turnChange', currentPlayer);
        return res.status(200).json({ status: 'success', message: 'Turn changed' });
      }
      await roomModel.updateOne(
        { roomCode: roomCode, 'songs.songId': songId },
        {
          currentPlayer: currentPlayer,
          isInSelectMode: true,
          $inc: { round: 1 },
          timer: room[0].maxTimer,
          $set: { 'songs.$.completed': true },
        },
      );
      (req as ICustomRequest).io.in(roomCode).emit('turnChange', currentPlayer);
    });
    return res.status(200).json({ status: 'success', message: 'Turn changed' });
  } catch (error) {
    next(error);
  }
});

router.post('/checkAnswer', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.roomCode || !req.body.playerId || !req.body.songId || !req.body.time)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const roomCode = req.body.roomCode;
    const playerId = req.body.playerId;
    const playerAnswer = req.body.playerAnswer;
    const songId = req.body.songId;
    const time = req.body.time;
    const category = req.body.category;
    Timer(roomCode, 0, (req as ICustomRequest).io).stop();
    axios
      .get(`${apiUrl}/externalApi/songs/${songId}`)
      .then(response => response.data)
      .then(async response => {
        //update players.completedCategories for a player with player_id = player_id in room with roomCode = roomCode
        if (category) {
          await roomModel.findOneAndUpdate(
            {
              roomCode: roomCode,
              'players._id': playerId,
            },
            {
              $set: {
                'players.$.completedCategories.$[category].completed': true,
              },
            },
            {
              arrayFilters: [{ 'category.category': category }],
              new: true,
            },
          );
        }
        const correctAnswer = response.data;
        if (!correctAnswer) {
          return res.status(404).json({ status: 'error', message: 'Answer not found' });
        } else if (playerAnswer.toLowerCase().includes(correctAnswer.value.toLowerCase())) {
          const modifier = () => {
            if (songId.includes('final')) {
              return 3;
            } else if (songId.includes('artist')) {
              return 1.5;
            } else {
              return 1;
            }
          };

          const score = () => {
            switch (time) {
              case 1000:
                return 500 * modifier();
              case 3000:
                return 400 * modifier();
              case 6000:
                return 300 * modifier();
              case 12000:
                return 100 * modifier();
              default:
                return 0;
            }
          };

          axios.post(`${apiUrl}/externalApi/rooms/updateScore`, {
            roomCode: roomCode,
            playerId: playerId,
            score: score(),
          });
          return res.status(200).json({
            status: 'success',
            message: 'Correct answer',
            score: score(),
            playerId: playerId,
            answer: correctAnswer.value,
          });
        } else {
          axios.post(`${apiUrl}/externalApi/rooms/updateScore`, {
            roomCode: roomCode,
            playerId: playerId,
            score: 0,
          });
          return res.status(200).json({
            status: 'success',
            message: 'Wrong answer',
            score: 0,
            playerId: playerId,
            answer: correctAnswer.value,
          });
        }
      })
      .catch(error => {
        return res.status(500).json({ status: 'error', message: error.message });
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
    const roomCode = req.body.roomCode;
    const playerId = req.body.playerId;
    const score = req.body.score;

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

//update settings
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
    const roomCode = req.body.roomCode;
    const maxRoundsPhaseOne = req.body.maxRoundsPhaseOne;
    const maxRoundsPhaseTwo = req.body.maxRoundsPhaseTwo;
    const maxTimer = req.body.maxTimer;

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
