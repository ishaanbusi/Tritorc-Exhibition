"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProductById } from "@/data/products";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",") || [];
  const products = ids
    .map((id) => getProductById(id))
    .filter(
      (p): p is NonNullable<ReturnType<typeof getProductById>> => p != null
    );

  if (products.length < 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid Comparison</h1>
          <p className="text-gray-600">
            Please select at least 2 products to compare.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Product Comparison
        </h1>

        {/* Product Headers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <Image
                src={
                  Array.isArray(product.images)
                    ? product.images[0]
                    : product.images
                }
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-xl mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
            </motion.div>
          ))}
        </div>

        {/* Specifications Comparison */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Specification</th>
                {products.map((product) => (
                  <th
                    key={product.id}
                    className="px-6 py-4 text-center font-bold"
                  >
                    {product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Get all unique spec labels */}
              {Array.from(
                new Set(
                  products.flatMap(
                    (p) => p.specifications?.map((s) => s.label) || []
                  )
                )
              ).map((label, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {label}
                  </td>
                  {products.map((product) => {
                    const spec = product.specifications?.find(
                      (s) => s.label === label
                    );
                    return (
                      <td key={product.id} className="px-6 py-4 text-center">
                        {spec ? (
                          <span className="font-semibold">
                            {spec.value} {spec.unit || ""}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Features Comparison */}
        {products.some((p) => p.features && p.features.length > 0) && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id}>
                  <h4 className="font-semibold mb-4">{product.name}</h4>
                  <ul className="space-y-2">
                    {(product.features || []).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comparison...</p>
          </div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
