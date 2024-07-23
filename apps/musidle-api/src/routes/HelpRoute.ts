import express from 'express';
import bodyParser from 'body-parser';
import { logger } from '../utils/Logger';
import bugReportModel from '../models/BugReportModel';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', async (req, res) => {
  const reports = await bugReportModel.find();
  if (!reports) {
    return res.status(404).json({ message: 'No reports found' });
  }
  res.status(200).json(reports);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const report = await bugReportModel.findById(id);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.status(200).json(report);
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const reports = await bugReportModel.find({ userId });
  if (!reports) {
    return res.status(404).json({ message: 'No reports found' });
  }
  res.status(200).json(reports);
});

router.put('/:id', jsonParser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const report = await bugReportModel.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    await bugReportModel.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: 'Report updated successfully' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Failed to update report' });
  }
});

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
