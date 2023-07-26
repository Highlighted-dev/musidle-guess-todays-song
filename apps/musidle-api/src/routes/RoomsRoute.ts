import express, { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import roomModel from '../models/RoomModel';
import bodyParser from 'body-parser';
import axios from 'axios';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

interface ICustomRequest extends Request {
  io: Server;
}

router.post('/join', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const room_id = req.body.room_id;
    let room = await roomModel.findOne({ room_code: room_id });
    if (!room) {
      await roomModel.create({
        room_code: room_id,
        players: [req.body.player || []],
        maxRounds: 2,
        round: 1,
      });
    } else if (!room.players.some(player => player._id === req.body.player._id)) {
      await roomModel.updateOne({ room_code: room_id }, { $push: { players: req.body.player } });
      (req as ICustomRequest).io.in(room_id).emit('addPlayer', req.body.player);
    }
    room = await roomModel.findOne({ room_code: room_id });
    return res.json(room);
  } catch (error) {
    next(error);
  }
});

router.post('/create', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.player)
      return res.status(400).json({ message: 'At least one player is required' });
    let room_id;
    //random room_id
    while (true) {
      room_id = Math.random().toString(36).substr(2, 5);
      if ((await roomModel.findOne({ room_code: room_id })) === null) {
        req.body.room_id = room_id;
        break;
      }
    }
    //roomModel.schema.paths.maxRoundsPhaseOne.options.default just means get the default value assigned to maxRoundsPhaseOne in the schema
    await roomModel.create({
      room_code: room_id,
      players: [req.body.player],
      maxRoundsPhaseOne: req.body.maxRoundsPhaseOne
        ? req.body.maxRoundsPhaseOne
        : roomModel.schema.paths.maxRoundsPhaseOne.options.default,
      maxRoundsPhaseTwo: req.body.maxRoundsPhaseTwo
        ? req.body.maxRoundsPhaseTwo
        : roomModel.schema.paths.maxRoundsPhaseTwo.options.default,
      round: 1,
    });
    const room = await roomModel.findOne({ room_code: room_id });
    return res.json(room);
  } catch (error) {
    next(error);
  }
});

router.post('/leave', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.room_code || !req.body.player_id)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const room_code = req.body.room_code;
    const player_id = req.body.player_id;

    const room = await roomModel.findOne({ room_code: room_code });

    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    // If the player is the only one in the room, delete the room
    if (room.players.length === 1) {
      await roomModel.deleteOne({ room_code: room_code });
      return res.status(200).json({ status: 'success', message: 'Room deleted' });
    }

    await roomModel.updateOne({ room_code: room_code }, { $pull: { players: { _id: player_id } } });

    return res.status(200).json({ status: 'success', message: 'Player removed' });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await roomModel.find();
    return res.json({ status: 'success', data: rooms });
  } catch (error) {
    next(error);
  }
});

router.post('/changeRound', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.room_code)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const room_code = req.body.room_code;

    const room = await roomModel.findOne({ room_code: room_code });

    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    await roomModel.updateOne({ room_code: room_code }, { $inc: { round: 1 } });

    return res.status(200).json({ status: 'success', message: 'Round changed' });
  } catch (error) {
    next(error);
  }
});

router.post('/checkAnswer', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.room_code || !req.body.player_id || !req.body.song_id || !req.body.time)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const room_code = req.body.room_code;
    const player_id = req.body.player_id;
    const player_answer = req.body.player_answer;
    const song_id = req.body.song_id;
    const time = req.body.time;

    axios
      .get(`http://localhost:5000/api/answers/${song_id}`)
      .then(response => response.data)
      .then(response => {
        const correctAnswer = response.data;
        if (!correctAnswer) {
          return res.status(404).json({ status: 'error', message: 'Answer not found' });
        } else if (correctAnswer.value.toLowerCase() === player_answer.toLowerCase()) {
          const score = () => {
            switch (time) {
              case 1000:
                return 500;
              case 3000:
                return 400;
              case 6000:
                return 300;
              case 12000:
                return 100;
              default:
                return 0;
            }
          };

          axios.post('http://localhost:5000/api/rooms/updateScore', {
            room_code: room_code,
            player_id: player_id,
            score: score(),
          });
          return res.status(200).json({
            status: 'success',
            message: 'Correct answer',
            data: {
              score: score(),
              player_id: player_id,
              answer: correctAnswer.value,
            },
          });
        } else {
          axios.post('http://localhost:5000/api/rooms/updateScore', {
            room_code: room_code,
            player_id: player_id,
            score: 0,
          });
          return res.status(200).json({
            status: 'success',
            message: 'Wrong answer',
            data: {
              score: 0,
              player_id: player_id,
              answer: correctAnswer.value,
            },
          });
        }
      });
  } catch (error) {
    next(error);
  }
});

router.post('/updateScore', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.room_code || !req.body.player_id || req.body.score === undefined) {
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }
    const room_code = req.body.room_code;
    const player_id = req.body.player_id;
    const score = req.body.score;

    await roomModel.findOneAndUpdate(
      { room_code: room_code, 'players._id': player_id },
      { $inc: { 'players.$.score': score } },
      { new: true },
    );

    const room = await roomModel.findOne({ room_code: room_code, 'players._id': player_id });
    console.log(room);
    return res.status(200).json({ status: 'success', message: 'Score updated' });
  } catch (error) {
    next(error);
  }
});

export default router;
