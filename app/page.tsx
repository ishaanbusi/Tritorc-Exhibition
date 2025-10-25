"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  QrCode,
  ArrowRight,
  Zap,
  Shield,
  Award,
  Clock,
} from "lucide-react";
import { getAllProducts, Product } from "@/data/products";
import AmbientBackground from "@/components/AmbientBackground";
import MemoryManager from "@/components/MemoryManager";
import SoundManager from "@/components/SoundManager";
import OfflineIndicator from "@/components/OfflineIndicator";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const allProducts = getAllProducts();
  const categories = [
    "All",
    ...Array.from(new Set(allProducts.map((p) => p.category))),
  ];

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <AmbientBackground theme="hydraulic" />
      <SoundManager enabled={true} />
      <OfflineIndicator />
      <MemoryManager />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-red-50 to-orange-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Logo/Brand */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
                  TRITON<span className="text-primary">K</span>
                </h1>
                <p className="text-xl text-gray-600 font-semibold">
                  Interactive Product Experience
                </p>
              </motion.div>

              {/* QR Code Scanner CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-xl mb-12"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <QrCode className="w-12 h-12 text-primary" />
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Scan to Explore
                    </h2>
                    <p className="text-gray-600">
                      Point your camera at any product QR code
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Experience 3D models, AR views, and interactive specifications
                </p>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Interactive 3D</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">AR View</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">AI Assistant</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">Offline Ready</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        </section>

        {/* Search & Filter Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, model, or specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-lg border-2 border-transparent focus:border-primary focus:outline-none transition text-lg"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-gray-600 mb-6">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </motion.div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Need Help Choosing the Right Tool?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our team of experts is ready to assist you with product
                selection, technical specifications, and custom solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/quote"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition inline-flex items-center justify-center gap-2"
                >
                  Request a Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="mailto:sales@triton.com"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition border-2 border-white/30"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

// Product Card Component
function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl">
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* QR Badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
              <QrCode className="w-5 h-5 text-primary" />
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
              {product.category}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <span className="text-white font-bold text-lg flex items-center gap-2">
                View Details
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {product.specifications.slice(0, 2).map((spec, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {spec.value} {spec.unit}
                  </p>
                </div>
              ))}
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 2).map((feature, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  +{product.features.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
