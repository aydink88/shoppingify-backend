import mongoose from 'mongoose';

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      amount: { type: Number, default: 1 },
      done: { type: Boolean, default: false },
    },
  ],
  status: { type: String, enum: ['completed', 'cancelled', 'active'], default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Number, default: new Date().getTime() },
});

shoppingListSchema.pre('findOne', function () {
  this.sort({ createdAt: 'desc' }).populate('items.item');
});

shoppingListSchema.virtual('item_count').get(function () {
  return this.items.length;
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

export default ShoppingList;
