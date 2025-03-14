import React, { useState } from 'react';
import { shortenUrl } from '../services/api';
import './UrlForm.css';

interface UrlFormProps {
  onSuccess: (data: any) => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSuccess }) => {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [showCustomSlug, setShowCustomSlug] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await shortenUrl(url, showCustomSlug ? customSlug : undefined);
      onSuccess(data);
      setUrl('');
      setCustomSlug('');
      setShowCustomSlug(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-form">
      <h2>Shorten Your URL</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL"
            disabled={loading}
          />
        </div>
        
        <div className="custom-slug-toggle">
          <label>
            <input
              type="checkbox"
              checked={showCustomSlug}
              onChange={() => setShowCustomSlug(!showCustomSlug)}
              disabled={loading}
            />
            Customize URL slug
          </label>
        </div>
        
        {showCustomSlug && (
          <div className="form-group custom-slug">
            <div className="custom-slug-input">
              <span>petit.url/</span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="custom-slug"
                disabled={loading}
              />
            </div>
          </div>
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default UrlForm;
