import React from 'react';

export const SentimentForm = ({ text, setText, handleAnalyze, loading }) => (
  <div style={{ marginTop: '20px' }}>
    <textarea
      rows="5"
      placeholder="Enter text to analyze sentiment..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <button onClick={handleAnalyze} disabled={loading || !text.trim()}>
      {loading ? "Analyzing..." : "Analyze Sentiment"}
    </button>
  </div>
);
