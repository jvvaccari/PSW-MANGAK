import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    authorPhoto: String,
    pseudonym: String,
    birthDate: Date,
    birthPlace: String,
    nationality: String,
    ethnicity: String,
    occupations: [String],
    notableWorks: [String],
    biography: String
  },
  { _id: false }
);

const Author = mongoose.model('Author', authorSchema);
export default Author;
