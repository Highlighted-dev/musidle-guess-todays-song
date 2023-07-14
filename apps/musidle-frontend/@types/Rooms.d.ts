export interface Room {
  _id: string;
  room_code: string;
  players: string[];
  maxRounds: number;
  round: number;
}
