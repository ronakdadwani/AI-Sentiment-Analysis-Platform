const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Sentiment = require("sentiment");
const multer = require("multer");
const csv = require("csv-parser");
const { Readable } = require("stream");

dotenv.config();

const app = express();
const sentiment = new Sentiment();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Security middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://sentiment-analyzer-delta.vercel.app', /\.vercel\.app$/] 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Single text analysis endpoint
app.post("/analyze", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: "Text is required and must be a string" });
  }

  if (text.length > 5000) {
    return res.status(400).json({ error: "Text is too long. Maximum 5000 characters allowed." });
  }

  try {
    const result = sentiment.analyze(text);
    
    // Format the response to match the previous OpenAI format for the frontend
    let sentimentLabel = "Neutral";
    if (result.score > 0) sentimentLabel = "Positive";
    if (result.score < 0) sentimentLabel = "Negative";

    // Calculate a pseudo-confidence based on comparative (word intensity)
    const confidence = Math.min(100, Math.max(50, 50 + Math.abs(result.comparative) * 50));
    
    const explanation = `Analyzed ${result.tokens.length} words. Found ${result.positive.length} positive words and ${result.negative.length} negative words.`;

    const formattedResult = `Sentiment: ${sentimentLabel}, Confidence: ${confidence.toFixed(1)}%, Explanation: ${explanation}`;

    res.json({ result: formattedResult });
  } catch (error) {
    console.error("Error in /analyze:", error);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});

// Batch CSV analysis endpoint
app.post("/analyze/batch", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No CSV file uploaded." });
  }

  const results = [];
  let summary = { Positive: 0, Negative: 0, Neutral: 0 };

  try {
    // Create a readable stream from the uploaded buffer
    const stream = Readable.from(req.file.buffer.toString('utf-8'));

    stream
      .pipe(csv())
      .on("data", (row) => {
        // Assume the CSV has a column named "text" or "review"
        const textToAnalyze = row.text || row.review || row.content || row.Message || Object.values(row)[0];
        
        if (textToAnalyze) {
          const analysis = sentiment.analyze(textToAnalyze);
          
          let sentimentLabel = "Neutral";
          if (analysis.score > 0) {
            sentimentLabel = "Positive";
            summary.Positive++;
          } else if (analysis.score < 0) {
            sentimentLabel = "Negative";
            summary.Negative++;
          } else {
            summary.Neutral++;
          }

          results.push({
            text: textToAnalyze.substring(0, 100) + (textToAnalyze.length > 100 ? "..." : ""),
            sentiment: sentimentLabel,
            score: analysis.score
          });
        }
      })
      .on("end", () => {
        res.json({
          summary,
          details: results
        });
      })
      .on("error", (error) => {
        console.error("CSV Parsing Error:", error);
        res.status(500).json({ error: "Failed to parse CSV file." });
      });

  } catch (error) {
    console.error("Batch processing error:", error);
    res.status(500).json({ error: "Internal server error during batch processing." });
  }
});

// Production catch-all
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Export the app for Vercel
module.exports = app;

// Only start the server if this file is run directly (not as a module)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}
