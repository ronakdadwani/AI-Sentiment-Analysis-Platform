import React from 'react';

export const ResultCard = ({ result }) => {
  if (!result) return null;
  return (
    <div className="result-box glow-effect">
      <h3 className="neon-text-small">Result:</h3>
      <p>{result}</p>
    </div>
  );
};
