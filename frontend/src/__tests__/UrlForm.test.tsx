import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UrlForm from '../components/UrlForm';
import { shortenUrl } from '../services/api';

// Mock API service
jest.mock('../services/api', () => ({
  shortenUrl: jest.fn(),
}));

describe('UrlForm Component', () => {
  const mockOnSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders form elements correctly', () => {
    render(<UrlForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByPlaceholderText(/enter your long url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shorten url/i })).toBeInTheDocument();
  });
  
  test('shows error for invalid URL', () => {
    render(<UrlForm onSuccess={mockOnSuccess} />);
    
    // Enter invalid URL and submit
    fireEvent.change(screen.getByPlaceholderText(/enter your long url/i), {
      target: { value: 'invalid-url' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /shorten url/i }));
    
    expect(screen.getByText(/url must start with http/i)).toBeInTheDocument();
    expect(shortenUrl).not.toHaveBeenCalled();
  });
  
  // TODO: Add more tests for successful URL shortening and custom slugs
});
