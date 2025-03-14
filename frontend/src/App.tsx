import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import UrlForm from './components/UrlForm';
import ResultDisplay from './components/ResultDisplay';
import Login from './components/Login';
import UrlList from './components/UrlList';
import { getUserUrls, ShortenUrlResponse, UserUrl } from './services/api';

// Home page component
const Home: React.FC = () => {
  const [result, setResult] = useState<ShortenUrlResponse | null>(null);
  
  const handleSuccess = (data: ShortenUrlResponse) => {
    setResult(data);
  };
  
  return (
    <div className="container">
      <UrlForm onSuccess={handleSuccess} />
      {result && (
        <ResultDisplay 
          originalUrl={result.originalUrl} 
          shortUrl={result.shortUrl} 
        />
      )}
    </div>
  );
};

// Dashboard component
const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [urls, setUrls] = useState<UserUrl[]>([]);
  const [result, setResult] = useState<ShortenUrlResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getUserUrls();
        setUrls(data);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUrls();
  }, []);
  
  const handleSuccess = async (data: ShortenUrlResponse) => {
    setResult(data);
    // Refresh URL list
    try {
      const updatedUrls = await getUserUrls();
      setUrls(updatedUrls);
    } catch (error) {
      console.error('Error refreshing URLs:', error);
    }
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container dashboard">
      <UrlForm onSuccess={handleSuccess} />
      {result && (
        <ResultDisplay 
          originalUrl={result.originalUrl} 
          shortUrl={result.shortUrl} 
        />
      )}
      {loading ? (
        <div>Loading your URLs...</div>
      ) : (
        <UrlList urls={urls} />
      )}
    </div>
  );
};

// Auth component
const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="container">
      <Login />
    </div>
  );
};

// Header component
const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <header className="app-header">
      <div className="container">
        <div className="logo">Petit URL</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="link-button" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

// Main App
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
