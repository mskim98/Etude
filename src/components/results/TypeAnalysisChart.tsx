"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface AnalysisData {
  name: string;
  correct: number;
  total: number;
  percentage: number;
}

interface TypeAnalysisChartProps {
  title: string;
  data: AnalysisData[];
  chartType?: "bar" | "donut";
  insights?: {
    strengths: string[];
    needsWork: string[];
  };
}

const COLORS = {
  primary: "var(--color-accent)",
  secondary: "#6b7280",
  tertiary: "#9ca3af",
  quaternary: "#d1d5db"
};

export function TypeAnalysisChart({
  title,
  data,
  chartType = "bar",
  insights
}: TypeAnalysisChartProps) {
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" fontSize={12} />
        <YAxis fontSize={12} />
        <Bar dataKey="percentage" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderDonutChart = () => {
    const chartData = data.map((item, index) => ({
      ...item,
      fill: Object.values(COLORS)[index % Object.keys(COLORS).length]
    }));

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            dataKey="percentage"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend fontSize={12} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart */}
        <div className="w-full">
          {chartType === "bar" ? renderBarChart() : renderDonutChart()}
        </div>

        {/* Data Table */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-base">
              <span className="text-gray-700 font-medium">{item.name}</span>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">
                  {item.correct}/{item.total}
                </span>
                <span className="font-semibold text-lg" style={{ color: item.percentage >= 70 ? COLORS.primary : COLORS.secondary }}>
                  {Math.round(item.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        {insights && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {insights.strengths.length > 0 && (
              <div>
                <div className="text-base font-semibold text-green-600 mb-2">Strengths</div>
                <div className="text-sm text-gray-600">
                  {insights.strengths.join(", ")}
                </div>
              </div>
            )}
            {insights.needsWork.length > 0 && (
              <div>
                <div className="text-base font-semibold text-red-600 mb-2">Needs Work</div>
                <div className="text-sm text-gray-600">
                  {insights.needsWork.join(", ")}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}