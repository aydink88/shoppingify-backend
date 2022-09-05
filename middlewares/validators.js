import { body, param, validationResult } from 'express-validator';
import AppError from '../utils/appError.js';

const validationErrorMiddleware = (req, _res, next) => {
  if (validationResult(req).errors.length) {
    throw new AppError('Invalid Fields', 400);
  }
  next();
};

export const authValidators = [
  body('email').isEmail().normalizeEmail().trim(),
  body('password').notEmpty().trim(),
  validationErrorMiddleware,
];

export const createCategoryValidators = [
  body('name').isLength({ min: 3 }).trim(),
  validationErrorMiddleware,
];

export const createItemValidators = [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('note').optional().trim(),
  body('image').optional().trim().isURL(),
  validationErrorMiddleware,
];

export const mongoIdValidator = [param('id').notEmpty().isMongoId(), validationErrorMiddleware];

export const createShoppingListValidators = [
  body('name').notEmpty().trim(),
  body('items').optional().isArray(),
  validationErrorMiddleware,
];
export const updateShoppingListValidators = [
  body('name').optional().trim(),
  body('status').optional().trim(),
  body('items').optional().isArray(),
  validationErrorMiddleware,
];
export const changeShoppingListNameValidators = [body('name').notEmpty().trim()];
export const addItemValidators = [
  body('id').notEmpty().isMongoId(),
  body('amount').optional().isNumeric(),
  body('done').optional().isBoolean(),
  validationErrorMiddleware,
];
export const updateItemValidators = [
  param('id').notEmpty().isMongoId(),
  body('_id').notEmpty().isMongoId(),
  body('amount').notEmpty().isNumeric(),
  body('done').notEmpty().isBoolean(),
  validationErrorMiddleware,
];
