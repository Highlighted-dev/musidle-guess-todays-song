import { Session } from 'next-auth';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
export interface IAnswer {
  value: string;
  key: string;
}

export interface ISong {
  songId: string;
  category: string;
  completed: boolean;
  artist?: string;
}

export interface ILastFmSong {
  name: string;
  artist: string;
  url: string;
  image: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '#text': string;
    size: string;
  }[];
  mbid: string;
}

export interface IAnswerStore {
  loadingAnswer: boolean;
  answer: string | null;
  setAnswer: (answer: string) => void;
  value: string;
  setValue: (value: string) => void;
  artist: string | undefined;
  setArtist: (artist: string) => void;
  possibleAnswers: IAnswer[];
  setPossibleAnswers: (songs: IAnswer[]) => void;
  possibleSongs: ISong[];
  categories: any[] | undefined;
  setPossibleSongs: (songs: ISong[]) => void;
  handleValueChange: (value: string, session: Session | null) => void;
  handleAnswerSubmit: (router?: AppRouterInstance | null, session: Session | null) => void;
  getPossibleSongAnswers: (query: string) => void;
  revealArtist: (song_id: string) => void;
  changeSongToCompleted: (song_id: string) => void;
}
