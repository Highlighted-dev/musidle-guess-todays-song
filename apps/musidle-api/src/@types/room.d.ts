export interface IPlayer {
  _id: string;
  name: string;
  score: number;
  completedCategories: IPlayerCategories[];
  votedForTurnSkip: boolean;
}

export interface IRoomModel {
  roomCode: string;
  players: IPlayer[];
  currentPlayer: IPlayer | null;
  spectators: IPlayer[];
  songId: string;
  maxRoundsPhaseOne: number;
  maxRoundsPhaseTwo: number;
  round: number;
  isInGameLobby: boolean;
  isInSelectMode: boolean;
  timer: number;
  maxTimer: number;
  votesForTurnSkip: number;
  songs: [
    {
      songId: string;
      category: string;
      completed: boolean;
    },
  ];
}
