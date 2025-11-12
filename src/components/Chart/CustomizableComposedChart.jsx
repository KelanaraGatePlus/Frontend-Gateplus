"use client";

import React from "react";
import {
    ComposedChart,
    Area,
    Line,
    Bar,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

// Tooltip custom
function CustomTooltip({ active, payload, label }) {
    if (active && payload?.length) {
        return (
            <div className="rounded-md bg-gray-700 px-3 py-2 text-sm text-white shadow-lg">
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.any,
};

// 🧩 Flexible Multi-Type Chart
export default function CustomizableComposedChart({
    data,
    charts,
    withAxis = false,
    showGrid = false,
    showLegend = false,
    noFill = false,
}) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={data}
                margin={{
                    top: 20,
                    left: 0,
                    bottom: 10,
                }}
            >
                {showGrid && <CartesianGrid strokeDasharray="3 3" />}

                {!noFill && (
                    <defs>
                        {charts.map((chart, i) => {
                            if (chart.type !== "area") return null;
                            const gradientId = `gradient-${i}-${Math.random()
                                .toString(36)
                                .substring(2, 9)}`;
                            chart.gradientId = gradientId;
                            return (
                                <linearGradient
                                    key={gradientId}
                                    id={gradientId}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={chart.gradientColors?.[0] || chart.strokeColor}
                                        stopOpacity={chart.gradientOpacity?.[0] ?? 1}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={chart.gradientColors?.[1] || chart.strokeColor}
                                        stopOpacity={chart.gradientOpacity?.[1] ?? 0.2}
                                    />
                                </linearGradient>
                            );
                        })}
                    </defs>
                )}

                {withAxis && (
                    <>
                        <XAxis dataKey={charts[0]?.xKey || "name"} axisLine tickLine />
                        <YAxis axisLine tickLine />
                    </>
                )}

                <Tooltip content={<CustomTooltip />} cursor={false} />
                {showLegend && <Legend />}

                {/* Render tiap chart sesuai tipe */}
                {charts.map((chart, i) => {
                    switch (chart.type) {
                        case "area":
                            return (
                                <Area
                                    key={i}
                                    type="monotone"
                                    dataKey={chart.dataKey}
                                    stroke={chart.strokeColor}
                                    strokeWidth={3}
                                    fill={
                                        noFill
                                            ? "transparent"
                                            : `url(#${chart.gradientId})`
                                    }
                                    name={chart.label || chart.dataKey}
                                />
                            );
                        case "line":
                            return (
                                <Line
                                    key={i}
                                    type="monotone"
                                    dataKey={chart.dataKey}
                                    stroke={chart.strokeColor}
                                    strokeWidth={3}
                                    dot={chart.dot ?? false}
                                    name={chart.label || chart.dataKey}
                                />
                            );
                        case "bar":
                            return (
                                <Bar
                                    key={i}
                                    dataKey={chart.dataKey}
                                    fill={chart.fillColor || chart.strokeColor}
                                    barSize={chart.barSize || 30}
                                    radius={[6, 6, 0, 0]}
                                    name={chart.label || chart.dataKey}
                                />
                            );
                        case "scatter":
                            return (
                                <Scatter
                                    key={i}
                                    dataKey={chart.dataKey}
                                    fill={chart.fillColor || chart.strokeColor}
                                    name={chart.label || chart.dataKey}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </ComposedChart>
        </ResponsiveContainer>
    );
}

CustomizableComposedChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    charts: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(["line", "area", "bar", "scatter"]).isRequired,
            dataKey: PropTypes.string.isRequired,
            strokeColor: PropTypes.string,
            fillColor: PropTypes.string,
            label: PropTypes.string,
            gradientColors: PropTypes.arrayOf(PropTypes.string),
            gradientOpacity: PropTypes.arrayOf(PropTypes.number),
            xKey: PropTypes.string,
            barSize: PropTypes.number,
            dot: PropTypes.bool,
        })
    ).isRequired,
    noFill: PropTypes.bool,
    withAxis: PropTypes.bool,
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
};
