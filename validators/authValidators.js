import { body } from 'express-validator';

const authValidators = [
  body('email').isEmail().normalizeEmail().trim(),
  body('password').notEmpty().trim(),
];

export { authValidators };
