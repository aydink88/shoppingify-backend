import { Router } from 'express';
import { createItem, getAllItems, deleteItem, getItem } from '../controllers/item.js';
import authenticate from '../middlewares/authenticate.js';
import { createItemValidators, mongoIdValidator } from '../middlewares/validators.js';

const itemRouter = Router();

itemRouter.delete('/:id', authenticate, mongoIdValidator, deleteItem);
itemRouter.get('/:id', authenticate, mongoIdValidator, getItem);
itemRouter.post('/', authenticate, createItemValidators, createItem);
itemRouter.get('/', authenticate, getAllItems);

export default itemRouter;
