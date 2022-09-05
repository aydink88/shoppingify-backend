import mongoose from 'mongoose';
import { hashSync } from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, minlength: 6 },
  shopping_lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingList' }],
});

userSchema.pre('save', function (next) {
  if (this.password) this.password = hashSync(this.password, 10);
  next();
});

userSchema.post('findOne', function (doc) {
  if (!doc) return null;
  return doc.populate({ path: 'shopping_lists', sort: '-createdAt', select: '-items' });
});

const User = mongoose.model('User', userSchema);

export default User;
