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

// MongoDB connection URI
const MONGO_URI = 'mongodb://localhost:27017/mongo';

(async function migrateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Insert authors and create mapping
    const authors = await Author.insertMany(data.authors);
    const authorIdMap = authors.reduce((map, author) => {
      map[author.id] = author._id; // Map old `id` to new `_id`
      return map;
    }, {});
    console.log('Authors inserted:', authors.length);

    // Insert mangas with updated `authorId`
    const mangas = data.mangas.map((manga) => ({
      ...manga,
      authorId: authorIdMap[manga.authorId],
    }));
    const insertedMangas = await Manga.insertMany(mangas);
    const mangaIdMap = insertedMangas.reduce((map, manga) => {
      map[manga.id] = manga._id; // Map old `id` to new `_id`
      return map;
    }, {});
    console.log('Mangas inserted:', insertedMangas.length);

    // Insert accounts with updated `favorites`
    const accounts = data.accounts.map((account) => ({
      ...account,
      favorites: account.favorites.map((favoriteId) => mangaIdMap[favoriteId]),
    }));
    const insertedAccounts = await Account.insertMany(accounts);
    const accountIdMap = insertedAccounts.reduce((map, acc) => {
      map[acc.id] = acc._id; // Map old `id` to new `_id`
      return map;
    }, {});
    console.log('Accounts inserted:', insertedAccounts.length);

    // Insert favorite lists with updated `userId` and `mangas`
    const favoriteLists = data.favoriteLists.map((list) => ({
      ...list,
      userId: accountIdMap[list.userId],
      mangas: list.mangas.map((mangaId) => mangaIdMap[mangaId]),
    }));
    await FavoriteList.insertMany(favoriteLists);
    console.log('Favorite Lists inserted:', favoriteLists.length);

    // Insert evaluations with updated `userId` and `mangaId`
    const evaluations = data.evaluations.map((evaluation) => ({
      ...evaluation,
      userId: accountIdMap[evaluation.userId],
      mangaId: mangaIdMap[evaluation.mangaId],
    }));
    await Evaluation.insertMany(evaluations);
    console.log('Evaluations inserted:', evaluations.length);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Migration complete. MongoDB connection closed.');
  } catch (err) {
    console.error('Error during migration:', err.message);
    process.exit(1); // Exit with error code
  }
})();
