import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sample data schema
const DataSchema = new mongoose.Schema({
    name: String,
    value: Number
});

const Data = mongoose.model('Data', DataSchema);

// CRUD routes
app.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/data', async (req, res) => {
    try {
        const newData = new Data(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.put('/data/:id', async (req, res) => {
    try {
        const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.delete('/data/:id', async (req, res) => {
    try {
        await Data.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
