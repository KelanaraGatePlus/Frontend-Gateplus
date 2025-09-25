"use client";

import React from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

// Tooltip tidak berubah
function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className="rounded-md bg-gray-700 px-3 py-1 text-sm font-semibold text-white shadow-lg">
        {payload[0].value}
      </div>
    );
  }
  return null;
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
    })
  ),
};

export default function CustomizableAreaChart({
  data,
  strokeColor = "#16a34a",
  gradientColors = ["#22c55e", "#22c55e"],
  gradientOpacity = [1, 1],
  noFill = false,
}) {
  // Gunakan ID unik untuk gradient agar tidak bentrok jika ada beberapa chart di satu halaman
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        {/* Definisi Gradient hanya dirender jika `noFill` adalah false */}
        {!noFill && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={gradientOpacity[0]} />
              <stop offset="95%" stopColor={gradientColors[1]} stopOpacity={gradientOpacity[1]} />
            </linearGradient>
          </defs>
        )}

        <Tooltip content={<CustomTooltip />} cursor={false} />

        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={5}
          // Secara kondisional mengatur 'fill'
          // Jika noFill true, maka 'fill' transparan. Jika false, gunakan gradient.
          fill={noFill ? "transparent" : `url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

CustomizableAreaChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  strokeColor: PropTypes.string,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  gradientOpacity: PropTypes.arrayOf(PropTypes.number),
  noFill: PropTypes.bool,
};