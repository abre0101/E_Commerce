// Yada Hair — mock data

export const products = [
  {
    id: "1",
    name: "Raw Cambodian Body Wave",
    category: "Bundles",
    price: 4500,
    originalPrice: 5200,
    images: [
      "/asset/raw cambodian.avif",
    ],
    description:
      "100% raw Cambodian hair. Soft, full body wave with zero shedding. Can be dyed, bleached, and restyled multiple times. Lasts 2–3 years with proper care.",
    lengths: ["12\"", "14\"", "16\"", "18\"", "20\"", "22\""],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 48,
  },
  {
    id: "2",
    name: "Straight Lace Front Wig",
    category: "Wigs",
    price: 8900,
    originalPrice: null,
    images: [
      "/asset/stragt.jfif",
    ],
    description:
      "13×4 HD lace front wig. Pre-plucked hairline with baby hairs. Glueless design for easy wear. Available in natural black and #1B.",
    lengths: ["14\"", "16\"", "18\"", "20\"", "24\""],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviewCount: 62,
  },
  {
    id: "3",
    name: "Deep Wave Closure",
    category: "Closures",
    price: 2800,
    originalPrice: 3100,
    images: [
      "/asset/deep hair closure.jfif",
    ],
    description:
      "4×4 HD lace closure, deep wave pattern. Matches seamlessly with our bundle sets. Pre-bleached knots for a natural look.",
    lengths: ["10\"", "12\"", "14\"", "16\""],
    inStock: true,
    featured: false,
    rating: 4.8,
    reviewCount: 31,
  },
  {
    id: "4",
    name: "Kinky Curly Bundle Set (3pcs)",
    category: "Bundles",
    price: 12500,
    originalPrice: 14000,
    images: [
      "/asset/kinky curly.jfif",
    ],
    description:
      "3-bundle deal of premium kinky curly hair. Zero shedding, tangle-free. Perfect for a full voluminous look.",
    lengths: ["16\"+18\"+20\"", "18\"+20\"+22\""],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewCount: 39,
  },
  {
    id: "5",
    name: "Loose Wave Full Lace Wig",
    category: "Wigs",
    price: 11200,
    originalPrice: null,
    images: [
      "/asset/loose deep.jfif",
    ],
    description:
      "Full lace wig with loose wave texture. 180% density. Can be parted anywhere. Comfortable cap with adjustable straps.",
    lengths: ["16\"", "18\"", "20\"", "22\"", "26\""],
    inStock: true,
    featured: false,
    rating: 4.9,
    reviewCount: 27,
  },
  {
    id: "6",
    name: "Brazilian Straight Bundles",
    category: "Bundles",
    price: 3800,
    originalPrice: 4200,
    images: [
      "/asset/straighthumanhair3bundleswithclosure.jpg",
    ],
    description:
      "Premium Brazilian straight hair. Silky smooth, naturally lustrous. Blends perfectly with all hair types.",
    lengths: ["10\"", "12\"", "14\"", "16\"", "18\"", "20\""],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviewCount: 55,
  },
  {
    id: "7",
    name: "HD Lace Closure Wig — Water Wave",
    category: "Wigs",
    price: 9800,
    originalPrice: 11500,
    images: [
      "/asset/lace closure wig.png",
    ],
    description:
      "5×5 HD lace closure wig with a natural water wave pattern. Pre-plucked, bleached knots, and glueless fit for everyday wear.",
    lengths: ["16\"", "18\"", "20\"", "22\""],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 44,
  },
  {
    id: "8",
    name: "Yaki Straight Bundle Deal",
    category: "Bundles",
    price: 5200,
    originalPrice: null,
    images: [
      "/asset/yaki straight.jfif",
    ],
    description:
      "Natural yaki straight texture that mimics relaxed hair. Ideal for blending with natural or relaxed hairlines. Minimum shedding, long-lasting.",
    lengths: ["12\"", "14\"", "16\"", "18\"", "20\""],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 33,
  },
  {
    id: "9",
    name: "Frontal Wig — Silky Straight",
    category: "Wigs",
    price: 13500,
    originalPrice: 15000,
    images: [
      "/asset/frontal wig.avif",
    ],
    description:
      "13×6 HD lace frontal wig. Super silky straight, 200% density. Natural hairline illusion with invisible knots. Ready to wear straight out of the box.",
    lengths: ["18\"", "20\"", "22\"", "24\"", "26\""],
    inStock: true,
    featured: false,
    rating: 5.0,
    reviewCount: 71,
  },
  {
    id: "10",
    name: "Curly Bob Wig",
    category: "Wigs",
    price: 7600,
    originalPrice: 8800,
    images: [
      "/asset/curly bob wig.jfif",
    ],
    description:
      "Short curly bob wig with natural coil pattern. Lightweight cap, adjustable band. Perfect for a chic everyday look.",
    lengths: ["8\"", "10\"", "12\""],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewCount: 58,
  },
];

export const reviews = [
  {
    id: "r1",
    name: "Astu",
    handle: "@astu",
    photo: "/asset/astu.jpg",
    text: "I've ordered from so many hair vendors but Yada Hair is on another level. The bundles are incredibly soft, zero shedding after multiple washes. The lace blends perfectly with my skin. I feel so confident every time I wear it.",
  },
  {
    id: "r2",
    name: "Akla",
    handle: "@akla",
    photo: "/asset/akla.png",
    text: "From the packaging to the product itself — everything screams quality. I bleached my wig and it held up beautifully. Yadeshi is so responsive too. Will definitely be a repeat customer.",
  },
];

export const categories = ["All", "Bundles", "Wigs", "Closures"];
