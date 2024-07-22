export interface IBugReport {
  _id: string;
  description: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
