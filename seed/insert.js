import { items, shoppingListDates } from './data.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import ShoppingList from '../models/ShoppingList.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import faker from 'faker';

dotenv.config();

const randomize = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min + 1;

async function main() {
  console.log('connecting to database');
  await mongoose.connect(process.env.MONGO_URI);

  console.log('creating user a@a.com with password 123456');
  const user = new User({ email: 'a@a.com', password: '123456' });
  await user.save();

  console.log('creating categories');
  const newCategories = [];
  for (const category in items) {
    newCategories.push({ name: category, user: user._id });
  }
  await Category.insertMany(newCategories);

  console.log('creating items');
  const foundCategories = await Category.find();
  const newItems = [];
  for (const categoryName in items) {
    const foundIndex = foundCategories.findIndex((cat) => cat.name === categoryName);
    for (const itemName of items[categoryName]) {
      const newItem = new Item({
        name: itemName,
        category: foundCategories[foundIndex]._id,
        user: user._id,
      });
      newItems.push(newItem);
    }
  }
  await Item.insertMany(newItems);

  console.log('creating shopping lists');
  const newShoppingLists = [];
  const newShoppingListsObjectIds = [];
  // create sample shopping lists, maximum 15 items each
  // 5 pieces max for each item in list
  for (const listDate of shoppingListDates) {
    const itemCount = randomize(15);
    const alreadyAddedNums = [];
    const itemArray = [];
    for (let i = 0; i < itemCount; i++) {
      const itemToAdd = randomize(newItems.length);
      const itemAmount = randomize(5, 1);
      if (alreadyAddedNums.includes(itemToAdd)) {
        continue;
      }
      alreadyAddedNums.push(itemToAdd);
      const newItem = { item: newItems[itemToAdd], amount: itemAmount };
      itemArray.push(newItem);
    }
    const newList = new ShoppingList({
      items: itemArray,
      name: faker.lorem.words(3),
      createdAt: new Date(listDate),
      user: user._id,
      status: 'completed',
    });
    newShoppingLists.push(newList);
    newShoppingListsObjectIds.push(newList._id);
  }
  await ShoppingList.insertMany(newShoppingLists);
  await User.findByIdAndUpdate(user._id, { shopping_lists: newShoppingListsObjectIds });
}

main()
  .then(() => {
    console.log('completed');
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  })
  .finally(() => {
    process.exit();
  });
