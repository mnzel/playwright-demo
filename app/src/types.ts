// Shared domain types.

export type CategorySlug =
  | 'apparel-mens'
  | 'apparel-womens'
  | 'accessories'
  | 'home';

export interface Category {
  slug: CategorySlug;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  description: string;
  image: string;
  sizes: string[] | null;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string | null;
}

export interface CartLineItem extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface CartTotals {
  lineItems: CartLineItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
}

export interface User {
  email: string;
  name: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  size: string | null;
  unitPrice: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  country: string;
}

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface Order {
  id: string;
  userEmail: string;
  placedAt: string;
  items: OrderItem[];
  total: number;
  shipping: ShippingAddress;
}

export type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

export interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;
}

export type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
