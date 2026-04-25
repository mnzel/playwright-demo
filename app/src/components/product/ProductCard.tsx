import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { formatCurrency } from '../../utils/format.ts';
import StockBadge from './StockBadge.tsx';
import type { Product } from '../../types.ts';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const toast = useToast();

  // Apparel cards link to the detail page so the user can pick a size.
  // Non-apparel cards add to cart directly.
  const requiresSize = Array.isArray(product.sizes) && product.sizes.length > 0;

  function handleAdd(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1, null);
    toast.push(`${product.name} added to cart`, { variant: 'success' });
  }

  return (
    <article
      className={styles.card}
      data-testid={`product-card-${product.slug}`}
      data-product-id={product.id}
    >
      <Link to={`/products/${product.slug}`} className={styles.imageWrap}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className={styles.body}>
        <div className={styles.name}>
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </div>
        <StockBadge inStock={product.inStock} />
        <div className={styles.priceRow}>
          <span className={styles.price} data-testid="product-price">{formatCurrency(product.price)}</span>
          {requiresSize ? (
            <Link to={`/products/${product.slug}`} className={styles.addBtn} data-testid="add-btn">
              Choose options
            </Link>
          ) : (
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAdd}
              disabled={!product.inStock}
              data-testid="add-btn"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
