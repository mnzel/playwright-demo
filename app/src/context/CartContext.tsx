import { createContext, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { usePersistedReducer } from '../hooks/usePersistedReducer.ts';
import { readFromStorage, writeToStorage } from '../hooks/useLocalStorage.ts';
import { getProductById } from '../data/products.ts';
import { useToast } from './ToastContext.tsx';
import type { CartItem, CartLineItem, CartTotals } from '../types.ts';

interface CartState {
  items: CartItem[];
  promoApplied: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; quantity: number; size: string | null } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string | null } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; size: string | null; quantity: number } }
  | { type: 'APPLY_PROMO'; payload: string }
  | { type: 'REMOVE_PROMO' }
  | { type: 'CLEAR' };

interface PromoResult {
  ok: boolean;
  error?: string;
}

interface CartContextValue extends CartTotals {
  items: CartItem[];
  promoApplied: string | null;
  addItem: (productId: string, quantity?: number, size?: string | null) => void;
  removeItem: (productId: string, size?: string | null) => void;
  updateQuantity: (productId: string, size: string | null, quantity: number) => void;
  applyPromo: (code: string) => PromoResult;
  removePromo: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'ec_cart_v1';
const PROMO_USED_KEY = 'ec_promo_used_v1';

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 5.99;
const PROMO_CODE = 'WELCOME10';
const PROMO_DISCOUNT = 0.1;

const initialState: CartState = {
  items: [],
  promoApplied: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, quantity, size } = action.payload;
      const existingIdx = state.items.findIndex(
        (it) => it.productId === productId && it.size === size
      );
      if (existingIdx >= 0) {
        const next = [...state.items];
        next[existingIdx] = {
          ...next[existingIdx]!,
          quantity: next[existingIdx]!.quantity + quantity,
        };
        return { ...state, items: next };
      }
      return {
        ...state,
        items: [...state.items, { productId, quantity, size }],
      };
    }
    case 'REMOVE_ITEM': {
      const { productId, size } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (it) => !(it.productId === productId && it.size === size)
        ),
      };
    }
    case 'UPDATE_QTY': {
      const { productId, size, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (it) => !(it.productId === productId && it.size === size)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((it) =>
          it.productId === productId && it.size === size
            ? { ...it, quantity }
            : it
        ),
      };
    }
    case 'APPLY_PROMO':
      return { ...state, promoApplied: action.payload };
    case 'REMOVE_PROMO':
      return { ...state, promoApplied: null };
    case 'CLEAR':
      return { ...initialState };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = usePersistedReducer<CartState, CartAction>(
    cartReducer,
    initialState,
    STORAGE_KEY
  );
  const toast = useToast();

  const addItem = useCallback(
    (productId: string, quantity: number = 1, size: string | null = null) => {
      dispatch({ type: 'ADD_ITEM', payload: { productId, quantity, size } });

      setTimeout(() => {
        const product = getProductById(productId);
        if (!product) return;
        if (product.stockCount === 0) {
          dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } });
          toast.push(`Sorry, ${product.name} is out of stock.`, { variant: 'error' });
        }
      }, 150);
    },
    [dispatch, toast]
  );

  const removeItem = useCallback(
    (productId: string, size: string | null = null) =>
      dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } }),
    [dispatch]
  );

  const updateQuantity = useCallback(
    (productId: string, size: string | null, quantity: number) =>
      dispatch({ type: 'UPDATE_QTY', payload: { productId, size, quantity } }),
    [dispatch]
  );

  const applyPromo = useCallback(
    (code: string): PromoResult => {
      const normalized = String(code ?? '').trim().toUpperCase();
      if (normalized !== PROMO_CODE) {
        return { ok: false, error: 'Invalid promo code' };
      }
      const used = readFromStorage<string[]>(PROMO_USED_KEY, []);
      if (Array.isArray(used) && used.includes(PROMO_CODE)) {
        return { ok: false, error: 'Code already used this session' };
      }
      writeToStorage(PROMO_USED_KEY, [...(Array.isArray(used) ? used : []), PROMO_CODE]);
      dispatch({ type: 'APPLY_PROMO', payload: PROMO_CODE });
      return { ok: true };
    },
    [dispatch]
  );

  const removePromo = useCallback(() => dispatch({ type: 'REMOVE_PROMO' }), [dispatch]);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch]);

  const totals = useMemo<CartTotals>(() => {
    const lineItems: CartLineItem[] = state.items
      .map((item): CartLineItem | null => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter((li): li is CartLineItem => li !== null);

    const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
    const discount = state.promoApplied === PROMO_CODE ? subtotal * PROMO_DISCOUNT : 0;
    const subtotalAfterDiscount = subtotal - discount;
    const shipping =
      subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD || lineItems.length === 0
        ? 0
        : STANDARD_SHIPPING;
    const total = subtotalAfterDiscount + shipping;
    const itemCount = lineItems.reduce((sum, li) => sum + li.quantity, 0);

    return {
      lineItems,
      subtotal,
      discount,
      shipping,
      total,
      itemCount,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      qualifiesForFreeShipping: subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD,
    };
  }, [state.items, state.promoApplied]);

  const value: CartContextValue = {
    items: state.items,
    promoApplied: state.promoApplied,
    addItem,
    removeItem,
    updateQuantity,
    applyPromo,
    removePromo,
    clearCart,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
