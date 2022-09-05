import Item from '../models/Item.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { checkOwner } from '../utils/checkAuthorization.js';

async function getItemAsync(req, res) {
  const { id } = req.params;
  const item = await Item.findById(id);
  res.send({ item: item });
}

async function createItemAsync(req, res) {
  const { name, category, note, image } = req.body;

  const newOrFoundCategory = await Category.findOneAndUpdate(
    { name: category, user: req.userId },
    { $setOnInsert: { name: category } },
    { upsert: true, new: true }
  );
  const newItem = new Item({
    name,
    category: newOrFoundCategory._id,
    note,
    image,
    user: req.userId,
  });
  let itemData = await newItem.save();
  itemData = await itemData.populate('category');

  res.status(201).send({ item: itemData });
}

async function getAllItemsAsync(req, res) {
  const items = await Item.find({ user: req.userId });
  res.status(200).send({ items });
}

async function deleteItemAsync(req, res) {
  const { id } = req.params;
  const item = await Item.findById(id);
  checkOwner(item.user.toString(), req.userId);
  await item.remove();
  res.status(204).send({ message: 'deleted successfully' });
}

export const createItem = asyncHandler(createItemAsync);
export const getAllItems = asyncHandler(getAllItemsAsync);
export const deleteItem = asyncHandler(deleteItemAsync);
export const getItem = asyncHandler(getItemAsync);
