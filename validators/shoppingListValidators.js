import { body, param } from 'express-validator';

const createShoppingListValidators = [
  body('name').notEmpty().trim(),
  body('items').optional().isArray(),
];
const updateShoppingListValidators = [
  body('name').optional().trim(),
  body('status').optional().trim(),
  body('items').optional().isArray(),
];
const changeShoppingListNameValidators = [body('name').notEmpty().trim()];
const addItemValidators = [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('note').optional().trim(),
  body('image').optional().trim().isURL(),
  body('amount').optional().isNumeric(),
];
const updateItemValidators = [
  param('id').notEmpty().isMongoId(),
  body('_id').notEmpty().isMongoId(),
  body('amount').notEmpty().isNumeric(),
  body('done').notEmpty().isBoolean(),
];

export {
  createShoppingListValidators,
  updateShoppingListValidators,
  changeShoppingListNameValidators,
  addItemValidators,
  updateItemValidators,
};
