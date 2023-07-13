import { RefObject } from 'react';

export type player = {
  _id: string;
  name: string;
  score: number;
};

export interface ISongs {
  value: string;
  label: string;
  key: string;
}

export type GameContextType = {
  players: player[];
  handleRoomJoin: (room_id: string) => void;
  handleRoomCreate: () => void;
  roomId: string;
  isInLobby: boolean;
  hasPhaseOneStarted: boolean;
  togglePhaseOne: () => void;
  hasPhaseTwoStarted: boolean;
  hasPhaseThreeStarted: boolean;
  handleChooseCategory: (category: string) => void;
  handleChooseArtist: (artist: string) => void;
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
  handleAnswerSubmit: () => void;
  submitRef: RefObject<HTMLButtonElement>;
  handleTurnChange: () => void;
};
