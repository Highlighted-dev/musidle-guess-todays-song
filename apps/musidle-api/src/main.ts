import express from 'express';
import SearchTrackRoute from './routes/SearchTrackRoute';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});
app.use(cors({ origin: 'http://localhost:4200' }));
app.use('/api/track/search/', SearchTrackRoute);

app.listen(port, host, () => {
  console.log(`Musidle API is listening on http://${host}:${port}`);
});
