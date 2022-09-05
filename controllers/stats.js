import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import ShoppingList from '../models/ShoppingList.js';

async function topItemsAsync(req, res) {
  const data = await ShoppingList.aggregate([
    { $match: { user: mongoose.Types.ObjectId(req.userId), status: 'completed' } },
    {
      $unwind: '$items',
    },
    {
      $group: { _id: '$items.item', total_amount: { $sum: '$items.amount' } },
    },
    { $sort: { total_amount: -1 } },
    { $lookup: { from: 'items', localField: '_id', foreignField: '_id', as: 'itemRaw' } },
    { $unwind: '$itemRaw' },
    { $project: { _id: 1, name: '$itemRaw.name', amount: '$total_amount' } },
  ]);
  return res.status(200).send(data);
}

async function topCategoriesAsync(req, res) {
  const data = await ShoppingList.aggregate([
    { $match: { user: mongoose.Types.ObjectId(req.userId), status: 'completed' } },
    {
      $unwind: '$items',
    },
    {
      $group: { _id: '$items.item', total_amount: { $sum: '$items.amount' } },
    },
    { $lookup: { from: 'items', localField: '_id', foreignField: '_id', as: 'itemRaw' } },
    {
      $lookup: {
        from: 'categories',
        localField: 'itemRaw.category',
        foreignField: '_id',
        as: 'categoryRaw',
      },
    },
    { $unwind: '$categoryRaw' },
    {
      $project: {
        _id: '$categoryRaw._id',
        name: '$categoryRaw.name',
        amount: '$total_amount',
      },
    },
    { $group: { _id: '$name', amount: { $sum: '$amount' } } },
    { $sort: { amount: -1 } },
  ]);
  return res.status(200).send(data);
}

async function monthlyStatsAsync(req, res) {
  const data = await ShoppingList.aggregate([
    { $match: { user: mongoose.Types.ObjectId(req.userId), status: 'completed' } },
    { $project: { name: 1, 'items.amount': 1, createdAt: 1 } },
    { $unwind: '$items' },
    {
      $group: {
        _id: {
          year: {
            $year: { $toDate: '$createdAt' },
          },
          month: {
            $month: { $toDate: '$createdAt' },
          },
        },
        amount: { $sum: '$items.amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  return res.status(200).send(data);
}

export const topItems = asyncHandler(topItemsAsync);
export const topCategories = asyncHandler(topCategoriesAsync);
export const monthlyStats = asyncHandler(monthlyStatsAsync);
