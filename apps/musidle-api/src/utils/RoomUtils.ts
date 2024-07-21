import { ICustomRequest } from '../@types';
import { ICategory } from '../@types/categories';
import { IPlayer, IRoom, IUpdate } from '../@types/room';
import roomModel from '../models/RoomModel';
import { Request } from 'express';
import userModel from '../models/UserModel';
import { logger } from './Logger';

export async function generateRoomCode() {
  let roomCode;
  while (true) {
    roomCode = Math.random().toString(36).substr(2, 5);
    if ((await roomModel.findOne({ roomCode })) === null) {
      break;
    }
  }
  return roomCode;
}

export function preparePlayer(player: IPlayer, categories: ICategory[]) {
  player.score = 0;
  player.completedCategories = categories.map((category: ICategory) => ({
    category: category.category,
    completed: false,
  }));
  player.votedForTurnSkip = false;
  return player;
}

export function isRoomEmpty(room: IRoom) {
  return (
    (room.players.length === 0 && room.spectators.length === 0) ||
    (room.players.length === 0 && room.spectators.length === 0)
  );
}

export function getNextPlayer(players: IPlayer[], currentPlayer: IPlayer | null) {
  if (!currentPlayer) return players[0];
  const index = players.findIndex(p => p.id === currentPlayer?.id);
  if (index === players.length - 1) {
    return players[0];
  } else {
    return players[index + 1];
  }
}

export async function updateRoomAfterTurnChange(
  roomCode: string,
  currentPlayer: IPlayer,
  room: IRoom,
  req: Request,
) {
  const update: IUpdate = {
    currentPlayer: currentPlayer,
    isInSelectMode: true,
    $inc: { round: 1 },
    timer: room.maxTimer,
    stage: 1,
  };

  await roomModel.updateOne({ roomCode: roomCode }, update);
  (req as ICustomRequest).io?.in(roomCode).emit('turnChange', currentPlayer);
}

export function getNewPlayersAndSpectators(players: IPlayer[]) {
  const sortedPlayers = players.sort((a, b) => b.score - a.score);
  const newPlayers = sortedPlayers.splice(0, Math.ceil(players.length / 2));
  const spectators = sortedPlayers.filter(player => !newPlayers.includes(player));
  return { newPlayers, spectators };
}

export function calculateScore(time: number, songId: string) {
  const modifier = songId.includes('final') ? 3 : songId.includes('artist') ? 1.5 : 1;
  switch (time) {
    case 1000:
      return 500 * modifier;
    case 3000:
      return 400 * modifier;
    case 6000:
      return 300 * modifier;
    case 12000:
      return 100 * modifier;
    default:
      return 0;
  }
}

export async function updateUserStats(playerId: string, isAnswerCorrect: boolean, score: number) {
  const user = await userModel.findById(playerId);
  if (user) {
    user.stats.totalAnswers += 1;
    if (isAnswerCorrect) {
      user.stats.correctAnswers += 1;
      user.stats.totalPoints += score;
    } else {
      user.stats.wrongAnswers += 1;
    }
    await user.save();
  } else {
    logger.error(`User with id ${playerId} not found`);
  }
}
