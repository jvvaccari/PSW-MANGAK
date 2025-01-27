import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Manga from './models/Manga.js';
import Author from './models/Author.js';
import Account from './models/Account.js';
import FavoriteList from './models/FavoriteList.js';
import Evaluation from './models/Evaluation.js';

// Convert import.meta.url to __dirname
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

    // 1) Transform authors so "id" => "_id"
    const authorsData = data.authors.map((author) => ({
      _id: author.id, // rename
      name: author.name,
      authorPhoto: author.authorPhoto,
      pseudonym: author.pseudonym,
      birthDate: author.birthDate,
      birthPlace: author.birthPlace,
      nationality: author.nationality,
      ethnicity: author.ethnicity,
      occupations: author.occupations,
      notableWorks: author.notableWorks,
      biography: author.biography,
    }));

    // Insert authors
    await Author.insertMany(authorsData);
    console.log('Authors inserted:', authorsData.length);

    // 2) Transform mangas so "id" => "_id"
    const mangasData = data.mangas.map((manga) => ({
      _id: manga.id,
      title: manga.title,
      image: manga.image,
      authorId: manga.authorId, // This matches the string _id in Author
      description: manga.description,
      yearPubli: manga.yearPubli,
      status: manga.status,
      demographic: manga.demographic,
      genres: manga.genres,
      artsList: manga.artsList,
      retail: manga.retail,
    }));

    // Insert mangas
    await Manga.insertMany(mangasData);
    console.log('Mangas inserted:', mangasData.length);

    // 3) Transform accounts so "id" => "_id" and favorites remain string references
    const accountsData = data.accounts.map((account) => ({
      _id: account.id,
      username: account.username,
      email: account.email,
      password: account.password,
      role: account.role,
      // "favorites" already uses the same string IDs from Manga
      favorites: account.favorites, 
    }));

    // Insert accounts
    await Account.insertMany(accountsData);
    console.log('Accounts inserted:', accountsData.length);

    // 4) Transform favoriteLists
    const favoriteListsData = data.favoriteLists.map((list) => ({
      _id: list.id,
      userId: list.userId, // matches the string _id in Account
      name: list.name,
      mangas: list.mangas, // matches the string _id in Manga
    }));

    await FavoriteList.insertMany(favoriteListsData);
    console.log('Favorite Lists inserted:', favoriteListsData.length);

    // 5) Transform evaluations
    const evaluationsData = data.evaluations.map((evaluation) => ({
      _id: evaluation.id,
      mangaId: evaluation.mangaId,  // string _id from Manga
      userId: evaluation.userId,    // string _id from Account
      rating: evaluation.rating,
      comment: evaluation.comment,
      timestamp: evaluation.timestamp,
    }));

    await Evaluation.insertMany(evaluationsData);
    console.log('Evaluations inserted:', evaluationsData.length);

    // Disconnect
    await mongoose.disconnect();
    console.log('Migration complete. MongoDB connection closed.');
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
})();
