"use client";

import PageEntryAnimation from "@/components/PageEntryAnimation";
import AmbientBackground from "@/components/AmbientBackground";
import ImageGallery from "@/components/ImageGallery";
import ThreeDViewer from "@/components/ThreeDViewer";
import ARViewer from "@/components/ARViewer";
import VideoSection from "@/components/VideoSection";
import SpecificationsTabs from "@/components/SpecificationsTabs";
import TorqueChart from "@/components/TorqueChart";
import ComparisonSelect from "@/components/ComparisonSelect";
import AskAIChat from "@/components/AskAIChat";
import ExplodedView from "@/components/ExplodedView";
import { useProductView } from "@/components/MemoryManager";
import { FileText, Package } from "lucide-react";

interface ProductPageClientProps {
  product: any;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  useProductView(product);

  return (
    <PageEntryAnimation productName={product.name}>
      <AmbientBackground />

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-12 lg:space-y-16">
          {/* Hero Section */}
          <section className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12 lg:items-start">
            {/* Image Gallery - Full width on mobile */}
            <div className="w-full lg:sticky lg:top-6">
              <ImageGallery
                images={product.images}
                productName={product.name}
                enable360={true}
                rotation360Images={product.images360}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6 flex flex-col">
              {/* Product Name */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quick Specs - Move to top on desktop for better hierarchy */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="order-last lg:order-none bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-6 space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#D6212F]" />
                    Key Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.specifications
                      .slice(0, 4)
                      .map((spec: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gray-950/50 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors"
                        >
                          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                            {spec.label}
                          </p>
                          <p className="text-sm sm:text-base font-bold text-white truncate">
                            {spec.value}
                            {spec.unit && ` ${spec.unit}`}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Action Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="w-full sm:flex-1 px-6 py-3 sm:py-3.5 bg-gradient-to-r from-[#D6212F] to-[#B51D27] text-white rounded-xl font-semibold hover:from-[#B51D27] hover:to-[#A01A24] transition-all shadow-lg shadow-[#D6212F]/20 hover:shadow-[#D6212F]/30 flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Request Quote
                </button>
                <div className="w-full sm:flex-1">
                  <ComparisonSelect currentProduct={product} />
                </div>
              </div>

              {/* AR Viewer */}
              <div>
                <ARViewer
                  modelPath={product.model3D}
                  modelPathIOS={product.modelAR}
                  productName={product.name}
                />
              </div>

              {/* Additional Info - Optional */}
              <div className="flex flex-wrap gap-2 pt-2">
                {product.features &&
                  product.features
                    .slice(0, 3)
                    .map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-full text-xs sm:text-sm text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 bg-[#D6212F] rounded-full"></span>
                        {feature}
                      </span>
                    ))}
              </div>
            </div>
          </section>

          {/* 3D Viewer Section */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              3D Interactive Model
            </h2>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              <ThreeDViewer
                modelPath={product.model3D}
                productName={product.name}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Drag to rotate • Pinch to zoom • Two fingers to pan
            </p>
          </section>

          {/* Videos Section */}
          {product.videos && product.videos.length > 0 && (
            <VideoSection videos={product.videos} productName={product.name} />
          )}

          {/* Specifications Tabs */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Full Specifications
            </h2>
            <SpecificationsTabs product={product} />
          </section>

          {/* Torque Chart */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Performance Data
            </h2>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-6 overflow-x-auto">
              <TorqueChart product={product} />
            </div>
          </section>

          {/* Exploded View */}
          {product.components && product.components.length > 0 && (
            <section className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Component Breakdown
              </h2>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                <ExplodedView
                  modelPath={product.model3D}
                  parts={product.components}
                />
              </div>
            </section>
          )}

          {/* Bottom Spacing for Floating Chat */}
          <div className="h-20 sm:h-16" />
        </div>

        {/* Floating AI Chat - Mobile Optimized */}
        <AskAIChat product={product} />
      </div>
    </PageEntryAnimation>
  );
}
