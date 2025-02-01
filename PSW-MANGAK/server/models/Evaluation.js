import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    mangaId: { type: String, required: true }, // Altere para String
    userId: { type: String, required: true }, // Altere para String
    rating: { type: Number, required: true },
    comment: { type: String, required: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true } // Adiciona automaticamente campos 'createdAt' e 'updatedAt'
);

const Evaluation = mongoose.model("Evaluation", evaluationSchema);
export default Evaluation;
