import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: String,
  image: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  description: String,
  yearPubli: String,
  status: String,
  demographic: String,
  genres: [String],
  artsList: [String],
  retail: [{ name: String, url: String }],
});

const Manga = mongoose.model("Manga", mangaSchema);
export default Manga;
