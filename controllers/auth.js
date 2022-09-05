import { compare } from 'bcrypt';
import { generateToken } from '../utils/token.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import User from '../models/User.js';

async function registerAsync(req, res) {
  const { email, password } = req.body;

  const user = await User.create({ email, password });
  const token = generateToken(user._id);
  user.password = undefined;
  res.status(201).send({ user, token });
}

async function loginAsync(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Authentication Failed', 401);
  }

  const passMatch = await compare(password, user.password);
  if (!passMatch) {
    throw new AppError('Authentication Failed', 401);
  }
  const token = generateToken(user._id);
  user.password = undefined;
  res.status(200).send({ user, token });
}

async function myProfileAsync(req, res) {
  const user = await User.findById(req.userId).select('-password');
  if (!user) {
    throw new AppError('Authentication Failed', 401);
  }
  return res.send({ user });
}

export const register = asyncHandler(registerAsync);
export const login = asyncHandler(loginAsync);
export const myProfile = asyncHandler(myProfileAsync);
