export interface ISocketMiddleware {
  (req: Request & { io: Server }, res: Response, next: NextFunction): void;
}
export interface IUsers {
  id: string;
  socket_id: string;
  room_code: string | null;
}
