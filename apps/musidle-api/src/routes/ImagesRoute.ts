import express from 'express';
import path from 'path';
import { imagesModel } from '../models/ImageModel';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// Configure multer storage
const storage = multer.diskStorage({
  // Set destination for uploaded files
  destination: path.join(__dirname, '../assets/images'),
  // Use original file name
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();
const jsonParser = bodyParser.json();

// Serve static files from the images directory
router.use('/', express.static(path.join(__dirname, '../assets/images')));

// Handle POST requests to upload images
router.post('/', upload.single('file'), jsonParser, async (req, res, next) => {
  try {
    const { description } = req.body;
    const name = req.file?.filename.split('.').shift();
    const type = req.file?.filename.split('.').pop();
    // Construct URL for the uploaded image
    const url = `${process.env.API_URL}/externalApi/images/${name}.${type}`;

    // Create new image document and save it to the database
    const image = new imagesModel({ url, description, type, name });
    await image.save();

    return res.status(201).json(image);
  } catch (error) {
    next(error);
  }
});

// Handle GET requests to fetch all images
router.get('/', async (req, res, next) => {
  try {
    const images = await imagesModel.find();
    return res.status(200).json(images);
  } catch (error) {
    next(error);
  }
});

export default router;
