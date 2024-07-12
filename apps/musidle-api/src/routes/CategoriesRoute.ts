import { Router, Request, Response, NextFunction } from 'express';
import categoryModel from '../models/CategoryModel';
import bodyParser from 'body-parser';
import { logger } from '../utils/Logger';

interface ICustomResponse extends Response {
  category?: any;
}

const router = Router();
const jsonParser = bodyParser.json();

//Route to GET all categories
router.get('/', async (req: Request, res: ICustomResponse) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get categories' });
  }
});

//Route to GET a specific category by ID
router.get('/:id', getCategory, (req: Request, res: ICustomResponse) => {
  try {
    res.status(200).json(res.category);
  } catch (error) {
    logger.error(error);
  }
});

//Route to CREATE a new category
router.post('/', jsonParser, async (req: Request, res: Response) => {
  try {
    const category = new categoryModel({
      category: req.body.category,
    });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    logger.error(error);
  }
});

//Route to UPDATE a category by ID
router.put('/:id', getCategory, jsonParser, async (req: Request, res: ICustomResponse) => {
  try {
    if (!req.body.category) return res.status(400).json({ message: 'Missing required fields' });
    res.category.category = req.body.category;
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to update category' });
  }
});

// DELETE a category by ID
router.delete('/:id', getCategory, async (req: Request, res: ICustomResponse) => {
  try {
    await res.category.remove();
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

// Middleware function to get a category by ID
async function getCategory(req: Request, res: ICustomResponse, next: NextFunction) {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Cannot find category' });
    }

    res.category = category;
    next();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get category' });
  }
}

export default router;
