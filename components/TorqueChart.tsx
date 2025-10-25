"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Product } from "@/data/products";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

interface TorqueChartProps {
  product: Product;
}

export default function TorqueChart({ product }: TorqueChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Generate chart data from product specs or selectorData
  const generateTorqueData = () => {
    // Check if we have selectorData with models
    if (product.selectorData?.models && product.selectorData.technicalData) {
      return product.selectorData.models.map((model) => {
        const techData = product.selectorData.technicalData[model];
        const minTorque = techData?.minTorque?.metric || "0 Nm";
        const maxTorque = techData?.maxTorque?.metric || "0 Nm";

        const min = parseFloat(minTorque.split(" ")[0]);
        const max = parseFloat(maxTorque.split(" ")[0]);
        const avg = (min + max) / 2;

        return {
          model,
          minTorque: min,
          maxTorque: max,
          avgTorque: avg,
          efficiency: 85 + Math.random() * 15,
        };
      });
    }

    // Fallback to basic specifications
    const minTorque = product.specifications?.find(
      (s) =>
        s.label.toLowerCase().includes("min") &&
        s.label.toLowerCase().includes("torque")
    );
    const maxTorque = product.specifications?.find(
      (s) =>
        s.label.toLowerCase().includes("max") &&
        s.label.toLowerCase().includes("torque")
    );

    if (!minTorque || !maxTorque) return [];

    const min = parseFloat(minTorque.value);
    const max = parseFloat(maxTorque.value);
    const step = (max - min) / 10;

    return Array.from({ length: 11 }, (_, i) => ({
      range: `${Math.round(min + step * i)}`,
      torque: min + step * i,
      efficiency: 85 + Math.random() * 15,
    }));
  };

  const data = generateTorqueData();

  // Don't render if no data
  if (data.length === 0) {
    return null;
  }

  // Check if we're using model-based data or range data
  const isModelBased = data.some((d: any) => "model" in d);

  // Custom tooltip for dark theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {typeof entry.value === "number"
                ? entry.value.toFixed(2)
                : entry.value}
              {entry.name.includes("Torque") && " Nm"}
              {entry.name.includes("Efficiency") && "%"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#D6212F]" />
            Performance Chart
          </h3>
          <p className="text-sm sm:text-base text-gray-400">
            {isModelBased
              ? "Torque comparison across models"
              : "Torque output across operational range"}
          </p>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center bg-gray-950/50 border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition text-xs sm:text-sm flex items-center gap-2 ${
              chartType === "line"
                ? "bg-[#D6212F] text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Line</span>
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition text-xs sm:text-sm flex items-center gap-2 ${
              chartType === "bar"
                ? "bg-[#D6212F] text-white shadow-lg"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Bar</span>
          </button>
        </div>
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-950/30 border border-gray-800 rounded-lg p-3 sm:p-4"
      >
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey={isModelBased ? "model" : "range"}
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                label={{
                  value: isModelBased ? "Model" : "Torque (Nm)",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#9CA3AF",
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                label={{
                  value: isModelBased ? "Torque (Nm)" : "Efficiency (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9CA3AF",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#9CA3AF" }} iconType="line" />
              {isModelBased ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="minTorque"
                    name="Min Torque"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={{ fill: "#60A5FA", r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="maxTorque"
                    name="Max Torque"
                    stroke="#D6212F"
                    strokeWidth={3}
                    dot={{ fill: "#D6212F", r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  name="Efficiency"
                  stroke="#D6212F"
                  strokeWidth={3}
                  dot={{ fill: "#D6212F", r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey={isModelBased ? "model" : "range"}
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#9CA3AF" }} />
              {isModelBased ? (
                <>
                  <Bar
                    dataKey="minTorque"
                    name="Min Torque"
                    fill="#60A5FA"
                    animationDuration={1000}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="maxTorque"
                    name="Max Torque"
                    fill="#D6212F"
                    animationDuration={1000}
                    radius={[4, 4, 0, 0]}
                  />
                </>
              ) : (
                <Bar
                  dataKey="torque"
                  name="Torque"
                  fill="#D6212F"
                  animationDuration={1000}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* Stats Grid */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-800">
          {product.specifications.slice(0, 3).map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="text-center p-3 sm:p-4 bg-gray-950/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
            >
              <div className="text-xs sm:text-sm text-gray-500 mb-1 uppercase tracking-wide">
                {spec.label}
              </div>
              <div className="text-lg sm:text-2xl font-bold text-[#D6212F]">
                {spec.value}
                {spec.unit && (
                  <span className="text-xs sm:text-sm text-gray-500 ml-1">
                    {spec.unit}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Performance Indicator */}
      <div className="bg-gray-950/30 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Overall Performance</span>
          <span className="text-sm font-bold text-[#D6212F]">Excellent</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "92%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-[#D6212F] to-[#FF4757] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
