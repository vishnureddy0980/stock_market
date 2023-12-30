
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "chart.js/auto";
import { Line } from 'react-chartjs-2';
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
              types: 'quote,chart',
            },
          }
        );

        const stockData = Object.values(response.data);
        const stocksWithAllTimeHighsAndLows = await Promise.all(
          stockData.map(async (stock) => {
            const historicalData = await getHistoricalData(stock.quote.symbol);
            return { ...stock, historicalData };
          })
        );

        setStocks(stocksWithAllTimeHighsAndLows);
      } catch (error) {
        console.error('Error fetching stock data:', error.message);
      }
    };

    fetchStocks();
  }, []);

  const getHistoricalData = async (symbol) => {
    try {
      const response = await axios.get(
        `https://cloud.iexapis.com/stable/stock/${symbol}/chart/1y`,
        {
          params: {
            token: 'pk_2e919cd3256d400ca1250a71fd8d94fe',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error.message);
      return [];
    }
  };

  return (
    <div className="stock-list-container">
      <h2>Stock Market App</h2>
      <div className="stock-list">
        {stocks.map((stock) => (
          <div key={stock.quote.symbol} className="stock-item">
            <span className="stock-symbol">{stock.quote.symbol}</span>
            <div className="stock-info">
              <span className="stock-price">
                Latest Price: ${stock.quote.latestPrice.toFixed(2)}
              </span>
            </div>
            <div className="stock-chart">
              <Line
                data={{
                  labels: stock.historicalData.map((data) => data.label),
                  datasets: [
                    {
                      label: 'Stock Price',
                      data: stock.historicalData.map((data) => data.close),
                      borderColor: 'rgba(75,192,192,1)',
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                }}
                options={{
                  scales: {
                    xAxes: [
                      {
                        type: 'time',
                        time: {
                          unit: 'day',
                        },
                      },
                    ],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                        scaleLabel: {
                          display: true,
                          labelString: 'Stock Price (USD)',
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;
