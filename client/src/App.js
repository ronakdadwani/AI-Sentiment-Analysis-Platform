import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import { BackgroundEffects } from "./components/BackgroundEffects";
import { SentimentForm } from "./components/SentimentForm";
import { ResultCard } from "./components/ResultCard";
import { BatchUpload } from "./components/BatchUpload";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, { text });
      setResult(response.data.result);
    } catch (error) {
      setResult(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <BackgroundEffects />
      
      <div className="container glass-panel">
        <h1 className="neon-text">Sentiment Analyzer</h1>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            Single Text
          </button>
          <button 
            className={`tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
          >
            Batch CSV
          </button>
        </div>

        {activeTab === 'single' ? (
          <>
            <SentimentForm text={text} setText={setText} handleAnalyze={handleAnalyze} loading={loading} />
            <ResultCard result={result} />
          </>
        ) : (
          <BatchUpload />
        )}
      </div>
    </div>
  );
}

export default App;
