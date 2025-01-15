import mongoose from 'mongoose';

const favoriteListSchema = new mongoose.Schema({
  userId: String,
  name: String,
  mangas: [String]
});

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);
export default FavoriteList;
