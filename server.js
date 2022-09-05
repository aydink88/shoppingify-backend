import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import shoppingListRoutes from './routes/shoppingList.js';
import itemRoutes from './routes/item.js';
import AppError from './utils/appError.js';
import errorHandler from './middlewares/errorHandler.js';
import cors from 'cors';
import helmet from 'helmet';

const __dirname = path.resolve();

dotenv.config();
console.log(process.env.NODE_ENV);

const app = express();

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI).then(
    () => {
      console.log('db connected');
    },
    (reason) => {
      console.log(`db failed: ${reason}`);
    }
  );
}

app.use(cors(/*{ origin: 'http://localhost:3000' }*/));
app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));
app.use(compression());
app.use(mongoSanitize());
app.use(express.static(__dirname + '/public'));
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/shoppinglist', shoppingListRoutes);
app.use('/api/item', itemRoutes);

app.all('/api/*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.get('*', (_req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 5000, () => {
    console.log('server started');
  });
}

export default app;
