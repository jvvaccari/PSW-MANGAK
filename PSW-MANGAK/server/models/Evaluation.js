import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' }, // Reference to Manga
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Reference to Account
  rating: Number,
  comment: String,
  timestamp: { type: Date, default: Date.now }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
export default Evaluation;
