import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  Positive: '#00ff9d',
  Negative: '#ff3366',
  Neutral: '#00ccff'
};

export const SentimentChart = ({ summary }) => {
  if (!summary) return null;

  const data = Object.keys(summary).map(key => ({
    name: key,
    value: summary[key]
  })).filter(item => item.value > 0);

  if (data.length === 0) return <p>No data to display.</p>;

  return (
    <div style={{ height: 300, width: '100%', marginTop: '30px' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #0ff', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
