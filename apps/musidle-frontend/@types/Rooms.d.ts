export type IPlayer = {
  _id: string;
  name: string;
  score: number;
};
export interface IRoomStore {
  room_code: string;
  setRoomCode: (room_code: string) => void;
  players: player[];
  setPlayers: (players: player[]) => void;
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
  random: number;
  setTurnChangeDialogOpen: (turnChangeDialogOpen: boolean) => void;
  joinRoom: (room_code: string) => Promise<void>;
  createRoom: () => Promise<void>;
  leaveRoom: (router: Router) => void;
  startGame: () => void;
  updatePlayerScore: (points: number, player: player) => void;
  handleTurnChange: () => void;
  handleChooseCategory: (category: string, phase: number) => void;
  updateSettings: (maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number) => void;
}
export interface IRoom {
  _id: string;
  room_code: string;
  players: player[];
  maxRoundsPhaseOne: number;
  maxRoundsPhaseTwo: number;
  round: number;
}
