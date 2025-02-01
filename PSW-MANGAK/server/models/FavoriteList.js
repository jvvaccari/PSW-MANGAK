import mongoose from 'mongoose';

const favoriteListSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: 'Account' },
    name: String,
    mangas: [{ type: String, ref: 'Manga' }]
  });

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);
export default FavoriteList;
