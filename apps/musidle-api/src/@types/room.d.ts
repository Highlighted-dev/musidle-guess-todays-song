export interface IPlayer {
  _id: string;
  name: string;
  score: number;
  completedCategories: IPlayerCategories[];
  votedForTurnSkip: boolean;
}

export interface IUpdate {
  currentPlayer: IPlayer;
  isInSelectMode: boolean;
  $inc: { round: number };
  timer: number;
  stage: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  $set?: { 'songs.$.completed': boolean };
}

export interface IRoom {
  roomCode: string;
  players: IPlayer[];
  currentPlayer: IPlayer | null;
  spectators: IPlayer[];
  songId: string;
  stage: number;
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
