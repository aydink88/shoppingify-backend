import { Router } from 'express';
import { authValidators } from '../middlewares/validators.js';
import { register, login, myProfile } from '../controllers/auth.js';
import authenticate from '../middlewares/authenticate.js';

const authRouter = Router();

authRouter.post('/register', authValidators, register);
authRouter.post('/login', authValidators, login);
authRouter.get('/me', authenticate, myProfile);

export default authRouter;
