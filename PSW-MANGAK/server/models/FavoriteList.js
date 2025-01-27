import mongoose from 'mongoose';

const favoriteListSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, ref: 'Account' },
    name: String,
    mangas: [{ type: String, ref: 'Manga' }]
  },
  { _id: false }
);

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);
export default FavoriteList;
