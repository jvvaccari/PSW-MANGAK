import mongoose from 'mongoose';

const mangaSchema = new mongoose.Schema({
  title: String,
  image: String,
  authorId: String,
  description: String,
  yearPubli: String,
  status: String,
  demographic: String,
  genres: [String],
  artsList: [String],
  retail: [
    {
      name: String,
      url: String
    }
  ]
});

const Manga = mongoose.model('Manga', mangaSchema);
export default Manga;
