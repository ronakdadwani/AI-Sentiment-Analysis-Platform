import React from 'react';

export const ResultCard = ({ result }) => {
  if (!result) return null;

  // Handle both string (old/fallback) and object (new) results
  const data = typeof result === 'string' ? { explanation: result } : result;
  
  const getSentimentColor = (label) => {
    switch (label?.toLowerCase()) {
      case 'positive': return '#00ffcc';
      case 'negative': return '#ff3366';
      case 'mixed': return '#ffcc00';
      default: return '#00ccff';
    }
  };

  return (
    <div className="result-box glow-effect" style={{ textAlign: 'left', padding: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 className="neon-text-small" style={{ margin: 0 }}>Analysis Result</h3>
        {data.sentiment_label && (
          <span style={{ 
            color: getSentimentColor(data.sentiment_label),
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '1.2rem'
          }}>
            {data.sentiment_label}
          </span>
        )}
      </div>

      {data.confidence !== undefined && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>
            <span>Confidence</span>
            <span>{data.confidence}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${data.confidence}%`, 
              background: `linear-gradient(90deg, #333, ${getSentimentColor(data.sentiment_label)})`,
              transition: 'width 1s ease-out'
            }} />
          </div>
        </div>
      )}

      {data.emotions && data.emotions.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Detected Emotions</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {data.emotions.map((emotion, i) => (
              <span key={i} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '4px 12px', 
                borderRadius: '15px', 
                fontSize: '0.85rem',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#eee'
              }}>
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', borderLeft: `3px solid ${getSentimentColor(data.sentiment_label)}` }}>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#e0e0e0' }}>
          {data.explanation}
        </p>
      </div>

      {data.key_phrases && data.key_phrases.length > 0 && (
        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#888' }}>
           Key insights: {data.key_phrases.join(', ')}
        </div>
      )}
      
      {data.is_fallback && (
        <div style={{ marginTop: '10px', fontSize: '0.7rem', color: '#ff3366', opacity: 0.7 }}>
          ⚠️ Limited mode: Analysis generated using local engine.
        </div>
      )}
    </div>
  );
};
