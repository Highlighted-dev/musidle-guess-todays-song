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
  handleChooseCategory: (category: string) => void;
  handleChooseArtist: (artist: string) => void;
  searchSong: (query: string) => void;
};
