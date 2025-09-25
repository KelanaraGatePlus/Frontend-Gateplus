import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Data untuk pie chart
const data = [
  { name: 'Desktop', value: 45, color: '#4c80d7' },
  { name: 'Mobile', value: 25, color: '#ff8b2a' },
  { name: 'Tablet', value: 30, color: '#57c75c' },
];

// Fungsi untuk menghitung persentase
const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);
const dataWithPercentage = data.map(entry => ({
  ...entry,
  percentage: ((entry.value / totalValue) * 100).toFixed(2),
}));

const DefaultPieChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dataWithPercentage}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%" // Ubah radius agar lebih responsif
          label
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          formatter={(value, entry) => {
            const percentage = entry.payload.percentage; // Mengakses data percentage dari entry
            return `${entry.payload.name}: ${percentage}%`;
          }}
          iconType="circle" // Membuat icon legend berbentuk lingkaran
          iconSize={12} // Ukuran lingkaran
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DefaultPieChart;
