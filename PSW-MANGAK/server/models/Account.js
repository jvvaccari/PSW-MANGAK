import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    favorites: [{ type: String, ref: 'Manga' }]
  },
  { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);
export default Account;
