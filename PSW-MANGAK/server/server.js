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
mongoose.connect('mongodb://localhost:27017/mongo')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// CRUD routes

// --- Manga routes ---
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
    const manga = await Manga.findById(new mongoose.Types.ObjectId(req.params.id)).populate('authorId');
    if (!manga) return res.status(404).send('Manga not found');
    res.json(manga);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/mangas/:id', async (req, res) => {
  try {
    const updatedManga = await Manga.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.id),
      req.body,
      { new: true }
    );
    res.json(updatedManga);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/mangas/:id', async (req, res) => {
  try {
    await Manga.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// --- Author routes ---
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
    const author = await Author.findById(new mongoose.Types.ObjectId(req.params.id));
    if (!author) return res.status(404).send('Author not found');
    res.json(author);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/authors/:id', async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.id),
      req.body,
      { new: true }
    );
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/authors/:id', async (req, res) => {
  try {
    await Author.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/accounts/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || id === 'undefined') {
    return res.status(400).send('Account ID is missing or invalid.');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid ObjectId format.');
  }

  try {
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).send('Account not found');
    }
    res.json(account);
  } catch (err) {
    console.error('Error fetching account:', err.message);
    res.status(500).send('Internal server error');
  }
});



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

// Registration route
app.post('/accounts/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already in use');
    }

    const newUser = new Account({
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

app.get('/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findById(new mongoose.Types.ObjectId(req.params.id));
    if (!account) return res.status(404).send('Account not found');
    res.json(account);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/accounts/:id', async (req, res) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.id),
      req.body,
      { new: true }
    );
    res.json(updatedAccount);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/accounts/:id', async (req, res) => {
  try {
    await Account.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// --- Favorite List routes ---
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
    const updatedFavoriteList = await FavoriteList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFavoriteList);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/favoriteLists/:id', async (req, res) => {
  try {
    await FavoriteList.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// --- Evaluation routes ---
app.get('/evaluations', async (req, res) => {
  try {
    const mangaId = req.query.mangaId;
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
    const updatedEvaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvaluation);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/evaluations/:id', async (req, res) => {
  try {
    await Evaluation.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
