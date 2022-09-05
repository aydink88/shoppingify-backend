import { Router } from 'express';
import { createCategoryValidators } from '../middlewares/validators.js';
import { createCategory, getCategories } from '../controllers/category.js';
import authenticate from '../middlewares/authenticate.js';

const catRouter = Router();

catRouter.get('/', authenticate, getCategories);
catRouter.post('/', authenticate, createCategoryValidators, createCategory);

export default catRouter;
