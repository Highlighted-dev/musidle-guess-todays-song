import express, { Router, Request } from 'express';
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

router.post('/join', jsonParser, async (req, res) => {
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
});

export default router;
