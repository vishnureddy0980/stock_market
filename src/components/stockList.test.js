
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios'; 

import StockList from './stockList';


jest.mock('axios');


const mockApiResponse = {
  data: {
    AAPL: {
      quote: { symbol: 'AAPL' },
    },
    GOOGL: {
      quote: { symbol: 'GOOGL' },
    },
   
  },
};

beforeEach(() => {
  
  jest.clearAllMocks();
});

test('renders stock list correctly', async () => {

  axios.get.mockResolvedValueOnce(mockApiResponse);

  render(<StockList />);

 
  await waitFor(() => {
    const headerElement = screen.getByText(/Stock Market App/i);
    expect(headerElement).toBeInTheDocument();
  });
});

test('displays stock symbols', async () => {
  
  axios.get.mockResolvedValueOnce(mockApiResponse);

  render(<StockList />);

 
  await waitFor(() => {
    const appleSymbol = screen.getByText(/AAPL/i);
    const googleSymbol = screen.getByText(/GOOGL/i);

    expect(appleSymbol).toBeInTheDocument();
    expect(googleSymbol).toBeInTheDocument();
  });
});


