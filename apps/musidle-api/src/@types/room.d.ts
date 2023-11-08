export interface IPlayer {
  _id: string;
  name: string;
  score: number;
  completedCategories: [
    {
      category: string;
      completed: boolean;
    },
  ];
  votedForTurnSkip: boolean;
}

export interface IRoomModel {
  room_code: string;
  players: IPlayer[];
  current_player: IPlayer | null;
  spectators: IPlayer[];
  song_id: string;
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
      song_id: string;
      category: string;
      completed: boolean;
    },
  ];
}
