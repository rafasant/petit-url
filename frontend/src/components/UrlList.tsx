import React from 'react';
import './UrlList.css';
import { UserUrl } from '../services/api';

interface UrlListProps {
  urls: UserUrl[];
}

const UrlList: React.FC<UrlListProps> = ({ urls }) => {
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };
  
  if (urls.length === 0) {
    return (
      <div className="url-list-empty">
        <p>You haven't created any URLs yet.</p>
      </div>
    );
  }
  
  return (
    <div className="url-list">
      <h2>Your URLs</h2>
      <div className="url-items">
        {urls.map(url => (
          <div key={url.id} className="url-item">
            <div className="url-details">
              <div className="original-url">{url.originalUrl}</div>
              <div className="short-url">
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                  {url.shortUrl}
                </a>
                <button 
                  onClick={() => handleCopy(url.shortUrl)}
                  className="copy-btn"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="url-stats">
              <span className="visits">{url.visits} visits</span>
              <span className="date">Created: {new Date(url.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlList;
