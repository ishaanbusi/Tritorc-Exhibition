"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define Product type (you can also import from @/data/products)
interface Product {
  id: string;
  slug: string;
  name: string;
  images: string[];
  category?: string;
}

interface ViewedProduct {
  product: Product;
  timestamp: number;
  viewCount: number;
}

// Create context
const MemoryContext = createContext<{
  viewedProducts: ViewedProduct[];
  addView: (product: Product) => void;
} | null>(null);

// MemoryProvider Component - wraps the app
export function MemoryProvider({ children }: { children: React.ReactNode }) {
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("viewedProducts");
    if (stored) {
      try {
        setViewedProducts(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse viewed products:", error);
      }
    }
  }, []);

  // Add a product view
  const addView = (product: Product) => {
    setViewedProducts((prev) => {
      const existing = prev.find((v) => v.product.id === product.id);

      let updated;
      if (existing) {
        // Update existing entry
        updated = prev.map((v) =>
          v.product.id === product.id
            ? { ...v, timestamp: Date.now(), viewCount: v.viewCount + 1 }
            : v
        );
      } else {
        // Add new entry
        updated = [
          {
            product,
            timestamp: Date.now(),
            viewCount: 1,
          },
          ...prev,
        ];
      }

      // Keep only last 10 products
      const trimmed = updated.slice(0, 10);

      // Save to localStorage
      localStorage.setItem("viewedProducts", JSON.stringify(trimmed));

      return trimmed;
    });
  };

  return (
    <MemoryContext.Provider value={{ viewedProducts, addView }}>
      {children}
    </MemoryContext.Provider>
  );
}

// Hook to use memory context
export function useMemory() {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemory must be used within MemoryProvider");
  }
  return context;
}

// Hook to track product views (use this in product pages)
export function useProductView(product: Product) {
  const { addView } = useMemory();

  useEffect(() => {
    addView(product);
  }, [product.id]); // Only re-run if product ID changes
}

// MemoryManager UI Component - floating button with history
export default function MemoryManager() {
  const { viewedProducts } = useMemory();
  const [isExpanded, setIsExpanded] = useState(false);

  const clearHistory = () => {
    localStorage.removeItem("viewedProducts");
    window.location.reload(); // Reload to clear state
  };

  // Don't show if no history
  if (viewedProducts.length === 0) return null;

  return (
    <div className="fixed left-6 bottom-6 z-40">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white shadow-2xl rounded-full p-4 flex items-center gap-2 hover:bg-gray-50 transition"
      >
        <Clock className="w-6 h-6 text-gray-700" />
        {!isExpanded && (
          <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {viewedProducts.length}
          </span>
        )}
      </motion.button>

      {/* History Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-2xl w-80 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Recently Viewed</h3>
                <p className="text-sm text-gray-600">
                  {viewedProducts.length} products
                </p>
              </div>
              <button
                onClick={clearHistory}
                className="p-2 hover:bg-white/50 rounded-lg transition"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            {/* Product List */}
            <div className="overflow-y-auto max-h-80 p-4 space-y-3">
              {viewedProducts.map((viewed, index) => (
                <motion.div
                  key={viewed.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/product/${viewed.product.slug}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setIsExpanded(false)}
                  >
                    <Image
                      src={viewed.product.images[0]}
                      alt={viewed.product.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {viewed.product.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Viewed {viewed.viewCount} time
                        {viewed.viewCount > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(viewed.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for sound effects (used in other components)
export function useProductSounds() {
  const playSuccess = () => {
    // You can integrate use-sound here if installed
    console.log("Success sound");
  };

  const playError = () => {
    console.log("Error sound");
  };

  const playHydraulic = () => {
    console.log("Hydraulic sound");
  };

  const hapticFeedback = (pattern: number | number[] = 10) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    playSuccess,
    playError,
    playHydraulic,
    hapticFeedback,
  };
}
