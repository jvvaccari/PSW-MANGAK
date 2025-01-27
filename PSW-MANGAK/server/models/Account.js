import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' }, // Defaults to "user"
    favorites: [{ type: String, ref: 'Manga' }] // References by string ID to Manga
  },
  { _id: false } // Disables Mongoose's auto _id
);

const Account = mongoose.model('Account', accountSchema);
export default Account;
