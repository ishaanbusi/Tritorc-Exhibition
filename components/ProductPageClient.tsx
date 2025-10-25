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

interface ProductPageClientProps {
  product: any;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  useProductView(product);

  return (
    <PageEntryAnimation productName={product.name}>
      <AmbientBackground />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8">
          <ImageGallery
            images={product.images}
            productName={product.name}
            enable360={true}
            rotation360Images={product.images360}
          />
          <div>
            <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Request Quote
              </button>
              <ComparisonSelect currentProduct={product} />
            </div>

            <ARViewer
              modelPath={product.model3D}
              modelPathIOS={product.modelAR}
              productName={product.name}
            />
          </div>
        </section>

        {/* 3D Viewer */}
        <section>
          <h2 className="text-3xl font-bold mb-6">3D Interactive Model</h2>
          <ThreeDViewer
            modelPath={product.model3D}
            productName={product.name}
          />
        </section>

        {/* Videos */}
        {product.videos && (
          <VideoSection videos={product.videos} productName={product.name} />
        )}

        {/* Specifications */}
        <SpecificationsTabs product={product} />

        {/* Charts */}
        <TorqueChart product={product} />

        {/* Exploded View */}
        {product.components && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Component Breakdown</h2>
            <ExplodedView
              modelPath={product.model3D}
              parts={product.components}
            />
          </section>
        )}
      </div>

      {/* Floating Features */}
      <AskAIChat product={product} />
    </PageEntryAnimation>
  );
}
