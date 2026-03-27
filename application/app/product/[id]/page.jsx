// app/product/[id]/page.jsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getRelatedProducts } from "../../../lib/products";
import ProductImages from "../../components/products/ProductImages";
import ProductInfo from "../../components/products/ProductInfo";
import ReviewsSection from "../../components/products/ReviewsSection";
import RelatedProducts from "../../components/products/RelatedProducts";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} – SHOP.CO`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const related = getRelatedProducts(product, 4);

  return (
    <main>
      {/* Breadcrumb */}
      <nav className="px-4 sm:px-8 lg:px-20 py-4 text-sm text-gray-400 flex gap-2 items-center flex-wrap">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>›</span>
        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
        <span>›</span>
        <Link href="/shop/men" className="hover:text-black transition-colors">Men's</Link>
        <span>›</span>
        <span className="text-black">{product.title}</span>
      </nav>

      {/* Product Main Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 px-4 sm:px-8 lg:px-20 pb-16">
        <ProductImages image={product.image} title={product.title} />
        <ProductInfo product={product} />
      </section>

      {/* Reviews & Tabs */}
      <ReviewsSection />

      {/* Related Products */}
      {related.length > 0 && (
        <>
          <hr className="border-gray-100 mx-4 sm:mx-8 lg:mx-20" />
          <div className="py-12">
            <RelatedProducts products={related} />
          </div>
        </>
      )}
    </main>
  );
}