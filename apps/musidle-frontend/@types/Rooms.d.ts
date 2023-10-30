import { Session } from 'next-auth';
import { Socket } from 'socket.io-client';

export type IPlayer = {
  _id: string;
  name: string;
  score: number;
};

export type IUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  activated: boolean;
};
export interface IRoomStore {
  room_code: string;
  setRoomCode: (room_code: string) => void;
  players: player[];
  setPlayers: (players: player[]) => void;
  spectators: player[];
  setSpectators: (spectators: player[]) => void;
  round: number;
  setRound: (round: number) => void;
  maxRoundsPhaseOne: number;
  setMaxRoundsPhaseOne: (maxRounds: number) => void;
  maxRoundsPhaseTwo: number;
  setMaxRoundsPhaseTwo: (maxRounds: number) => void;
  isInLobby: boolean;
  setIsInLobby: (isInLobby: boolean) => void;
  currentPlayer: player | null;
  setCurrentPlayer: (player: player) => void;
  selectMode: boolean;
  setSelectMode: (renderGame: boolean) => void;
  turnChangeDialogOpen: boolean;
  setTurnChangeDialogOpen: (turnChangeDialogOpen: boolean) => void;
  joinRoom: (room: any, user: IUser | undefined) => Promise<void>;
  leaveRoom: (router: Router, user_id: string | null = null) => void;
  startGame: () => Promise<void>;
  updatePlayerScore: (points: number, player: player) => void;
  handleTurnChange: () => void;
  handleChooseCategory: (
    category: string,
    phase: number,
    socket: Socket | null = null,
  ) => Promise<string>;
  updateSettings: (maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number) => Promise<void>;
}
export interface IRoom {
  _id: string;
  room_code: string;
  players: player[];
  spectators: player[];
  currentPlayer: player | null;
  song_id: string | null;
  maxRoundsPhaseOne: number;
  maxRoundsPhaseTwo: number;
  round: number;
  isInGameLobby: boolean;
  isInSelectmode: boolean;
  timer: number;
  songs: song[];
}
