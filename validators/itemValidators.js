import { body, param } from 'express-validator';

const createItemValidators = [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('note').optional().trim(),
  body('image').optional().trim().isURL(),
];

const singleItemValidators = [param('id').notEmpty().isMongoId()];

export { createItemValidators, singleItemValidators };
