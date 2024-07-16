import { Schema, model, Document } from 'mongoose';

interface IBugReportModel extends Document {
  description: string;
  userId: string;
}

const bugReportSchema = new Schema<IBugReportModel>(
  {
    description: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { versionKey: false },
);
const bugReportModel = model<IBugReportModel>('BugReports', bugReportSchema, 'bug_reports');
export default bugReportModel;
