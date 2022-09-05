import Category from '../models/Category.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';

async function getCategoriesAsync(req, res) {
  const categories = await Category.find({ user: req.userId });
  return res.status(200).send({ categories });
}

async function createCategoryAsync(req, res) {
  const categoryName = req.body.name;

  const userCategories = await Category.find({ user: mongoose.Types.ObjectId(req.userId) });
  const categoryExistsIndex = userCategories.findIndex((cat) => cat.name === categoryName);
  if (categoryExistsIndex > -1) {
    return res.status(200).send({ category: userCategories[categoryExistsIndex] });
  }
  const category = new Category({ name: categoryName, user: req.userId });
  await category.save();
  return res.status(201).send({ category });
}

export const getCategories = asyncHandler(getCategoriesAsync);
export const createCategory = asyncHandler(createCategoryAsync);
