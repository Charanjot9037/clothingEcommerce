export const NEW_ARRIVALS = [
  {
    id: "p1",
    image: "/main/card-1.png",
    title: "T-shirt with Tape Details",
    price: 120,
    rating: 4.5,
    colors: ["#4a5c3d", "#2d3a2d", "#1a3458"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    category: "new-arrivals",
  },
  {
    id: "p2",
    image: "/main/card-2.png",
    title: "Skinny Fit Jeans",
    price: 240,
    oldPrice: 260,
    rating: 3.5,
    discount: "-20%",
    colors: ["#1a1a2e", "#2d3a2d", "#8B4513"],
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "Slim and sleek, these skinny fit jeans hug your silhouette perfectly. Made from premium stretch denim for all-day comfort.",
    category: "new-arrivals",
  },
  {
    id: "p3",
    image: "/main/card-3.png",
    title: "Checkered Shirt",
    price: 180,
    rating: 4.5,
    colors: ["#8B0000", "#1a3458", "#2d2d2d"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "A classic checkered pattern shirt that transitions effortlessly from casual to smart-casual. 100% cotton weave.",
    category: "new-arrivals",
  },
  {
    id: "p4",
    image: "/main/card-4.png",
    title: "Sleeve Striped T-shirt",
    price: 130,
    oldPrice: 160,
    rating: 4.5,
    discount: "-30%",
    colors: ["#ffffff", "#111111", "#1a3458"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "Sporty striped sleeves meet a clean body for a modern athletic look. Lightweight and breathable.",
    category: "new-arrivals",
  },
];

export const TOP_SELLING = [
  {
    id: "p5",
    image: "/main/card-5.png",
    title: "Casual Printed T-shirt",
    price: 150,
    rating: 4.2,
    colors: ["#f5f0e8", "#4a5c3d", "#1a1a2e"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "Effortlessly cool with an artistic print, this casual tee pairs well with anything. Garment-washed for a lived-in softness.",
    category: "top-selling",
  },
  {
    id: "p6",
    image: "/main/card-6.png",
    title: "Denim Jacket",
    price: 320,
    oldPrice: 400,
    rating: 4.7,
    discount: "-20%",
    colors: ["#1a3458", "#2d2d2d", "#8B4513"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "A wardrobe staple. This denim jacket features a classic silhouette with subtle distressing and a comfortable relaxed fit.",
    category: "top-selling",
  },
  {
    id: "p7",
    image: "/main/card-7.png",
    title: "Formal White Shirt",
    price: 210,
    rating: 4.4,
    colors: ["#ffffff", "#f5f0e8", "#e8e4d9"],
    sizes: ["Small", "Medium", "Large", "X-Large", "XXL"],
    description:
      "Crisp, clean, and polished. This formal white shirt is tailored for a sharp silhouette with premium cotton poplin fabric.",
    category: "top-selling",
  },
  {
    id: "p8",
    image: "/main/card-8.png",
    title: "Black Hoodie",
    price: 280,
    oldPrice: 350,
    rating: 4.6,
    discount: "-25%",
    colors: ["#111111", "#2d2d2d", "#4a5c3d"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "Ultimate comfort meets street style. Our Black Hoodie is made from heavyweight fleece with a relaxed oversized fit.",
    category: "top-selling",
  },
  {
    id: "p9",
    image: "/main/card-5.png",
    title: "Slim Fit Trousers",
    price: 260,
    rating: 4.3,
    colors: ["#2d2d2d", "#1a3458", "#8B4513"],
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "Tailored slim-fit trousers that work as hard as you do. Clean lines and a modern cut for a polished everyday look.",
    category: "top-selling",
  },
  {
    id: "p10",
    image: "/main/card-6.png",
    title: "Oversized Sweatshirt",
    price: 300,
    oldPrice: 380,
    rating: 4.8,
    discount: "-21%",
    colors: ["#f5f0e8", "#4a5c3d", "#111111"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "Drop shoulders, thick fleece, and a boxy silhouette — this oversized sweatshirt is the definition of cozy-chic.",
    category: "top-selling",
  },
  {
    id: "p11",
    image: "/main/card-7.png",
    title: "Cotton Polo T-shirt",
    price: 190,
    rating: 4.1,
    colors: ["#ffffff", "#1a3458", "#4a5c3d"],
    sizes: ["Small", "Medium", "Large", "X-Large"],
    description:
      "A refined everyday essential. This cotton polo features a classic collar and clean lines for a smart-casual look.",
    category: "top-selling",
  },
  {
    id: "p12",
    image: "/main/card-8.png",
    title: "Classic Blue Jeans",
    price: 270,
    oldPrice: 330,
    rating: 4.5,
    discount: "-18%",
    colors: ["#1a3458", "#2d3a2d", "#111111"],
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "The perfect pair of blue jeans. Straight cut, medium wash, and built to last — a timeless wardrobe cornerstone.",
    category: "top-selling",
  },
];

export const ALL_PRODUCTS = [...NEW_ARRIVALS, ...TOP_SELLING];

/**
 * Find a product by ID across all collections.
 */
export function getProductById(id) {
  return ALL_PRODUCTS.find((p) => p.id === id) ?? null;
}

/**
 * Get related products (same category, excluding current).
 */
export function getRelatedProducts(product, limit = 4) {
  return ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, limit);
}
