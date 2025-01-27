import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Mongoose models
import Manga from './models/Manga.js';
import Author from './models/Author.js';
import Account from './models/Account.js';
import FavoriteList from './models/FavoriteList.js';
import Evaluation from './models/Evaluation.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/mongo')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* --------------------------------------------------
   MANGA ROUTES
-------------------------------------------------- */
app.get('/mangas', async (_req, res) => {
  try {
    const mangas = await Manga.find();
    res.json(mangas);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/mangas', async (req, res) => {
  try {
    const newManga = new Manga(req.body);
    await newManga.save();
    res.status(201).json(newManga);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/mangas/:id', async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id).populate('authorId');
    if (!manga) return res.status(404).send('Manga not found');
    res.json(manga);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/mangas/:id', async (req, res) => {
  try {
    const updatedManga = await Manga.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedManga) return res.status(404).send('Manga not found');
    res.json(updatedManga);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/mangas/:id', async (req, res) => {
  try {
    const deletedManga = await Manga.findByIdAndDelete(req.params.id);
    if (!deletedManga) return res.status(404).send('Manga not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* --------------------------------------------------
   AUTHOR ROUTES
-------------------------------------------------- */
app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/authors', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).send('Author not found');
    res.json(author);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/authors/:id', async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAuthor) return res.status(404).send('Author not found');
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/authors/:id', async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) return res.status(404).send('Author not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* --------------------------------------------------
   ACCOUNT ROUTES
-------------------------------------------------- */
// GET Account by ID
app.get('/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).send('Account not found');
    res.json(account);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login
app.post('/accounts/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Account.findOne({ email, password });
    if (!account) {
      return res.status(401).send('Invalid credentials');
    }
    res.json(account);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Registration
app.post('/accounts/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already in use');
    }

    const newUser = new Account({
      _id: req.body.id, // If you want to explicitly set the ID, or remove this if it's auto
      username,
      email,
      password,
      favorites: [],
      role: 'user',
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update Account
app.put('/accounts/:id', async (req, res) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAccount) return res.status(404).send('Account not found');
    res.json(updatedAccount);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Account
app.delete('/accounts/:id', async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    if (!deletedAccount) return res.status(404).send('Account not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* --------------------------------------------------
   FAVORITE LIST ROUTES
-------------------------------------------------- */
app.get('/favoriteLists', async (req, res) => {
  try {
    const userId = req.query.userId;
    const favoriteLists = userId
      ? await FavoriteList.find({ userId })
      : await FavoriteList.find();
    res.json(favoriteLists);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/favoriteLists/:id', async (req, res) => {
  try {
    const favoriteList = await FavoriteList.findById(req.params.id);
    if (!favoriteList) return res.status(404).send('Favorite list not found');
    res.json(favoriteList);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/favoriteLists', async (req, res) => {
  try {
    const newFavoriteList = new FavoriteList(req.body);
    await newFavoriteList.save();
    res.status(201).json(newFavoriteList);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put('/favoriteLists/:id', async (req, res) => {
  try {
    const updatedFavoriteList = await FavoriteList.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFavoriteList) {
      return res.status(404).send('Favorite list not found');
    }
    res.json(updatedFavoriteList);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/favoriteLists/:id', async (req, res) => {
  try {
    const deletedFavoriteList = await FavoriteList.findByIdAndDelete(
      req.params.id
    );
    if (!deletedFavoriteList) {
      return res.status(404).send('Favorite list not found');
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* --------------------------------------------------
   EVALUATION ROUTES
-------------------------------------------------- */
app.get('/evaluations', async (req, res) => {
  try {
    const { mangaId } = req.query;
    const evaluations = mangaId
      ? await Evaluation.find({ mangaId })
      : await Evaluation.find();
    res.json(evaluations);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/evaluations/:id', async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).send('Evaluation not found');
    res.json(evaluation);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/evaluations', async (req, res) => {
  try {
    const newEvaluation = new Evaluation(req.body);
    await newEvaluation.save();
    res.status(201).json(newEvaluation);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put('/evaluations/:id', async (req, res) => {
  try {
    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvaluation) return res.status(404).send('Evaluation not found');
    res.json(updatedEvaluation);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/evaluations/:id', async (req, res) => {
  try {
    const deletedEvaluation = await Evaluation.findByIdAndDelete(req.params.id);
    if (!deletedEvaluation) return res.status(404).send('Evaluation not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
