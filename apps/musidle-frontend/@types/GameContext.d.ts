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
  handleRoomJoin: (room_id: string) => void;
  handleRoomCreate: () => void;
  isInLobby: boolean;
  hasPhaseOneStarted: boolean;
  togglePhaseOne: () => void;
  hasPhaseTwoStarted: boolean;
  hasPhaseThreeStarted: boolean;
  handleChooseCategory: (category: string) => void;
  handleChooseArtist: (artist: string) => void;
  answer: string;
  renderGame: boolean;
  value: string;
  handleValueChange: (value: string) => void;
  songs: ISongs[];
  searchSong: (query: string) => void;
  handleAnswerSubmit: () => void;
  submitRef: RefObject<HTMLButtonElement>;
  handleTurnChange: () => void;
};
