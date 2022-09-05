import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export default function authenticate(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'unauthorized' });
  }
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    next(new AppError('Invalid token', 403));
  }
}
