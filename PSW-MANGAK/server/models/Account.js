import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  favorites: [String]
});

const Account = mongoose.model('Account', accountSchema);
export default Account;
