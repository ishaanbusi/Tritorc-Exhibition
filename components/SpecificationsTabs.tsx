"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { Ruler, Weight, Settings, Gauge } from "lucide-react";

interface SpecificationsTabsProps {
  product: Product;
}

export default function SpecificationsTabs({
  product,
}: SpecificationsTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "technical" | "dimensional" | "specs"
  >("technical");
  const [selectedModel, setSelectedModel] = useState(
    product.selectorData?.models?.[0] || null
  );
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  // Get technical data for selected model
  const technicalData =
    selectedModel && product.selectorData?.technicalData?.[selectedModel];
  const dimensionalData =
    selectedModel && product.selectorData?.dimensionalData?.[selectedModel];

  // Fallback to basic specifications if selectorData doesn't exist
  const hasVariantData =
    product.selectorData?.models && product.selectorData.models.length > 0;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-800 mb-4 sm:mb-6 overflow-x-auto pb-2">
        {hasVariantData ? (
          <>
            <button
              onClick={() => setActiveTab("technical")}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors relative whitespace-nowrap text-sm sm:text-base ${
                activeTab === "technical"
                  ? "text-[#D6212F]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Technical Data
              </span>
              {activeTab === "technical" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6212F]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("dimensional")}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors relative whitespace-nowrap text-sm sm:text-base ${
                activeTab === "dimensional"
                  ? "text-[#D6212F]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Dimensions
              </span>
              {activeTab === "dimensional" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6212F]"
                />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors relative whitespace-nowrap text-sm sm:text-base ${
              activeTab === "specs"
                ? "text-[#D6212F]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Specifications
            </span>
            {activeTab === "specs" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6212F]"
              />
            )}
          </button>
        )}
      </div>

      {/* Model Selector & Unit Toggle */}
      {hasVariantData && (
        <div className="space-y-4 mb-6">
          {/* Model Selector */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block font-medium">
              Select Model
            </label>
            <div className="flex flex-wrap gap-2">
              {product.selectorData?.models?.map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                    selectedModel === model
                      ? "bg-[#D6212F] text-white shadow-lg shadow-[#D6212F]/20"
                      : "bg-gray-950/50 text-gray-300 hover:bg-gray-800 border border-gray-800"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between bg-gray-950/50 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setUnit("metric")}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition text-sm ${
                unit === "metric"
                  ? "bg-[#D6212F] text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Metric
            </button>
            <button
              onClick={() => setUnit("imperial")}
              className={`flex-1 px-4 py-2 rounded-md font-semibold transition text-sm ${
                unit === "imperial"
                  ? "bg-[#D6212F] text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Imperial
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <motion.div
        key={activeTab + selectedModel}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {hasVariantData ? (
          <>
            {activeTab === "technical" && technicalData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(technicalData).map(
                  ([key, value]: [string, any], index) => {
                    const displayValue =
                      typeof value === "object" ? value[unit] : value;
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-950/50 border border-gray-800 p-4 rounded-lg hover:border-gray-700 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          {key.toLowerCase().includes("weight") && (
                            <div className="w-8 h-8 bg-[#D6212F]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#D6212F]/20 transition-colors">
                              <Weight className="w-4 h-4 text-[#D6212F]" />
                            </div>
                          )}
                          {key.toLowerCase().includes("torque") && (
                            <div className="w-8 h-8 bg-[#D6212F]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#D6212F]/20 transition-colors">
                              <Gauge className="w-4 h-4 text-[#D6212F]" />
                            </div>
                          )}
                          {!key.toLowerCase().includes("weight") &&
                            !key.toLowerCase().includes("torque") && (
                              <div className="w-8 h-8 bg-[#D6212F]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#D6212F]/20 transition-colors">
                                <Settings className="w-4 h-4 text-[#D6212F]" />
                              </div>
                            )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm text-gray-500 mb-1 uppercase tracking-wide">
                              {label}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-white truncate">
                              {displayValue}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            )}

            {activeTab === "dimensional" && dimensionalData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(dimensionalData).map(
                  ([key, value]: [string, any], index) => {
                    const displayValue =
                      typeof value === "object" ? value[unit] : value;
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-950/50 border border-gray-800 p-4 rounded-lg hover:border-gray-700 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#D6212F]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#D6212F]/20 transition-colors">
                            <Ruler className="w-4 h-4 text-[#D6212F]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm text-gray-500 mb-1 uppercase tracking-wide">
                              {label}
                            </div>
                            <div className="text-base sm:text-lg font-bold text-white truncate">
                              {displayValue}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            )}
          </>
        ) : (
          // Fallback to basic specifications
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {product.specifications?.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-950/50 border border-gray-800 p-4 rounded-lg hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#D6212F]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#D6212F]/20 transition-colors">
                    <Settings className="w-4 h-4 text-[#D6212F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 uppercase tracking-wide">
                      {spec.label}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white">
                      {spec.value}
                      {spec.unit && ` ${spec.unit}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Technical Drawing Link (if available) */}
      {hasVariantData && product.selectorData?.generalTechnicalDrawing && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <a
            href={product.selectorData?.generalTechnicalDrawing}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-950/50 hover:bg-gray-800 border border-gray-800 hover:border-[#D6212F] text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all group"
          >
            <Ruler className="w-5 h-5 text-[#D6212F]" />
            View Technical Drawing
            <svg
              className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
