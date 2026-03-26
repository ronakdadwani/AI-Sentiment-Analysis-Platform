import React, { useState } from 'react';
import axios from 'axios';
import { SentimentChart } from './SentimentChart';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const BatchUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    setResults(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze/batch`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error analyzing CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <p style={{ color: '#ccc', marginBottom: '20px' }}>Upload a CSV file containing a column of text/reviews to analyze them in bulk.</p>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          style={{ padding: '10px', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', outline: 'none' }}
        />
        <button onClick={handleUpload} disabled={loading || !file} style={{ marginTop: '0' }}>
          {loading ? "Processing..." : "Analyze Batch"}
        </button>
      </div>

      {error && <p style={{ color: '#ff3366', marginTop: '15px' }}>{error}</p>}

      {results && results.summary && (
        <div className="result-box glow-effect" style={{ marginTop: '30px', padding: '20px' }}>
          <h3 className="neon-text-small" style={{ textAlign: 'center' }}>Batch Results</h3>
          <p style={{ textAlign: 'center', marginBottom: '10px', color: '#e0e0e0' }}>
            Processed {results.details.length} records.
          </p>
          <SentimentChart summary={results.summary} />
        </div>
      )}
    </div>
  );
};
