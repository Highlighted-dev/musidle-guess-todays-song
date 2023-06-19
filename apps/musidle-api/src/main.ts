import express from 'express';
import SearchTrackRoute from './routes/SearchTrackRoute';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
dotenv.config();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();
const mongodb_url = process.env.MONGODB_URL || 'musidle';
mongoose
  .connect(mongodb_url)
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Musidle API is listening on http://${host}:${port}`);
    });
  })
  .catch(error => {
    console.error(error);
  });
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use('/api/track/search/', SearchTrackRoute);
app.use('/api/auth/', UserAuthenticationRoute);
