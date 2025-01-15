import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  mangaId: String,
  userId: String,
  rating: Number,
  comment: String,
  timestamp: Date
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
export default Evaluation;
