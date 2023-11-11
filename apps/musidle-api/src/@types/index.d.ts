import { Request, Response, NextFunction } from 'express';
export interface ISocketMiddleware {
  (req: Request & { io: Server }, res: Response, next: NextFunction): void;
}
export interface ICustomRequest extends Request {
  io: Server;
}
export interface IUsers {
  id: string;
  socketId: string;
  roomCode: string | null;
}
