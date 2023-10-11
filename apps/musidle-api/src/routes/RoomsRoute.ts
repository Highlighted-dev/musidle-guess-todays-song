import express, { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import roomModel from '../models/RoomModel';
import bodyParser from 'body-parser';
import axios from 'axios';
import Timer from '../utils/Timer';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

interface ICustomRequest extends Request {
  io: Server;
}

router.post('/join', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const room_id = req.body.room_id;

    //check if player is in any other room

    // const player_room = await roomModel.find({ 'players._id': req.body.player._id });
    // console.log(player_room[0]);
    // if (player_room.length > 0) return res.json(player_room[0]);

    let room = await roomModel.findOne({ room_code: room_id });
    const categories = await axios
      .get('http://localhost:5000/api/categories')
      .then(response => response.data);
    const player = req.body.player;
    player.completedCategories = categories.map((category: any) => {
      return {
        category: category.category,
        completed: false,
      };
    });
    if (!room) {
      const songs = await axios
        .post('http://localhost:5000/api/songs/possibleSongs', {
          maxRoundsPhaseOne: req.body.maxRoundsPhaseOne,
          maxRoundsPhaseTwo: req.body.maxRoundsPhaseTwo,
        })
        .then(response => response.data);

      await roomModel.create({
        room_code: room_id,
        players: [player],
        maxRoundsPhaseOne: req.body.maxRoundsPhaseOne
          ? req.body.maxRoundsPhaseOne
          : roomModel.schema.paths.maxRoundsPhaseOne.options.default,
        maxRoundsPhaseTwo: req.body.maxRoundsPhaseTwo
          ? req.body.maxRoundsPhaseTwo
          : roomModel.schema.paths.maxRoundsPhaseTwo.options.default,
        round: 1,
        isInGameLobby: true,
        isInSelectMode: true,
        songs: songs.data.songs,
      });
    } else if (
      !room.players.some(player => player._id === req.body.player._id) &&
      !room.spectators.some(spectator => spectator._id === req.body.player._id)
    ) {
      //add player to spectators if game has already started
      if (room?.round > 1) {
        room = await roomModel.findOneAndUpdate(
          { room_code: room_id },
          { $push: { spectators: req.body.player } },
          { new: true },
        );
        (req as ICustomRequest).io
          .in(room_id)
          .emit('updatePlayerList', room?.players, room?.spectators);
        return res.json(room);
      }
      room = await roomModel.findOneAndUpdate(
        { room_code: room_id },
        { $push: { players: req.body.player } },
        { new: true },
      );
      (req as ICustomRequest).io.in(room_id).emit('updatePlayerList', room?.players);
      return res.json(room);
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
    const player_room = await roomModel.find({ 'players._id': req.body.player._id });
    if (player_room.length > 0) return res.json(player_room[0]);
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
    const songs = await axios
      .post('http://localhost:5000/api/songs/possibleSongs', {
        maxRoundsPhaseOne: req.body.maxRoundsPhaseOne,
        maxRoundsPhaseTwo: req.body.maxRoundsPhaseTwo,
      })
      .then(response => response.data);
    const categories = await axios
      .get('http://localhost:5000/api/categories')
      .then(response => response.data);
    const player = req.body.player;
    player.completedCategories = categories.map((category: any) => {
      return {
        category: category.category,
        completed: false,
      };
    });
    await roomModel.create({
      room_code: room_id,
      players: [player],
      maxRoundsPhaseOne: req.body.maxRoundsPhaseOne
        ? req.body.maxRoundsPhaseOne
        : roomModel.schema.paths.maxRoundsPhaseOne.options.default,
      maxRoundsPhaseTwo: req.body.maxRoundsPhaseTwo
        ? req.body.maxRoundsPhaseTwo
        : roomModel.schema.paths.maxRoundsPhaseTwo.options.default,
      round: 1,
      isInGameLobby: true,
      isInSelectMode: true,
      songs: songs.data.songs,
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

    let room = await roomModel.findOne({ room_code: room_code });

    if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

    // If the player is the only one in the room, delete the room
    if (room.players.length === 1) {
      await roomModel.deleteOne({ room_code: room_code });
      Timer(room_code, 0, (req as ICustomRequest).io).stop();
      return res.status(200).json({ message: 'Room deleted' });
    }

    room = await roomModel.findOneAndUpdate(
      { room_code: room_code },
      { $pull: { players: { _id: player_id } } },
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

router.get('/:room_code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const room_code = req.params.room_code;

    const room = await roomModel.findOne({ room_code: room_code });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    return res.status(200).json(room);
  } catch (error) {
    next(error);
  }
});

router.post('/start', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  const room_code = req.body.room_code;
  if (!room_code) return res.status(400).json({ status: 'error', message: 'Missing parameters' });
  const room = await roomModel.findOne({ room_code: room_code });
  if (!room) return res.status(404).json({ status: 'error', message: 'Room not found' });

  const random = Math.floor(Math.random() * room.players.length);
  const current_player = room.players[random];

  (req as ICustomRequest).io.in(room_code).emit('togglePhaseOne', current_player);

  await roomModel.findOneAndUpdate(
    { room_code: room_code },
    { current_player: current_player, isInGameLobby: false },
  );

  return res.status(200).json({ status: 'success', message: 'Game started' });
});

router.post('/turnChange', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.room_code || !req.body.song_id)
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    const room_code = req.body.room_code;
    const song_id = req.body.song_id;

    await roomModel.find({ room_code: room_code }).then(async room => {
      const maxRoundsPhaseOne = room[0].maxRoundsPhaseOne;
      const round = room[0].round;
      const players = room[0].players;

      let current_player = room[0].current_player;

      const index = players.findIndex(p => p._id === current_player?._id);
      if (index === players.length - 1) {
        current_player = players[0];
      } else {
        current_player = players[index + 1];
      }

      if (round === maxRoundsPhaseOne) {
        if (players.length > 1) {
          const sortedPlayers = players.sort((a, b) => b.score - a.score);
          const newPlayers = sortedPlayers.splice(0, Math.ceil(players.length / 2));
          const spectators = sortedPlayers.filter(player => !newPlayers.includes(player));
          current_player = newPlayers[0];
          await roomModel.updateOne(
            { room_code: room_code },
            { players: newPlayers, currentPlayer: current_player, spectators: spectators },
          );

          (req as ICustomRequest).io.in(room_code).emit('updatePlayerList', newPlayers, spectators);
        }
      }

      await roomModel.updateOne(
        { room_code: room_code, 'songs.song_id': song_id },
        {
          current_player: current_player,
          isInSelectMode: true,
          $inc: { round: 1 },
          timer: 35,
          $set: { 'songs.$.completed': true },
        },
      );
      (req as ICustomRequest).io.in(room_code).emit('turnChange', current_player);
    });
    return res.status(200).json({ status: 'success', message: 'Turn changed' });
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
    const category = req.body.category;
    Timer(room_code, 0, (req as ICustomRequest).io).stop();
    axios
      .get(`http://localhost:5000/api/songs/${song_id}`)
      .then(response => response.data)
      .then(async response => {
        const correctAnswer = response.data;
        if (!correctAnswer) {
          return res.status(404).json({ status: 'error', message: 'Answer not found' });
        } else if (player_answer.toLowerCase().includes(correctAnswer.value.toLowerCase())) {
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

          //update players.completedCategories for a player with player_id = player_id in room with room_code = room_code
          if (category) {
            await roomModel.findOneAndUpdate(
              {
                room_code: room_code,
                'players._id': player_id,
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

    return res.status(200).json({ status: 'success', message: 'Score updated' });
  } catch (error) {
    next(error);
  }
});

//update settings
router.put('/settings', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.room_code || !req.body.maxRoundsPhaseOne || !req.body.maxRoundsPhaseTwo) {
      return res.status(400).json({ status: 'error', message: 'Missing parameters' });
    }
    const room_code = req.body.room_code;
    const maxRoundsPhaseOne = req.body.maxRoundsPhaseOne;
    const maxRoundsPhaseTwo = req.body.maxRoundsPhaseTwo;

    await roomModel.findOneAndUpdate(
      { room_code: room_code },
      { maxRoundsPhaseOne: maxRoundsPhaseOne, maxRoundsPhaseTwo: maxRoundsPhaseTwo },
    );
    (req as ICustomRequest).io
      .in(room_code)
      .emit('roomSettingsUpdate', maxRoundsPhaseOne, maxRoundsPhaseTwo);

    return res.status(200).json({ status: 'success', message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
});

export default router;
