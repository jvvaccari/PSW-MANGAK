import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import morgan from 'morgan';
import bcrypt from 'bcrypt';

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
app.use(morgan('combined')); // Logs de requisições

// Conexão com o MongoDB usando variáveis de ambiente
mongoose
  .connect('mongodb+srv://mr17motta:vaccari386@cluster0.ywd2a.mongodb.net/Cluster0?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware de tratamento de erros centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Rotas para Mangas
app.get('/mangas', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const mangas = await Manga.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Manga.countDocuments();
    res.json({
      mangas,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

app.post(
  '/mangas',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('authorId').isMongoId().withMessage('Invalid author ID'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newManga = new Manga(req.body);
      await newManga.save();
      res.status(201).json(newManga);
    } catch (err) {
      next(err);
    }
  }
);

app.get('/mangas/:id', async (req, res, next) => {
  try {
    const manga = await Manga.findById(req.params.id).populate('authorId');
    if (!manga) return res.status(404).send('Manga not found');
    res.json(manga);
  } catch (err) {
    next(err);
  }
});

app.put('/mangas/:id', async (req, res, next) => {
  try {
    const updatedManga = await Manga.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedManga) return res.status(404).send('Manga not found');
    res.json(updatedManga);
  } catch (err) {
    next(err);
  }
});

app.delete('/mangas/:id', async (req, res, next) => {
  try {
    const deletedManga = await Manga.findByIdAndDelete(req.params.id);
    if (!deletedManga) return res.status(404).send('Manga not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Rotas para Authors
app.get('/authors', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const authors = await Author.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Author.countDocuments();
    res.json({
      authors,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/authors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const author = await Author.findById(new mongoose.Types.ObjectId(id));
    if (!author) {
      return res.status(404).json({ message: `${id} não encontrado` });
    }

    res.json(author);
  } catch (err) {
    next(err);
  }
});

app.post(
  '/authors',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newAuthor = new Author(req.body);
      await newAuthor.save();
      res.status(201).json(newAuthor);
    } catch (err) {
      next(err);
    }
  }
);

app.put('/authors/:id', async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAuthor) return res.status(404).send('Author not found');
    res.json(updatedAuthor);
  } catch (err) {
    next(err);
  }
});

app.delete('/authors/:id', async (req, res, next) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) return res.status(404).send('Author not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/accounts/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const account = await Account.findById(id);
      if (!account) return res.status(404).json({ message: 'Account not found' });
  
      res.json(account);
    } catch (err) {
      next(err);
    }
  });
  
  app.post(
    '/accounts/login',
    [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      try {
        const account = await Account.findOne({ email });
        if (!account) {
          return res.status(401).send('Invalid credentials');
        }
  
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
          return res.status(401).send('Invalid credentials');
        }
  
        res.json(account);
      } catch (error) {
        next(error);
      }
    }
  );
  
  app.post(
    '/accounts/register',
    [
      body('username').notEmpty().withMessage('Username is required'),
      body('email').isEmail().withMessage('Invalid email'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username, email, password } = req.body;
      try {
        const existingUser = await Account.findOne({ email });
        if (existingUser) {
          return res.status(400).send('Email already in use');
        }
  
        const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
  
        const newUser = new Account({
          username,
          email,
          password: hashedPassword,
          favorites: [],
          role: 'user',
        });
  
        await newUser.save();
        res.status(201).json(newUser);
      } catch (error) {
        next(error);
      }
    }
  );
  
  app.put('/accounts/:id', async (req, res, next) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedAccount) return res.status(404).send('Account not found');
      res.json(updatedAccount);
    } catch (err) {
      next(err);
    }
  });
  
  app.delete('/accounts/:id', async (req, res, next) => {
    try {
      const deletedAccount = await Account.findByIdAndDelete(req.params.id);
      if (!deletedAccount) return res.status(404).send('Account not found');
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });
  
  // Rotas para Favorites
  app.get('/favorites', async (req, res, next) => {
    try {
      const { userId, page = 1, limit = 10 } = req.query;
      const query = userId ? { userId } : {};
  
      const favoriteLists = await FavoriteList.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      const count = await FavoriteList.countDocuments(query);
      res.json({
        favoriteLists,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      next(err);
    }
  });
  
  app.get('/favorites/:id', async (req, res, next) => {
    try {
      const favoriteList = await FavoriteList.findById(req.params.id);
      if (!favoriteList) return res.status(404).send('Favorite list not found');
      res.json(favoriteList);
    } catch (err) {
      next(err);
    }
  });
  
  app.post(
    '/favorites',
    [
      body('userId').isMongoId().withMessage('Invalid user ID'),
      body('mangaId').isMongoId().withMessage('Invalid manga ID'),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const newFavoriteList = new FavoriteList(req.body);
        await newFavoriteList.save();
        res.status(201).json(newFavoriteList);
      } catch (err) {
        next(err);
      }
    }
  );
  
  app.put('/favorites/:id', async (req, res, next) => {
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
      next(err);
    }
  });
  
  app.delete('/favorites/:id', async (req, res, next) => {
    try {
      const deletedFavoriteList = await FavoriteList.findByIdAndDelete(
        req.params.id
      );
      if (!deletedFavoriteList) {
        return res.status(404).send('Favorite list not found');
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });
  
  // Rotas para Evaluations
  app.get('/evaluations', async (req, res, next) => {
    try {
      const { mangaId, page = 1, limit = 10 } = req.query;
      const query = mangaId ? { mangaId } : {};
  
      const evaluations = await Evaluation.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      const count = await Evaluation.countDocuments(query);
      res.json({
        evaluations,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      next(err);
    }
  });
  
  app.get('/evaluations/:mangaId', async (req, res, next) => {
    try {
      const mangaId = req.params.mangaId;
      const mangaEvaluations = await Evaluation.find({ mangaId });
  
      if (mangaEvaluations.length === 0) {
        return res.status(404).send('Evaluations not found');
      }
  
      res.json(mangaEvaluations);
    } catch (err) {
      next(err);
    }
  });
  
  app.post(
    '/evaluations',
    [
      body('mangaId').isMongoId().withMessage('Invalid manga ID'),
      body('userId').isMongoId().withMessage('Invalid user ID'),
      body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
      body('comment').optional().isString().withMessage('Comment must be a string'),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { mangaId, userId, rating, comment } = req.body;
        const newEvaluation = new Evaluation({ mangaId, userId, rating, comment });
        await newEvaluation.save();
        res.status(201).json(newEvaluation);
      } catch (err) {
        next(err);
      }
    }
  );
  
  app.put('/evaluations/:id', async (req, res, next) => {
    try {
      const updatedEvaluation = await Evaluation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedEvaluation) return res.status(404).send('Evaluation not found');
      res.json(updatedEvaluation);
    } catch (err) {
      next(err);
    }
  });
  
  app.delete('/evaluations/:id', async (req, res, next) => {
    try {
      const evaluationId = req.params.id;
      const evaluation = await Evaluation.findByIdAndDelete(evaluationId);
  
      if (!evaluation) {
        return res.status(404).send('Avaliação não encontrada');
      }
  
      res.status(200).send('Avaliação excluída com sucesso');
    } catch (err) {
      next(err);
    }
  });