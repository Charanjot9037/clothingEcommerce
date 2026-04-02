"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import StarRating from "../../components/products/StarRating";
import { useParams } from "next/navigation";

const COLORS = [
  { hex: "#4CAF50", label: "Green" },
  { hex: "#F44336", label: "Red" },
  { hex: "#FFC107", label: "Yellow" },
  { hex: "#FF9800", label: "Orange" },
  { hex: "#03A9F4", label: "Light Blue" },
  { hex: "#9C27B0", label: "Purple" },
  { hex: "#E91E63", label: "Pink" },
  { hex: "#1a3458", label: "Navy" },
  { hex: "#4a5c3d", label: "Olive" },
  { hex: "#111111", label: "Black" },
];

const SIZES = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];
const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];
const SORT_OPTIONS = ["Most Popular", "Newest", "Price: Low to High", "Price: High to Low"];
const ITEMS_PER_PAGE = 9;

// ── Skeleton Card ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-square rounded-2xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 rounded-full w-1/2" />
      <div className="h-4 bg-gray-200 rounded-full w-1/3" />
    </div>
  );
}

// ── Filter Sidebar Content ──────────────────────────────────
function FilterContent({ filters, setFilters, onApply }) {
  const [priceRange, setPriceRange] = useState(filters.maxPrice);

  const toggleColor = (hex) =>
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(hex) ? f.colors.filter((c) => c !== hex) : [...f.colors, hex],
    }));

  const toggleSize = (size) =>
    setFilters((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));

  const toggleStyle = (style) =>
    setFilters((f) => ({
      ...f,
      styles: f.styles.includes(style) ? f.styles.filter((s) => s !== style) : [...f.styles, style],
    }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button className="w-full flex justify-between items-center text-sm font-semibold mb-4">
          Price <span className="text-gray-400">▲</span>
        </button>
        <div className="px-1">
          <input
            type="range" min={0} max={500} value={priceRange}
            onChange={(e) => {
              setPriceRange(Number(e.target.value));
              setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }));
            }}
            className="w-full accent-black"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span><span>${priceRange}</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <button className="w-full flex justify-between items-center text-sm font-semibold mb-4">
          Colors <span className="text-gray-400">▲</span>
        </button>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(({ hex, label }) => (
            <button key={hex} title={label} onClick={() => toggleColor(hex)}
              style={{ backgroundColor: hex }}
              className={`w-8 h-8 rounded-full transition-all ${
                filters.colors.includes(hex)
                  ? "ring-2 ring-black ring-offset-2"
                  : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
              }`}
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <button className="w-full flex justify-between items-center text-sm font-semibold mb-4">
          Size <span className="text-gray-400">▲</span>
        </button>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button key={size} onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                filters.sizes.includes(size)
                  ? "bg-black text-white border-black"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <button className="w-full flex justify-between items-center text-sm font-semibold mb-4">
          Dress Style <span className="text-gray-400">▲</span>
        </button>
        <div className="flex flex-col gap-1">
          {DRESS_STYLES.map((style) => (
            <button key={style} onClick={() => toggleStyle(style)}
              className={`flex justify-between items-center w-full text-sm py-2 px-1 rounded-lg transition-colors ${
                filters.styles.includes(style) ? "text-black font-semibold" : "text-gray-500 hover:text-black"
              }`}
            >
              {style} <span className="text-gray-300">›</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <button onClick={onApply}
        className="w-full bg-black text-white rounded-full py-3 text-sm font-semibold hover:opacity-85 transition-opacity"
      >
        Apply Filter
      </button>
    </div>
  );
}

// ── Product Card ────────────────────────────────────────────
function ProductCard({ product }) {
  const { _id, title, price, oldPrice, discount, images, rating } = product;
  return (
    <Link href={`/product/${_id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images?.[0] || "/placeholder.png"} alt={title} fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-full">
            {discount}%
          </span>
        )}
      </div>
      <p className="font-semibold text-sm leading-snug group-hover:underline line-clamp-2">{title}</p>
      <StarRating rating={rating} size={14} />
      <div className="flex items-center gap-2">
        <span className="font-bold">${price.toFixed(2)}</span>
        {oldPrice && <span className="text-sm text-gray-400 line-through">${oldPrice.toFixed(2)}</span>}
      </div>
    </Link>
  );
}

// ── Main Search Page ────────────────────────────────────────
export default function SearchPage() {
  const { query } = useParams();
  const decoded = decodeURIComponent(query || "");

  const [filters, setFilters] = useState({ maxPrice: 500, colors: [], sizes: [], styles: [] });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [sort, setSort] = useState("Most Popular");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setPage(1);
    setMobileFiltersOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        search: decoded,
        page: page.toString(),
        limit: "50",
      });
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [decoded, page]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (p.price > appliedFilters.maxPrice) return false;
      if (appliedFilters.colors.length > 0 && !p.colors?.some(c => appliedFilters.colors.includes(c))) return false;
      if (appliedFilters.sizes.length > 0 && !p.sizes?.some(s => appliedFilters.sizes.includes(s))) return false;
      return true;
    }).sort((a, b) => {
      switch (sort) {
        case "Price: Low to High": return a.price - b.price;
        case "Price: High to Low": return b.price - a.price;
        case "Newest": return new Date(b.createdAt) - new Date(a.createdAt);
        default: return b.rating - a.rating;
      }
    });
  }, [products, appliedFilters, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="px-4 sm:px-8 lg:px-20 py-4 text-sm text-gray-400 flex gap-2 items-center flex-wrap">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>›</span>
        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
        <span>›</span>
        <span className="text-black">"{decoded}"</span>
      </nav>

      <div className="flex gap-8 px-4 sm:px-8 lg:px-20 pb-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="border border-gray-200 rounded-2xl p-5 sticky top-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-base">Filters</h2>
              <button className="text-gray-400 hover:text-black transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
            </div>
            <FilterContent filters={filters} setFilters={setFilters} onApply={applyFilters} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                Results for <span className="font-normal text-gray-500">"{decoded}"</span>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {loading ? (
                  <span className="inline-block h-3 w-40 bg-gray-200 rounded-full animate-pulse" />
                ) : (
                  `Showing ${filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} Products`
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                Filters
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="hidden sm:inline">Sort by:</span>
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none cursor-pointer bg-white font-medium text-black"
                >
                  {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Grid: Skeleton or Products ── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginated.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <p className="text-lg font-medium">No results for "{decoded}"</p>
              <p className="text-sm mt-1">Try a different search term or adjust filters</p>
              <button
                onClick={() => {
                  const reset = { maxPrice: 500, colors: [], sizes: [], styles: [] };
                  setFilters(reset);
                  setAppliedFilters(reset);
                }}
                className="mt-4 border border-gray-200 rounded-full px-6 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-10 border-t border-gray-100 pt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-1">
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                        page === p ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-white z-50 lg:hidden overflow-y-auto shadow-2xl">
            <div className="p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-base">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                  ✕
                </button>
              </div>
              <FilterContent filters={filters} setFilters={setFilters} onApply={applyFilters} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}