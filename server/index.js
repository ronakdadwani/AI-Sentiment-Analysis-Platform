const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const multer = require("multer");
const csv = require("csv-parser");
const { Readable } = require("stream");

dotenv.config();

const app = express();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT = `You are a production-grade Sentiment Analysis Engine with built-in validation and testing capabilities.

Your task is to:
1. Analyze the sentiment of the given text
2. Validate your own output for correctness and consistency
3. Handle edge cases, sarcasm, and mixed sentiments
4. Ensure strict JSON output formatting

Return the following structure:
{
  "sentiment_label": "Positive" | "Negative" | "Neutral" | "Mixed",
  "sentiment_score": float,
  "emotions": ["joy", "anger", ...],
  "confidence": percentage,
  "key_phrases": ["phrase1", "phrase2"],
  "detected_issues": ["issue1", ...],
  "validation": {
    "is_json_valid": true,
    "is_consistent": true,
    "edge_case_detected": false
  },
  "explanation": "concise reasoning"
}

Strict Rules:
- Always return valid JSON (no extra text)
- Ensure sentiment_score aligns with sentiment_label:
    Positive → (0.2 to 1)
    Negative → (-1 to -0.2)
    Neutral → (-0.2 to 0.2)
- Do not hallucinate information not present in the text.`;

// Single text analysis endpoint (Pro-grade Upgrade)
app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: "Text is required and must be a string" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective and fast for sentiment
      messages: [
        { role: "system", content: ANALYSIS_PROMPT },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.json(result);

  } catch (error) {
    console.error("OpenAI Error:", error);
    
    // Fallback to basic sentiment analysis if OpenAI fails
    try {
      const basicResult = sentiment.analyze(text);
      let sentimentLabel = "Neutral";
      if (basicResult.score > 0) sentimentLabel = "Positive";
      if (basicResult.score < 0) sentimentLabel = "Negative";

      res.json({
        sentiment_label: sentimentLabel,
        sentiment_score: basicResult.score / 5, 
        emotions: [],
        confidence: 60,
        key_phrases: basicResult.words,
        explanation: "Fallback analysis due to API error. " + (error.message || ""),
        is_fallback: true
      });
    } catch (fallbackError) {
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
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
