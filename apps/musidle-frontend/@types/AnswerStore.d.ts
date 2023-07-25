export interface ISongs {
  value: string;
  label: string;
  key: string;
}

export interface IAnswerStore {
  answer: string;
  setAnswer: (answer: string) => void;
  value: string;
  setValue: (value: string) => void;
  songs: ISongs[];
  setSongs: (songs: ISongs[]) => void;
  answerDialogOpen: boolean;
  setAnswerDialogOpen: (answerDialogOpen: boolean) => void;
  handleValueChange: (value: string) => void;
  handleAnswerSubmit: () => void;
  getPossibleSongAnswers: (query: string) => void;
}
