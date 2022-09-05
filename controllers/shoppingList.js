import ShoppingList from '../models/ShoppingList.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { checkOwner } from '../utils/checkAuthorization.js';
import Item from '../models/Item.js';

async function createShoppingListAsync(req, res) {
  const { name, items } = req.body;
  const newList = new ShoppingList({ name, user: req.userId });
  //if (items) newList.items = items;
  newList.items = [];
  if (items) {
    items.forEach((itemObj) => {
      const newItem = { ...itemObj, item: mongoose.Types.ObjectId(itemObj.item) };

      newList.items.push(newItem);
    });
  }
  await newList.save();
  await User.findByIdAndUpdate(req.userId, { $push: { shopping_lists: newList._id } });
  return res.status(201).send(newList);
}

async function updateShoppingListAsync(req, res) {
  const updates = {};
  ['name', 'items', 'status'].forEach((prop) => {
    if (req.body[prop]) {
      updates[prop] = req.body[prop];
    }
  });
  const updatedList = await ShoppingList.findByIdAndUpdate(req.params.id, updates, { new: true });
  return res.status(200).send(updatedList);
}

async function removeShoppingListAsync(req, res) {
  const list = await ShoppingList.findById(req.params.id);
  if (!list) {
    throw new AppError('not found', 404);
  }
  if (list.user.toString() !== req.userId) {
    throw new AppError('not your list', 401);
  }
  await list.delete();
  return res.status(204).send({ message: 'success' });
}

// unused for now, placeholder: updateShoppingList
// async function changeShoppingListNameAsync(req, res) {
//   if (validationResult(req).errors.length) {
//     throw new AppError('Invalid Fields', 400);
//   }
//   const { name } = req.body;

//   const list = await ShoppingList.findById(req.params.id);
//   if (!list) {
//     throw new AppError('not found', 404);
//   }
//   if (list.user.toString() !== req.userId) {
//     throw new AppError('not your list', 401);
//   }
//   list.name = name;
//   await list.save();
//   return res.status(200).send({ data: list });
// }

async function getAllShoppingListsOfUserAsync(req, res) {
  const data = await ShoppingList.find({ user: req.userId }).select('-items');

  return res.status(200).send(data);
}

async function addItemAsync(req, res) {
  const { id, amount, done } = req.body;
  const list = await ShoppingList.findById(req.params.id);
  const itemtoadd = await Item.findById(id);
  checkOwner(list.user.toString(), req.userId);
  await ShoppingList.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $push: { items: { item: itemtoadd, amount, done } } }
  );
  return res.status(200).send({ data: list });
}

// unused for now, placeholder: updateShoppinglist
// async function removeItemAsync(req, res) {
//   const { name } = req.body;
//   const list = await ShoppingList.findById(req.params.id);
//   if (!list) {
//     throw new AppError('not found', 404);
//   }
//   if (list.user.toString() !== req.userId) {
//     throw new AppError('not your list', 401);
//   }
//   const foundIndex = list.items.findIndex((value) => value.name === name);
//   if (foundIndex > -1) {
//     list.items.splice(foundIndex, 1);
//     await list.save();
//   }
//   return res.status(200).send({ data: list });
// }

async function updateItemAsync(req, res) {
  const { _id, amount, done } = req.body;
  const list = await ShoppingList.findById(req.params.id);
  if (!list) {
    throw new AppError('not found', 404);
  }
  if (list.user.toString() !== req.userId) {
    throw new AppError('not your list', 401);
  }
  const foundIndex = list.items.findIndex((value) => value._id.toString() === _id);
  if (foundIndex > -1) {
    list.items[foundIndex].amount = amount;
    list.items[foundIndex].done = done;
    await list.save();
  }
  return res.status(200).send({ data: list.items[foundIndex] });
}

async function getShoppingListAsync(req, res) {
  const { id } = req.params;
  const list = await ShoppingList.findById(id);
  if (!list) {
    throw new AppError('List not found', 404);
  }

  if (list.user.toString() !== req.userId) {
    throw new AppError('not your list', 401);
  }
  res.status(200).send(list);
}

export const createShoppingList = asyncHandler(createShoppingListAsync);
export const updateShoppingList = asyncHandler(updateShoppingListAsync);
export const removeShoppingList = asyncHandler(removeShoppingListAsync);
//export const changeShoppingListName = asyncHandler(changeShoppingListNameAsync);
export const getAllShoppingListsOfUser = asyncHandler(getAllShoppingListsOfUserAsync);
export const addItem = asyncHandler(addItemAsync);
//export const removeItem = asyncHandler(removeItemAsync);
export const updateItem = asyncHandler(updateItemAsync);
export const getShoppingList = asyncHandler(getShoppingListAsync);
