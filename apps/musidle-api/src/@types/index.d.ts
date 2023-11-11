export interface ISocketMiddleware {
  (req: Request & { io: Server }, res: Response, next: NextFunction): void;
}
export interface IUsers {
  id: string;
  socketId: string;
  roomCode: string | null;
}
