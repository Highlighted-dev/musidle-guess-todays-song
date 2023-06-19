export type player = {
  _id: string;
  name: string;
};

export type GameContextType = {
  players: player[];
  addPlayer: (player: player) => void;
  hasGameStarted: boolean;
  toggleGame: () => void;
};
