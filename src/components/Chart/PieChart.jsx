import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const DefaultPieChart = ({ data }) => {

  const format2 = (num) => Number(num).toFixed(2);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          label={({ name, percentage }) => `${name}: ${format2(percentage)}%`}
          isAnimationActive={false}
          style={{ pointerEvents: "none" }}
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
            const percentage = entry.payload.percentage;
            return `${entry.payload.name}: ${format2(percentage)}%`;
          }}
          iconType="circle"
          iconSize={12}
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
