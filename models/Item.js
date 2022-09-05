import mongoose from 'mongoose';
import ShoppingList from './ShoppingList.js';

const itemSchema = new mongoose.Schema({
  name: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  note: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

itemSchema.pre('find', function () {
  this.populate('category');
});

// remove item from shopping list too
itemSchema.post('remove', async (doc) => {
  const lists = await ShoppingList.find({ items: { $elemMatch: { item: doc._id } } });

  Promise.all(
    lists.map((list) => {
      return ShoppingList.findByIdAndUpdate(list._id, {
        $pull: { items: { item: doc._id } },
      });
    })
  );
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
