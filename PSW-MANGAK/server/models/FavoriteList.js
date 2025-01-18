import mongoose from 'mongoose';

const favoriteListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  name: String,
  mangas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manga' }]
});

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);
export default FavoriteList;
