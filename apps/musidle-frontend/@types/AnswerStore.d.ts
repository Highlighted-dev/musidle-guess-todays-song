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
  answer: string | null;
  setAnswer: (answer: string) => void;
  value: string;
  setValue: (value: string) => void;
  artist: string | undefined;
  setArtist: (artist: string) => void;
  possibleAnswers: IAnswer[];
  setPossibleAnswers: (songs: IAnswer[]) => void;
  possibleSongs: ISong[];
  setPossibleSongs: (songs: ISong[]) => void;
  handleValueChange: (value: string) => void;
  handleAnswerSubmit: () => void;
  getPossibleSongAnswers: (query: string) => void;
  revealArtist: (song_id: string) => void;
  changeSongToCompleted: (song_id: string) => void;
}
