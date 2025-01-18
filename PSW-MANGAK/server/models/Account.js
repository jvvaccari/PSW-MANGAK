import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }, // Defaults to "user"
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manga' }] // References to Manga
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
