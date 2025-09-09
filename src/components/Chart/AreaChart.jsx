"use client";


import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

const data = [
  { date: "01", value: 0 },
  { date: "02", value: 400 },
  { date: "03", value: 500 },
  { date: "04", value: 700 },
  { date: "05", value: 1100 },
  { date: "06", value: 1600 },
  { date: "07", value: 2000 },
  { date: "08", value: 1900 },
  { date: "09", value: 1700 },
  { date: "10", value: 1400 },
  { date: "11", value: 1300 },
  { date: "12", value: 900 },
  { date: "13", value: 500 },
  { date: "14", value: 200 },
  { date: "15", value: 250 },
  { date: "16", value: 350 },
  { date: "17", value: 0 },
  { date: "18", value: 0 },
  { date: "19", value: 0 },
  { date: "30", value: 0 },
];

// Tooltip custom (hover)
function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="rounded-md border border-[#8b8b8b] bg-[#0f1a1e] px-3 py-2 shadow-lg">
        <div className="text-xs text-neutral-400">Date: {label}</div>
        <div className="text-sm font-semibold text-[#3BC6F6]">
          {payload[0].value}
        </div>
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
  label: PropTypes.any,
};

export default function AreaTrendChart() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
          >
            {/* GRID abu-abu */}
            <CartesianGrid stroke="#8b8b8b" strokeDasharray="6 6" vertical />

            {/* Axis */}
            <XAxis
              dataKey="date"
              scale="point"   // titik merata
              tick={{ fill: "#8b8b8b", fontSize: 12 }}
              axisLine={{ stroke: "#8b8b8b" }}
              tickLine={{ stroke: "#8b8b8b" }}
            />

            <YAxis
              tick={{ fill: "#8b8b8b", fontSize: 12 }}
              axisLine={{ stroke: "#8b8b8b" }}
              tickLine={{ stroke: "#8b8b8b" }}
              width={40}
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8b8b8b" }} />

            {/* Gradien area */}
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3BC6F6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#3BC6F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Area + stroke + titik biru */}
            <Area
              type="linear"
              dataKey="value"
              stroke="#3BC6F6"
              strokeWidth={2}
              fill="url(#areaFill)"
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#3BC6F6", fill: "#fff" }}
              dot={{ r: 4, fill: "#3BC6F6", stroke: "#fff", strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
