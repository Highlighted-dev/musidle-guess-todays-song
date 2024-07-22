import { Schema, model, Document } from 'mongoose';

interface IBugReportModel extends Document {
  description: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const bugReportSchema = new Schema<IBugReportModel>(
  {
    description: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' },
  },
  { versionKey: false, timestamps: true },
);
const bugReportModel = model<IBugReportModel>('BugReports', bugReportSchema, 'bug_reports');
export default bugReportModel;
