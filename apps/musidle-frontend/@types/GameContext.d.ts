export type player = {
  _id: string;
  name: string;
};

export interface ISongs {
  value: string;
  label: string;
  key: string;
}

export type GameContextType = {
  players: player[];
  addPlayer: (player: player) => void;
  hasGameStarted: boolean;
  toggleGame: () => void;
  handleChooseCategory: (category: string) => void;
  audio: HTMLAudioElement | null;
  answer: string;
  renderGame: boolean;
  currentPlayer: player | null;
  handleSkip: () => void;
  time: number;
  intervalId: NodeJS.Timeout | null;
  setIntervalId: (intervalId: NodeJS.Timeout) => void;
  handlePlay: () => void;
  audioTime: number;
  value: string;
  handleValueChange: (value: string) => void;
  songs: ISongs[];
  searchSong: (query: string) => void;
};
