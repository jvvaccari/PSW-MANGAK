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

    // Insert authors and track their `_id` values
    const authors = await Author.insertMany(
      data.authors.map(({ id, ...rest }) => rest) // Exclude `id` field
    );
    console.log('Authors inserted:', authors.length);

    // Create a mapping of old `id` to MongoDB `_id` for authors
    const authorIdMap = authors.reduce((map, author) => {
      map[author.id] = author._id; // Map old `id` to new `_id`
      return map;
    }, {});

    // Replace `authorId` in mangas with the corresponding `_id`
    const mangas = data.mangas.map((manga) => ({
      ...manga,
      authorId: authorIdMap[manga.authorId], // Replace with ObjectId
    }));
    const insertedMangas = await Manga.insertMany(mangas);
    console.log('Mangas inserted:', insertedMangas.length);

    // Create a mapping of old `id` to MongoDB `_id` for mangas
    const mangaIdMap = insertedMangas.reduce((map, manga) => {
      map[manga.id] = manga._id; // Map old `id` to new `_id`
      return map;
    }, {});

    // Replace `favorites` in accounts with the corresponding `_id`
    const accounts = data.accounts.map((account) => ({
      ...account,
      favorites: account.favorites.map((favoriteId) => mangaIdMap[favoriteId]), // Map to ObjectId
    }));
    await Account.insertMany(accounts);
    console.log('Accounts inserted:', accounts.length);

    // Replace `userId` in favorite lists and evaluations with the corresponding `_id`
    const favoriteLists = data.favoriteLists.map((list) => ({
      ...list,
      userId: accounts.find((acc) => acc.id === list.userId)._id, // Replace with ObjectId
      mangas: list.mangas.map((mangaId) => mangaIdMap[mangaId]), // Replace manga references
    }));
    await FavoriteList.insertMany(favoriteLists);
    console.log('Favorite Lists inserted:', favoriteLists.length);

    const evaluations = data.evaluations.map((evaluation) => ({
      ...evaluation,
      userId: accounts.find((acc) => acc.id === evaluation.userId)._id, // Replace user reference
      mangaId: mangaIdMap[evaluation.mangaId], // Replace manga reference
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
