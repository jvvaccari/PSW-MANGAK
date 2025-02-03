import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';  // Importando bcryptjs

import Manga from './models/Manga.js';
import Author from './models/Author.js';
import Account from './models/Account.js';
import FavoriteList from './models/FavoriteList.js';
import Evaluation from './models/Evaluation.js';
import Token from './models/Token.js';  // Importando o modelo Token

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'db.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(data); // Verifique a estrutura dos dados carregados

// Obter a URL de conexão a partir da variável de ambiente
const MONGO_URI = process.env.DATABASE_URL; // Use a URL do MongoDB Atlas configurada na variável de ambiente

// Função para validar e converter para ObjectId
const getObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId();
};

// Função para criptografar a senha
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Gerar o salt
  return await bcrypt.hash(password, salt); // Retorna a senha criptografada
};

(async function migrateData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Limpeza do banco de dados antes da migração
    await Promise.all([
      Author.deleteMany({}),
      Manga.deleteMany({}),
      Account.deleteMany({}),
      FavoriteList.deleteMany({}),
      Evaluation.deleteMany({}),
      Token.deleteMany({}), // Limpar tokens existentes
    ]);
    console.log('Database cleared.');

    // Inserção de Tokens
    if (data.tokens) {
      const tokensData = data.tokens.map((tokenData) => ({
        token: tokenData.token, 
        userId: getObjectId(tokenData.userId), // Certifique-se de que o userId seja convertido corretamente
        expiresAt: tokenData.expiresAt || new Date(), // Garantir que expiresAt esteja disponível
      }));
      await Token.insertMany(tokensData);
      console.log("Tokens inserted:", tokensData.length);
    } else {
      console.log("No token data found");
    }

    // Inserção de Autores
    if (data.authors) {
      const authorsData = data.authors.map((author) => ({
        _id: getObjectId(author.id),
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
    } else {
      console.log('No authors data found');
    }

    // Inserção de Mangás
    if (data.mangas) {
      const mangasData = data.mangas.map((manga) => ({
        _id: getObjectId(manga.id),
        title: manga.title,
        image: manga.image,
        authorId: getObjectId(manga.authorId),
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
    } else {
      console.log('No mangas data found');
    }

    // Inserção de Contas com senha criptografada
    if (data.accounts) {
      const accountsData = await Promise.all(data.accounts.map(async (account) => ({
        _id: account.id, // Mantém String
        username: account.username,
        email: account.email,
        password: await hashPassword(account.password), // Criptografando a senha
        role: account.role,
        favorites: account.favorites,
      })));
      await Account.insertMany(accountsData);
      console.log('Accounts inserted:', accountsData.length);
    } else {
      console.log('No accounts data found');
    }

    // Inserção de Listas de Favoritos
    if (data.favoriteLists) {
      const favoriteListsData = data.favoriteLists.map((list) => ({
        _id: new mongoose.Types.ObjectId(), // Gera um novo ObjectId
        userId: list.userId, // Mantém String porque `Account._id` é String
        name: list.name,
        mangas: list.mangas.map((mangaId) => getObjectId(mangaId)),
      }));
      await FavoriteList.insertMany(favoriteListsData);
      console.log('Favorite Lists inserted:', favoriteListsData.length);
    } else {
      console.log('No favoriteLists data found');
    }

    // Inserção de Avaliações
    if (data.evaluations) {
      const evaluationsData = data.evaluations.map((evaluation) => ({
        mangaId: getObjectId(evaluation.mangaId),
        userId: evaluation.userId, // Mantém String
        rating: evaluation.rating,
        comment: evaluation.comment,
        timestamp: evaluation.timestamp,
      }));
      await Evaluation.insertMany(evaluationsData);
      console.log('Evaluations inserted:', evaluationsData.length);
    } else {
      console.log('No evaluations data found');
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('Migration complete. MongoDB connection closed.');
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
})();
