import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import Manga from './models/Manga.js';
import Author from './models/Author.js';
import Account from './models/Account.js';
import FavoriteList from './models/FavoriteList.js';
import Evaluation from './models/Evaluation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb+srv://mr17motta:vaccari386@cluster0.ywd2a.mongodb.net/Cluster0?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

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

app.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const author = await Author.findById(new mongoose.Types.ObjectId(id));

    if (!author) {
      return res.status(404).json({ message: `${id} não encontrado` });
    }

    res.json(author);
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

app.get('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID recebido:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const account = await Account.findById(id); // Aqui usa "id" corretamente
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

app.delete('/accounts/:id', async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    if (!deletedAccount) return res.status(404).send('Account not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/favorites', async (req, res) => {
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

app.get('/favorites/:id', async (req, res) => {
  try {
    const favoriteList = await FavoriteList.findById(req.params._id);
    if (!favoriteList) return res.status(404).send('Favorite list not found');
    res.json(favoriteList);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/favorites', async (req, res) => {
  try {
    const newFavoriteList = new FavoriteList(req.body);
    await newFavoriteList.save();
    res.status(201).json(newFavoriteList);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put('/favorites/:id', async (req, res) => {
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

app.delete('/favorites/:id', async (req, res) => {
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

app.get('/evaluations/:mangaId', async (req, res) => {
  try {
    // Certifique-se de tratar o mangaId como uma string
    const mangaId = req.params.mangaId;

    // Busca pelas avaliações usando mangaId como string
    const mangaEvaluations = await Evaluation.find({ mangaId: mangaId });

    if (mangaEvaluations.length === 0) {
      return res.status(404).send('Evaluations not found');
    }

    res.json(mangaEvaluations);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/evaluations', async (req, res) => {
  try {
    const { mangaId, userId, rating, comment } = req.body;

    if (typeof mangaId !== 'string' || typeof userId !== 'string') {
      return res.status(400).send('mangaId and userId must be strings');
    }

    console.log("mangaId:", mangaId, "userId:", userId, "rating:", rating, "comment:", comment);

    const newEvaluation = new Evaluation({
      mangaId: mangaId,
      userId: userId,
      rating,
      comment
    });

    // Salvando no MongoDB
    await newEvaluation.save();

    res.status(201).json(newEvaluation);
  } catch (err) {
    console.error("Erro ao salvar a avaliação:", err);
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
    const evaluationId = req.params.id;
    const evaluation = await Evaluation.findByIdAndDelete(evaluationId);

    if (!evaluation) {
      return res.status(404).send('Avaliação não encontrada');
    }

    res.status(200).send('Avaliação excluída com sucesso');
  } catch (err) {
    res.status(400).send('Erro ao excluir avaliação');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
