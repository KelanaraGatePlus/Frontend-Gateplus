"use client";

import React from "react";
import {
    BarChart,
    Bar,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
} from "recharts";
import PropTypes from "prop-types";

// Tooltip kustom
function CustomTooltip({ active, payload, label }) {
    if (active && payload?.length) {
        return (
            <div className="rounded-md bg-gray-700 px-3 py-1 text-sm text-white shadow-lg">
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
};

// Komponen utama
export default function CustomizableMultiBarChart({
    data,
    bars = [
        { key: "value", color: "#16a34a" }, // Default satu bar
    ],
    withAxis = false,
    withGrid = false,
    barGap = 4,
    barCategoryGap = "20%",
}) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
                barGap={barGap}
                barCategoryGap={barCategoryGap}
            >
                {withGrid && (
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                )}

                {withAxis && (
                    <>
                        <XAxis
                            dataKey="name"
                            axisLine={true}
                            tickLine={false}
                        />
                        <YAxis
                            axisLine={true}
                            tickLine={true}
                        />
                    </>
                )}

                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Legend />

                {/* Render semua bar berdasarkan array bars */}
                {bars.map((bar, idx) => (
                    <Bar
                        key={idx}
                        dataKey={bar.key}
                        fill={bar.color}
                        radius={[4, 4, 0, 0]}
                        name={bar.label || bar.key}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

CustomizableMultiBarChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    bars: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            color: PropTypes.string,
            label: PropTypes.string,
        })
    ),
    withAxis: PropTypes.bool,
    withGrid: PropTypes.bool,
    barGap: PropTypes.number,
    barCategoryGap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
