import express from 'express';
import path from 'path';
import { imagesModel } from '../models/ImageModel';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../assets/images'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();
const jsonParser = bodyParser.json();

router.use('/', express.static(path.join(__dirname, '../assets/images')));

router.post('/', upload.single('file'), jsonParser, async (req, res, next) => {
  try {
    const { description } = req.body;
    const name = req.file?.filename.split('.').shift();
    const type = req.file?.filename.split('.').pop();
    const url = `${process.env.API_URL}/externalApi/images/${name}.${type}`;
    const image = new imagesModel({ url, description, type, name });
    await image.save();
    return res.status(201).json(image);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const images = await imagesModel.find();
    return res.status(200).json(images);
  } catch (error) {
    next(error);
  }
});

export default router;
