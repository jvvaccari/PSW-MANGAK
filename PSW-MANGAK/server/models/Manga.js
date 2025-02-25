import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    description: String,
    yearPubli: String,
    status: String,
    demographic: String,
    genres: [String],
    artsList: [String],
    retail: [{ name: String, url: String }],
  }
);

const Manga = mongoose.model("Manga", mangaSchema);
export default Manga;
