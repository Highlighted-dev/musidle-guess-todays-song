export interface ISongs {
  value: string;
  key: string;
}

export interface IAnswerStore {
  answer: string | null;
  setAnswer: (answer: string) => void;
  value: string;
  setValue: (value: string) => void;
  artist: string | undefined;
  setArtist: (artist: string) => void;
  songs: ISongs[];
  setSongs: (songs: ISongs[]) => void;
  handleValueChange: (value: string) => void;
  handleAnswerSubmit: () => void;
  getPossibleSongAnswers: (query: string) => void;
  revealArtist: (song_id: string) => void;
}
