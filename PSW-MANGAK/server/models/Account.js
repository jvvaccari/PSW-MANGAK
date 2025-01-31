import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' },
    favorites: [{ type: String, ref: 'Manga' }]
  }
);

const Account = mongoose.model('Account', accountSchema);
export default Account;
