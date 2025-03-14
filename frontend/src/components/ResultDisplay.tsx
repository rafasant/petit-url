import React, { useState } from 'react';
import './ResultDisplay.css';

interface ResultDisplayProps {
  originalUrl: string;
  shortUrl: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalUrl, shortUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="result-display">
      <h3>Your Shortened URL</h3>
      <div className="url-info">
        <div className="original-url">
          <strong>Original:</strong> 
          <span className="url">{originalUrl}</span>
        </div>
        <div className="short-url">
          <strong>Shortened:</strong> 
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="url">
            {shortUrl}
          </a>
          <button onClick={handleCopy} className="copy-button">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
