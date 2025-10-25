"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, ArrowRight, Check } from "lucide-react";
import { Product, getAllProducts } from "@/data/products";
import Image from "next/image";
import Link from "next/link";

interface ComparisonSelectProps {
  currentProduct: Product;
}

export default function ComparisonSelect({
  currentProduct,
}: ComparisonSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    currentProduct,
  ]);
  const allProducts = getAllProducts();

  const toggleProduct = (product: Product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition"
      >
        <GitCompare className="w-5 h-5" />
        Compare Products
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Compare Products
                    </h2>
                    <p className="text-gray-600">
                      Select up to 3 products to compare
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/50 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Selected Products */}
                <div className="flex gap-4">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm border-2 border-blue-500"
                    >
                      <Image
                        src={product.images[0] ?? ""}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {product.name}
                        </div>
                      </div>
                      {product.id !== currentProduct.id && (
                        <button
                          onClick={() => toggleProduct(product)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {selectedProducts.length < 3 && (
                    <div className="bg-gray-100 rounded-lg p-3 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 w-40">
                      + Add Product
                    </div>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-4">
                  {allProducts
                    .filter(
                      (p) => !selectedProducts.find((sp) => sp.id === p.id)
                    )
                    .map((product) => (
                      <motion.button
                        key={product.id}
                        onClick={() => toggleProduct(product)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-4 transition text-left"
                      >
                        <Image
                          src={product.images[0] ?? ""}
                          alt={product.name}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h4 className="font-semibold text-sm mb-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </motion.button>
                    ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {selectedProducts.length} of 3 products selected
                </p>
                <Link
                  href={`/compare?ids=${selectedProducts
                    .map((p) => p.id)
                    .join(",")}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  Compare Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
