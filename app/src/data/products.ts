import type { Category, Product } from '../types.ts';

// Static product catalog.
//
// Each product has an `inStock` boolean (used by list views for fast filtering)
// and a `stockCount` number (the actual inventory count).

export const CATEGORIES: Category[] = [
  { slug: 'apparel-mens', name: "Men's Apparel" },
  { slug: 'apparel-womens', name: "Women's Apparel" },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'home', name: 'Home & Living' },
];

export const PRODUCTS: Product[] = [
  // ---------- Men's Apparel ----------
  {
    id: 'p001',
    slug: 'classic-white-tee-mens',
    name: 'Classic White Tee',
    category: 'apparel-mens',
    price: 22.0,
    description:
      'A heavyweight 100% cotton crewneck. Garment-washed for softness from day one.',
    image: 'https://picsum.photos/seed/whitetee-mens/600/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 12,
    featured: true,
  },
  {
    id: 'p002',
    slug: 'navy-oxford-shirt',
    name: 'Navy Oxford Shirt',
    category: 'apparel-mens',
    price: 58.0,
    description:
      'Button-down collar, mother-of-pearl buttons. The shirt that goes with everything.',
    image: 'https://picsum.photos/seed/navy-oxford/600/600',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 8,
    featured: false,
  },
  {
    id: 'p003',
    slug: 'selvedge-denim-jeans',
    name: 'Selvedge Denim Jeans',
    category: 'apparel-mens',
    price: 128.0,
    description: '14oz Japanese selvedge denim. Slim straight cut. Made to be worn in.',
    image: 'https://picsum.photos/seed/selvedge-denim/600/600',
    sizes: ['28', '30', '32', '34', '36'],
    inStock: false,
    stockCount: 0,
    featured: true,
  },
  {
    id: 'p004',
    slug: 'merino-wool-sweater',
    name: 'Merino Wool Sweater',
    category: 'apparel-mens',
    price: 89.0,
    description: 'Lightweight merino crewneck, breathable and odour-resistant.',
    image: 'https://picsum.photos/seed/merino-sweater/600/600',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 5,
    featured: false,
  },

  // ---------- Women's Apparel ----------
  {
    id: 'p005',
    slug: 'classic-white-tee-womens',
    name: 'Classic White Tee',
    category: 'apparel-womens',
    price: 22.0,
    description: 'Cropped fit. Heavyweight cotton with a relaxed neckline.',
    image: 'https://picsum.photos/seed/whitetee-womens/600/600',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 9,
    featured: true,
  },
  {
    id: 'p006',
    slug: 'striped-breton-top',
    name: 'Striped Breton Top',
    category: 'apparel-womens',
    price: 48.0,
    description: 'A timeless French navy-and-cream Breton stripe in soft cotton.',
    image: 'https://picsum.photos/seed/breton/600/600',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: false,
    stockCount: 0,
    featured: false,
  },
  {
    id: 'p007',
    slug: 'high-rise-trousers',
    name: 'High-Rise Tailored Trousers',
    category: 'apparel-womens',
    price: 92.0,
    description: 'Wool-blend trousers with a flat front and tapered leg.',
    image: 'https://picsum.photos/seed/trousers/600/600',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 11,
    featured: false,
  },
  {
    id: 'p008',
    slug: 'cashmere-cardigan',
    name: 'Cashmere Cardigan',
    category: 'apparel-womens',
    price: 165.0,
    description: 'Pure Mongolian cashmere in a longline silhouette.',
    image: 'https://picsum.photos/seed/cardigan/600/600',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 4,
    featured: true,
  },

  // ---------- Accessories ----------
  {
    id: 'p009',
    slug: 'leather-card-holder',
    name: 'Leather Card Holder',
    category: 'accessories',
    price: 35.0,
    description: 'Vegetable-tanned full-grain leather. Holds 6 cards and folded notes.',
    image: 'https://picsum.photos/seed/cardholder/600/600',
    sizes: null,
    inStock: true,
    stockCount: 20,
    featured: false,
  },
  {
    id: 'p010',
    slug: 'wool-felt-fedora',
    name: 'Wool Felt Fedora',
    category: 'accessories',
    price: 72.0,
    description: 'Hand-blocked Italian wool felt. Grosgrain band, satin lining.',
    image: 'https://picsum.photos/seed/fedora/600/600',
    sizes: ['S/M', 'L/XL'],
    inStock: false,
    stockCount: 0,
    featured: false,
  },
  {
    id: 'p011',
    slug: 'canvas-tote-bag',
    name: 'Heavy Canvas Tote Bag',
    category: 'accessories',
    price: 28.0,
    description: '18oz natural canvas with reinforced base seams. Endlessly useful.',
    image: 'https://picsum.photos/seed/tote/600/600',
    sizes: null,
    inStock: true,
    stockCount: 30,
    featured: true,
  },
  {
    id: 'p012',
    slug: 'silk-scarf-twill',
    name: 'Silk Twill Scarf',
    category: 'accessories',
    price: 95.0,
    description: 'Hand-rolled hem, archival print on 100% silk twill.',
    image: 'https://picsum.photos/seed/scarf/600/600',
    sizes: null,
    inStock: true,
    stockCount: 7,
    featured: false,
  },

  // ---------- Home & Living ----------
  {
    id: 'p013',
    slug: 'enamel-pour-over-kettle',
    name: 'Enamel Pour-Over Kettle',
    category: 'home',
    price: 64.0,
    description: 'Cream enamel on steel. Gooseneck spout for precision pouring.',
    image: 'https://picsum.photos/seed/kettle/600/600',
    sizes: null,
    inStock: true,
    stockCount: 6,
    featured: false,
  },
  {
    id: 'p014',
    slug: 'linen-throw-blanket',
    name: 'Linen Throw Blanket',
    category: 'home',
    price: 88.0,
    description: 'Stonewashed European linen with a fringed edge.',
    image: 'https://picsum.photos/seed/throw/600/600',
    sizes: null,
    inStock: true,
    stockCount: 9,
    featured: false,
  },
  {
    id: 'p015',
    slug: 'ceramic-dinner-set',
    name: 'Ceramic Dinner Set (4pc)',
    category: 'home',
    price: 120.0,
    description:
      'Reactive glaze stoneware. Dishwasher safe. Each piece is slightly unique.',
    image: 'https://picsum.photos/seed/dinnerset/600/600',
    sizes: null,
    inStock: true,
    stockCount: 3,
    featured: true,
  },
  {
    id: 'p016',
    slug: 'beeswax-candle',
    name: 'Hand-Poured Beeswax Candle',
    category: 'home',
    price: 24.0,
    description: '100% pure beeswax. 40-hour burn time. Lightly honey-scented.',
    image: 'https://picsum.photos/seed/candle/600/600',
    sizes: null,
    inStock: true,
    stockCount: 25,
    featured: false,
  },
];

// ---------- Helpers ----------

export function getProductBySlug(slug: string): Product | null {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductById(id: string): Product | null {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function getCategoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const current = getProductById(productId);
  if (!current) return [];
  return PRODUCTS
    .filter((p) => p.id !== productId && p.category === current.category)
    .slice(0, limit);
}
