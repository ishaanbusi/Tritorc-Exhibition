import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/data/products";
import ProductPageClient from "@/components/ProductPageClient";

// Generate static params for all products
export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Metadata for SEO (UPDATED for Next.js 15+)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Await params
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | TRITON Interactive`,
    description: product.description,
  };
}

// Main component (UPDATED for Next.js 15+)
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Await params
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
