require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process on connection failure
  });

// Quote Schema
const QuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Unknown" }
});

const Quote = mongoose.model("Quote", QuoteSchema);

// API Routes

// Get all quotes
app.get('/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new quote
app.post('/quotes', async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ error: "Quote text is required" });

    const newQuote = new Quote({ text, author });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(500).json({ error: "Failed to create quote" });
  }
});

// Delete a quote
app.delete('/quotes/:id', async (req, res) => {
  try {
    const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
    if (!deletedQuote) return res.status(404).json({ error: "Quote not found" });

    res.json({ message: "✅ Quote deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete quote" });
  }
});

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

