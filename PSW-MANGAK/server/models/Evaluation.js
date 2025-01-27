import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    mangaId: { type: String, ref: 'Manga' },   // Now references by string
    userId: { type: String, ref: 'Account' },  // Also references by string
    rating: Number,
    comment: String,
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
export default Evaluation;
