import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },

  mangaId: { type: String, required: true }, // Altere para String
  userId: { type: String, required: true }, // Altere para String
  rating: { type: Number, required: true },
  comment: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
});

const Evaluation = mongoose.model("Evaluation", evaluationSchema);
export default Evaluation;
