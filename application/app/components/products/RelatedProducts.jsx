// components/product/RelatedProducts.jsx
import Link from "next/link";
import Image from "next/image";
import StarRating from "../../components/products/StarRating";

export default function RelatedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="px-4 sm:px-8 lg:px-20 pb-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-center uppercase tracking-tight mb-8">
        You Might Also Like
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, index) => {
          // Use product._id if exists, fallback to index
          const key = product._id || product.id || index;
          const href = `/product/${product._id || product.id || index}`;
          const imageSrc = product.image || "/main/card-1.png"; // fallback image

          return (
            <Link
              key={key}
              href={href}
              className="group flex flex-col gap-3"
            >
              {/* Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={imageSrc}
                  alt={product.title || "Related Product"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount && (
                  <span className="absolute top-3 right-3 bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {product.discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <p className="font-semibold text-sm leading-snug group-hover:underline">
                {product.title}
              </p>

              <StarRating rating={product.rating || 0} size={14} />

              <div className="flex items-center gap-2">
                <span className="font-bold">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.oldPrice}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}