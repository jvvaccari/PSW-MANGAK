import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Manga from './models/Manga.js';
import Author from './models/Author.js';
import Account from './models/Account.js';
import FavoriteList from './models/FavoriteList.js';
import Evaluation from './models/Evaluation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'db.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const MONGO_URI = 'mongodb://localhost:27017/mongo';

(async function migrateData() {
  try {

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');


    const authorsData = data.authors.map((author) => ({
      _id: author.id,
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

    await Author.insertMany(authorsData);
    console.log('Authors inserted:', authorsData.length);

    const mangasData = data.mangas.map((manga) => ({
      _id: manga.id,
      title: manga.title,
      image: manga.image,
      authorId: manga.authorId,
      description: manga.description,
      yearPubli: manga.yearPubli,
      status: manga.status,
      demographic: manga.demographic,
      genres: manga.genres,
      artsList: manga.artsList,
      retail: manga.retail,
    }));

    await Manga.insertMany(mangasData);
    console.log('Mangas inserted:', mangasData.length);

    const accountsData = data.accounts.map((account) => ({
      _id: account.id,
      username: account.username,
      email: account.email,
      password: account.password,
      role: account.role,
      favorites: account.favorites, 
    }));

    await Account.insertMany(accountsData);
    console.log('Accounts inserted:', accountsData.length);

    const favoriteListsData = data.favoriteLists.map((list) => ({
      _id: list.id,
      userId: list.userId, 
      name: list.name,
      mangas: list.mangas,
    }));

    await FavoriteList.insertMany(favoriteListsData);
    console.log('Favorite Lists inserted:', favoriteListsData.length);

    const evaluationsData = data.evaluations.map((evaluation) => ({
      _id: evaluation.id,
      mangaId: evaluation.mangaId,  
      userId: evaluation.userId,
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
