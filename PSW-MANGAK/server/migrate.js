import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Manga from './models/Manga.js';
import Author from './models/Author.js';
import Account from './models/Account.js';
import FavoriteList from './models/FavoriteList.js';
import Evaluation from './models/Evaluation.js';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON data
const filePath = path.join(__dirname, 'db.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mongo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  // Insert data into collections
  await Manga.insertMany(data.mangas);
  console.log('Mangas inserted');

  await Author.insertMany(data.authors);
  console.log('Authors inserted');

  await Account.insertMany(data.accounts);
  console.log('Accounts inserted');

  await FavoriteList.insertMany(data.favoriteLists);
  console.log('Favorite Lists inserted');

  await Evaluation.insertMany(data.evaluations);
  console.log('Evaluations inserted');

  mongoose.disconnect();
}).catch(err => console.error('MongoDB connection error:', err));
