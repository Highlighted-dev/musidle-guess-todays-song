import { Router, Request, Response, NextFunction } from 'express';
import categoryModel from '../models/CategoryModel';
import bodyParser from 'body-parser';

interface ICustomResponse extends Response {
  category?: any;
}

const router = Router();
const jsonParser = bodyParser.json();

// GET all categories
router.get('/', async (req: Request, res: ICustomResponse, next: NextFunction) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// GET a specific category by ID
router.get('/:id', getCategory, (req: Request, res: ICustomResponse, next: NextFunction) => {
  try {
    res.status(200).json(res.category);
  } catch (err) {
    next(err);
  }
});

// CREATE a new category
router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = new categoryModel({
      category: req.body.category,
    });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

// UPDATE a category by ID
router.put(
  '/:id',
  getCategory,
  jsonParser,
  async (req: Request, res: ICustomResponse, next: NextFunction) => {
    try {
      if (req.body.category == null)
        return res.status(400).json({ message: 'Missing required fields' });
      res.category.category = req.body.category;
      const updatedCategory = await res.category.save();
      res.json(updatedCategory);
    } catch (err) {
      next(err);
    }
  },
);

// DELETE a category by ID
router.delete(
  '/:id',
  getCategory,
  async (req: Request, res: ICustomResponse, next: NextFunction) => {
    try {
      await res.category.remove();
      res.json({ message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  },
);

// Middleware function to get a category by ID
async function getCategory(req: Request, res: ICustomResponse, next: NextFunction) {
  let category;

  try {
    category = await categoryModel.findById(req.params.id);

    if (category == null) {
      return res.status(404).json({ message: 'Cannot find category' });
    }
  } catch (err) {
    next(err);
  }

  res.category = category;
  next();
}

export default router;
