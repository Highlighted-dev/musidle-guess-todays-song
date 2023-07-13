export interface Room {
  _id: number;
  room_code: string;
  players: string[];
  maxRounds: number;
  round: number;
}
