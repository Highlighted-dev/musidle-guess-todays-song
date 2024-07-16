import express from 'express';
import bodyParser from 'body-parser';
import { logger } from '../utils/Logger';
import bugReportModel from '../models/BugReportModel';

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/report', jsonParser, async (req, res) => {
  try {
    const { description, userId } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description and UserId are required' });
    }

    bugReportModel.create({ description, userId });
    res.status(200).json({ message: 'Problem reported successfully' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Failed to report problem' });
  }
});

export default router;
