// app/product/[id]/page.jsx
"use client"; // ← make it a client component

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductImages from "../../components/products/ProductImages";
import ProductInfo from "../../components/products/ProductInfo";
import ReviewsSection from "../../components/products/ReviewsSection";
import RelatedProducts from "../../components/products/RelatedProducts";
// import { toast } from "../../utils/toast"; // assuming you have a toast helper

export default function ProductPage() {
  const params = useParams();
  const { id } = params;
const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch the single product
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setProduct(data.product);

      // Fetch all products to determine related products
      const resAll = await fetch(`/api/products`);
      const allData = await resAll.json();
      if (!allData.success) throw new Error(allData.message);

      const relatedProducts = (allData.products ?? [])
        .filter(p => p.category === data.product.category && p._id !== data.product._id)
        .slice(0, 4);

      setRelated(relatedProducts);
    } catch (e) {
      console.error(e);
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id, loadProduct]);

if (loading || !product) {
  return (
    <main className="px-4 sm:px-8 lg:px-20 py-10 animate-pulse">
      
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-6"></div>

      {/* Product Section Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Image Skeleton */}
        <div className="bg-gray-200 rounded-2xl min-h-[300px] sm:min-h-[380px] lg:min-h-[420px]" />

        {/* Info Skeleton */}
        <div className="flex flex-col gap-5">
          <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
          <div className="h-6 bg-gray-200 w-1/3 rounded"></div>

          <div className="space-y-2">
            <div className="h-3 bg-gray-200 w-full rounded"></div>
            <div className="h-3 bg-gray-200 w-5/6 rounded"></div>
            <div className="h-3 bg-gray-200 w-4/6 rounded"></div>
          </div>

          <div className="h-10 bg-gray-200 w-1/2 rounded"></div>
          <div className="h-10 bg-gray-200 w-full rounded-full"></div>
        </div>

      </section>
    </main>
  );
}

  return (
    <main>
      {/* Breadcrumb */}
      <nav className="px-4 sm:px-8 lg:px-20 py-4 text-sm text-gray-400 flex gap-2 items-center flex-wrap">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>›</span>
        <Link href="/shop" className="hover:text-black">Shop</Link>
        <span>›</span>
        <Link href={`/shop/${product.category}`} className="hover:text-black">{product.category}</Link>
        <span>›</span>
        <span className="text-black">{product.title}</span>
      </nav>

      {/* Product Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 px-4 sm:px-8 lg:px-20 pb-16">
        <ProductImages image={product.images} title={product.title}  active={activeImage}
  setActive={setActiveImage} />
        <ProductInfo product={product} activeImage={activeImage} setActiveImage={setActiveImage} />
      </section>

      {/* Reviews */}
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