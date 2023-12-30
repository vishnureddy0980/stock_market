// src/components/StockList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockList.css'; 

const StockList = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(
          'https://cloud.iexapis.com/stable/stock/market/batch',
          {
            params: {
              token: 'pk_2e919cd3256d400ca1250a71fd8d94fe', 
              symbols: 'AAPL,GOOGL,MSFT,AMZN,FB,TSLA,NFLX,V,DIS,JPM', 
              types: 'quote',
            },
          }
        );

        const stockData = Object.values(response.data);
        const stocksWithAllTimeHighsAndLows = await Promise.all(
          stockData.map(async (stock) => {
            const allTimeHigh = await getAllTimeHigh(stock.quote.symbol);
            const allTimeLow = await getAllTimeLow(stock.quote.symbol);
            return { ...stock, allTimeHigh, allTimeLow };
          })
        );

        setStocks(stocksWithAllTimeHighsAndLows);
      } catch (error) {
        console.error('Error fetching stock data:', error.message);
      }
    };

    fetchStocks();
  }, []);

  const getAllTimeHigh = async (symbol) => {
    try {
      const response = await axios.get(
        `https://cloud.iexapis.com/stable/stock/${symbol}/stats`,
        {
          params: {
            token: 'pk_2e919cd3256d400ca1250a71fd8d94fe', 
          },
        }
      );
      return response.data.week52high;
    } catch (error) {
      console.error(`Error fetching all-time high for ${symbol}:`, error.message);
      return null;
    }
  };

  const getAllTimeLow = async (symbol) => {
    try {
      const response = await axios.get(
        `https://cloud.iexapis.com/stable/stock/${symbol}/stats`,
        {
          params: {
            token: 'pk_2e919cd3256d400ca1250a71fd8d94fe', 
          },
        }
      );
      return response.data.week52low;
    } catch (error) {
      console.error(`Error fetching all-time low for ${symbol}:`, error.message);
      return null;
    }
  };

  return (
    <div className="stock-list-container">
      <h2>Stock Market App</h2>
      <ul className="stock-list">
        {stocks.map((stock) => (
          <li key={stock.quote.symbol} className="stock-item">
            <span className="stock-symbol">{stock.quote.symbol}</span>
            <div className="stock-info">
              <span className="stock-price">
                Latest Price: ${stock.quote.latestPrice.toFixed(2)}
              </span>
              <span className="stock-high-low">
                All-Time High: ${stock.allTimeHigh} | All-Time Low: ${stock.allTimeLow}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;
