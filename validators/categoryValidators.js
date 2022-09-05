import { body } from 'express-validator';

const createCategoryValidators = [body('name').isLength({ min: 3 }).trim()];

export { createCategoryValidators };
