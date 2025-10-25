"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";

interface SpecificationsTabsProps {
  product: Product;
}

export default function SpecificationsTabs({
  product,
}: SpecificationsTabsProps) {
  const [activeTab, setActiveTab] = useState<"specs" | "variants">("specs");
  const [selectedVariant, setSelectedVariant] = useState(product.variants);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Tab Headers */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("specs")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === "specs"
              ? "text-primary"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Specifications
          {activeTab === "specs" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("variants")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === "variants"
              ? "text-primary"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Variants
          {activeTab === "variants" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "specs" ? (
          <div className="grid grid-cols-2 gap-6">
            {product.specifications.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg"
              >
                <div className="text-sm text-gray-600 mb-1">{spec.label}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {spec.value}{" "}
                  {spec.unit && (
                    <span className="text-lg text-gray-600">{spec.unit}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Variant Selector */}
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    selectedVariant.id === variant.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>

            {/* Variant Specs */}
            <motion.div
              key={selectedVariant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {selectedVariant.specs.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <div className="text-sm text-gray-600">{spec.label}</div>
                    <div className="font-bold">
                      {spec.value} {spec.unit}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
