import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MarketChart = ({ stocks }) => {
  // Generate sample price data for the last 7 days
  const generatePriceData = (stock) => {
    const data = [];
    const basePrice = stock.price;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price variations
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = basePrice * (1 + variation);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        [stock.symbol]: Math.round(price * 100) / 100,
        name: stock.symbol
      });
    }
    
    return data;
  };

  // Create chart data for all stocks
  const chartData = stocks.map(stock => ({
    ...stock,
    data: generatePriceData(stock)
  }));

  // Flatten data for the chart
  const flatData = chartData[0]?.data.map((_, index) => {
    const dataPoint = { date: chartData[0].data[index].date };
    chartData.forEach(stock => {
      dataPoint[stock.symbol] = stock.data[index][stock.symbol];
    });
    return dataPoint;
  }) || [];

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']; // Blue, Red, Green, Orange, Purple, Pink

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Market Overview</h3>
        <p className="text-gray-600">7-day price trends for all stocks</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={flatData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {chartData.map((stock, index) => (
              <Line
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={colors[index]}
                strokeWidth={2}
                dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[index], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {chartData.map((stock, index) => (
          <div key={stock.symbol} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[index] }}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {stock.symbol} - {formatCurrency(stock.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketChart;
