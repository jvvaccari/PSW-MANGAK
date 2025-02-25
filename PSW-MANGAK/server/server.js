import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import https from "https";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';

import Manga from "./models/Manga.js";
import Author from "./models/Author.js";
import Account from "./models/Account.js";
import FavoriteList from "./models/FavoriteList.js";
import Evaluation from "./models/Evaluation.js";
import Token from "./models/Token.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

const options = {
  key: fs.readFileSync(
    "./certification/localhost_decrypted.key"
  ),
  cert: fs.readFileSync(
    "./certification/localhost.crt"
  ),
};

app.use(
  cors({
    origin: /https:\/\/localhost:\d{4}/,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  app.get("/accounts/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
  
      const account = await Account.findById(id);
      if (!account) return res.status(404).json({ message: "Account not found" });
  
      res.json(account);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.post("/accounts/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const account = await Account.findOne({ email });
      if (!account) return res.status(401).send("Credenciais inválidas");
  
      const passwordMatch = await bcryptjs.compare(password, account.password);
      if (!passwordMatch) return res.status(401).send("Credenciais inválidas");
  
      const user = { email: email, id: account._id };
  
      const accessToken = generateAcessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  
      await Token.deleteMany({ userId: account._id });
  
      const token = new Token({
        userId: account._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
      });
  
      await token.save();
  
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        })
        .json({ _id: account._id, accessToken });
    } catch (error) {
      res.status(500).send("Erro no servidor: " + error.message);
    }
  });  
  
  app.put("/accounts/:id", authenticateToken, async (req, res) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedAccount) return res.status(404).send("Account not found");
  
      const user = { email: updatedAccount.email, id: updatedAccount._id };
      const accessToken = generateAcessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  
      await Token.deleteMany({ userId: updatedAccount._id });
  
      const token = new Token({
        userId: updatedAccount._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 8000 * 1000)
      });
  
      await token.save();
  
      res.json({ accessToken, refreshToken });
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  
  app.post("/accounts/register", async (req, res) => {
    const { username, email, password } = req.body;
    const crtPassword = await bcryptjs.hash(password, 10);
  
    try {
      const existingUser = await Account.findOne({ email });
      if (existingUser) return res.status(400).send("Email already in use");
  
      const newUser = new Account({
        username,
        email,
        password: crtPassword,
        favorites: [],
        role: "user"
      });
  
      await newUser.save();
  
      const user = { email: newUser.email, id: newUser._id };
      const accessToken = generateAcessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  
      await Token.deleteMany({ userId: newUser._id });
  
      const token = new Token({
        userId: newUser._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 8000 * 1000)
      });
  
      await token.save();
  
      const { password, ...userWithoutPassword } = newUser.toObject();
  
      res.status(201).json({
        user: userWithoutPassword,
        accessToken,
        refreshToken
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/accounts/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh Token ausente" });
  
    try {
      const storedToken = await Token.findOne({ token: refreshToken });
      if (!storedToken) return res.status(403).json({ message: "Refresh Token inválido" });
  
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ message: "Token expirado ou inválido" });
  
        const newAccessToken = generateAcessToken({ email: user.email, id: user.id });
  
        res.json({ accessToken: newAccessToken });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });  
  
  app.delete("/accounts/:id", authenticateToken, async (req, res) => {
    try {
      const deletedAccount = await Account.findByIdAndDelete(req.params.id);
      if (!deletedAccount) return res.status(404).send("Account not found");
  
      await Token.deleteMany({ userId: req.params.id });
  
      res.status(204).send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  });  

app.get("/mangas", async (_req, res) => {
  try {
    const mangas = await Manga.find();
    res.json(mangas);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/mangas", async (req, res) => {
  try {
    const newManga = new Manga(req.body);
    await newManga.save();
    res.status(201).json(newManga);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/mangas/:id", async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id).populate("authorId");
    if (!manga) return res.status(404).send("Manga not found");
    res.json(manga);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/mangas/:id", async (req, res) => {
  try {
    const updatedManga = await Manga.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedManga) return res.status(404).send("Manga not found");
    res.json(updatedManga);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/mangas/:id", async (req, res) => {
  try {
    const deletedManga = await Manga.findByIdAndDelete(req.params.id);
    if (!deletedManga) return res.status(404).send("Manga not found");
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/authors/:id", async (req, res) => {
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

app.post("/authors", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/authors/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).send("Author not found");
    res.json(author);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/authors/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAuthor) return res.status(404).send("Author not found");
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/authors/:id", async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) return res.status(404).send("Author not found");
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/favorites", async (req, res) => {
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

app.get("/favorites/:id", async (req, res) => {
  try {
    const favoriteList = await FavoriteList.findById(req.params.id);
    if (!favoriteList) return res.status(404).send("Favorite list not found");
    res.json(favoriteList);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/favorites", async (req, res) => {
  try {
    const newFavoriteList = new FavoriteList(req.body);
    await newFavoriteList.save();
    res.status(201).json(newFavoriteList);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put("/favorites/:id", async (req, res) => {
  try {
    const updatedFavoriteList = await FavoriteList.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFavoriteList) {
      return res.status(404).send("Favorite list not found");
    }
    res.json(updatedFavoriteList);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put("/favorites/list/:id", async (req, res) => {
  try {
    const updatedFavoriteList = await FavoriteList.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFavoriteList) {
      return res.status(404).send("Favorite list not found");
    }
    res.json(updatedFavoriteList);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/favorites/:id", async (req, res) => {
  try {
    const deletedFavoriteList = await FavoriteList.findByIdAndDelete(
      req.params.id
    );
    if (!deletedFavoriteList) {
      return res.status(404).send("Favorite list not found");
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/evaluations", async (req, res) => {
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

app.get("/evaluations/:mangaId", async (req, res) => {
  try {
    // Certifique-se de tratar o mangaId como uma string
    const mangaId = req.params.mangaId;

    // Busca pelas avaliações usando mangaId como string
    const mangaEvaluations = await Evaluation.find({ mangaId: mangaId });

    if (mangaEvaluations.length === 0) {
      return res.status(404).send("Evaluations not found");
    }

    res.json(mangaEvaluations);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/evaluations", async (req, res) => {
  try {
    const { mangaId, userId, rating, comment } = req.body;

    if (typeof mangaId !== "string" || typeof userId !== "string") {
      return res.status(400).send("mangaId and userId must be strings");
    }

    console.log(
      "mangaId:",
      mangaId,
      "userId:",
      userId,
      "rating:",
      rating,
      "comment:",
      comment
    );

    const newEvaluation = new Evaluation({
      mangaId: mangaId,
      userId: userId,
      rating,
      comment,
    });

    // Salvando no MongoDB
    await newEvaluation.save();

    res.status(201).json(newEvaluation);
  } catch (err) {
    console.error("Erro ao salvar a avaliação:", err);
    res.status(400).send(err.message);
  }
});

app.put("/evaluations/:id", async (req, res) => {
  try {
    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvaluation) return res.status(404).send("Evaluation not found");
    res.json(updatedEvaluation);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/evaluations/:id", async (req, res) => {
  try {
    const evaluationId = req.params.id;
    const evaluation = await Evaluation.findByIdAndDelete(evaluationId);

    if (!evaluation) {
      return res.status(404).send("Avaliação não encontrada");
    }

    res.status(200).send("Avaliação excluída com sucesso");
  } catch (err) {
    res.status(400).send("Erro ao excluir avaliação");
  }
});

function generateAcessToken(user) {
  console.log("Gerando token para o usuário:", user);
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" });
  console.log("Token gerado:", token);
  return token;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(authHeader);

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    req.user = user;
    next();
  });
}

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
