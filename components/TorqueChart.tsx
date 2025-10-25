"use client";

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

interface TorqueChartProps {
  product: Product;
}

export default function TorqueChart({ product }: TorqueChartProps) {
  // Generate chart data from product specs
  const generateTorqueData = () => {
    const minTorque = product.specifications?.find((s) =>
      s.label.includes("Min Torque")
    );
    const maxTorque = product.specifications?.find((s) =>
      s.label.includes("Max Torque")
    );

    if (!minTorque || !maxTorque) return [];

    const min = parseFloat(minTorque.value);
    const max = parseFloat(maxTorque.value);
    const step = (max - min) / 10;

    return Array.from({ length: 11 }, (_, i) => ({
      range: `${Math.round(min + step * i)}`,
      torque: min + step * i,
      efficiency: 85 + Math.random() * 15, // Simulated efficiency
    }));
  };

  const data = generateTorqueData();

  // Don't render if no data
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Performance Chart</h3>
        <p className="text-gray-600">Torque output across operational range</p>
      </div>

      {/* Torque Range Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="range"
              label={{
                value: "Torque (Nm)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Efficiency (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#D6312F"
              strokeWidth={3}
              dot={{ fill: "#D6312F", r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Variant Comparison */}
      {product.variants && product.variants.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="font-bold mb-4">Variant Comparison</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={product.variants.map((v) => {
                // Find the first spec with a numeric value
                const firstSpec = v.specs?.find(
                  (s) => !isNaN(parseFloat(s.value))
                );
                return {
                  name: v.name,
                  value: firstSpec ? parseFloat(firstSpec.value) : 0,
                };
              })}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#D6312F" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Stats Grid */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {product.specifications.slice(0, 3).map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
            >
              <div className="text-sm text-gray-600 mb-1">{spec.label}</div>
              <div className="text-2xl font-bold text-red-600">
                {spec.value}
                <span className="text-sm text-gray-600 ml-1">{spec.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
