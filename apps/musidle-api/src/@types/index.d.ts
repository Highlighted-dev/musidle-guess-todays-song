export interface ISocketMiddleware {
  (req: Request & { io: Server }, res: Response, next: NextFunction): void;
}
