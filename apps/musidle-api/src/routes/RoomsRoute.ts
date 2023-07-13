import express, { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import roomModel from '../models/RoomModel';
import bodyParser from 'body-parser';
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
        players: [req.body.player],
        maxRounds: 2,
        round: 0,
      });
    } else if (!room.players.some(player => player._id === req.body.player._id)) {
      await roomModel.updateOne(
        { room_code: req.body.room_id },
        { $push: { players: req.body.player } },
      );
      (req as ICustomRequest).io.emit('addPlayer', req.body.player);
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
    await roomModel.create({
      room_code: room_id,
      players: [req.body.player],
      maxRounds: 2,
      round: 0,
    });
    const room = await roomModel.findOne({ room_code: room_id });
    return res.json(room);
  } catch (error) {
    next(error);
  }
});

router.post('/leave', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
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

export default router;
