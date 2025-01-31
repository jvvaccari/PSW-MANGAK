import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' },
    favorites: [{ type: String, ref: 'Manga' }]
  },
  { _id: false }
);

const Account = mongoose.model('Account', accountSchema);
export default Account;
