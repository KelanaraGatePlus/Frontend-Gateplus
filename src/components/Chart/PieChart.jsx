import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const DefaultPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%" // Ubah radius agar lebih responsif
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
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

DefaultPieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      percentage: PropTypes.number.isRequired,
    })
  ).isRequired,
};
