import { Socket } from 'socket.io-client';

export type IPlayer = {
  id: string;
  name: string;
  score: number;
  completedCategories: IPlayerCategories[];
  votedForTurnSkip: boolean;
};

export interface IRoomStore {
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  players: IPlayer[];
  setPlayers: (players: IPlayer[]) => void;
  spectators: IPlayer[];
  setSpectators: (spectators: IPlayer[]) => void;
  round: number;
  stage: number;
  setRound: (round: number) => void;
  maxRoundsPhaseOne: number;
  setMaxRoundsPhaseOne: (maxRounds: number) => void;
  maxRoundsPhaseTwo: number;
  setMaxRoundsPhaseTwo: (maxRounds: number) => void;
  isInLobby: boolean;
  setIsInLobby: (isInLobby: boolean) => void;
  currentPlayer: IPlayer | null;
  setCurrentPlayer: (player: IPlayer) => void;
  selectMode: boolean;
  setSelectMode: (renderGame: boolean) => void;
  turnChangeDialogOpen: boolean;
  setTurnChangeDialogOpen: (turnChangeDialogOpen: boolean) => void;
  leaveRoom: (router: Router, userId: string | null = null) => void;
  updatePlayerScore: (points: number, player: IPlayer) => void;
  handleTurnChange: () => void;
  handleChooseCategory: (
    category: string,
    phase: number,
    socket: Socket | null = null,
  ) => Promise<void>;

  votesForTurnSkip: number;
  voteForTurnSkip: (socket: Socket | null) => void;
}
export interface IRoom {
  _id: string;
  roomCode: string;
  players: IPlayer[];
  spectators: IPlayer[];
  currentPlayer: IPlayer | null;
  songId: string | null;
  maxRoundsPhaseOne: number;
  maxRoundsPhaseTwo: number;
  round: number;
  isInGameLobby: boolean;
  isInSelectmode: boolean;
  timer: number;
  songs: song[];
}
