import { Router } from 'express';
import {
  createShoppingList,
  getAllShoppingListsOfUser,
  removeShoppingList,
  updateItem,
  updateShoppingList,
  getShoppingList,
  addItem,
} from '../controllers/shoppingList.js';
import { topItems, topCategories, monthlyStats } from '../controllers/stats.js';
import authenticate from '../middlewares/authenticate.js';
import {
  addItemValidators,
  createShoppingListValidators,
  mongoIdValidator,
  updateItemValidators,
  updateShoppingListValidators,
} from '../middlewares/validators.js';

const shoppingListRouter = Router();

shoppingListRouter.get('/', authenticate, getAllShoppingListsOfUser);
shoppingListRouter.post('/', authenticate, createShoppingListValidators, createShoppingList);
//shoppingListRouter.delete('/:id/removeitem', authenticate, removeItem);
shoppingListRouter.delete('/:id', authenticate, removeShoppingList);
shoppingListRouter.put('/:id/updateitem', authenticate, updateItemValidators, updateItem);
shoppingListRouter.put('/:id', authenticate, updateShoppingListValidators, updateShoppingList);
shoppingListRouter.post('/:id/additem', authenticate, mongoIdValidator, addItemValidators, addItem);
shoppingListRouter.get('/topitems', authenticate, topItems);
shoppingListRouter.get('/topcategories', authenticate, topCategories);
shoppingListRouter.get('/monthly', authenticate, monthlyStats);
shoppingListRouter.get('/:id', authenticate, mongoIdValidator, getShoppingList);

export default shoppingListRouter;
