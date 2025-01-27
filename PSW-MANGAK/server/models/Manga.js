import mongoose from 'mongoose';

const mangaSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: String,
    image: String,
    authorId: { type: String, ref: 'Author' }, // Reference to Author by string
    description: String,
    yearPubli: String,
    status: String,
    demographic: String,
    genres: [String],
    artsList: [String],
    retail: [{ name: String, url: String }]
  },
  { _id: false }
);

const Manga = mongoose.model('Manga', mangaSchema);
export default Manga;
