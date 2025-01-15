import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
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
});

const Author = mongoose.model('Author', authorSchema);
export default Author;
