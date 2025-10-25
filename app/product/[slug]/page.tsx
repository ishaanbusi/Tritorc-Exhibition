import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import ProductPageClient from "@/components/ProductPageClient";
import type { Metadata } from "next";

// Force dynamic rendering - CRITICAL: prevents build-time prerendering
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

// Type for page props in Next.js 15+
type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
      return {
        title: "Product Not Found | TRITON Interactive",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: `${product.name} | TRITON Interactive`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.[0] ? [product.images[0]] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | TRITON Interactive",
      description: "TRITON Interactive product page",
    };
  }
}

// Duplicate generateMetadata removed (first implementation above is used).

// Main page component
export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  try {
    const { slug } = await params;
    product = getProductBySlug(slug);

    if (!product) {
      notFound();
    }
  } catch (error) {
    console.error("Error rendering product page:", error);
    notFound();
  }

  return <ProductPageClient product={product} />;
}
