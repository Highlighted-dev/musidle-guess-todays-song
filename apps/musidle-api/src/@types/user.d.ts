export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  guild: {
    _id: string | null;
    name: string | null;
  };
  settings: {
    volume: number;
  };
  stats: {
    correctAnswers: number;
    wrongAnswers: number;
    totalAnswers: number;
    totalGames: number;
    totalPoints: number;
  };
}
