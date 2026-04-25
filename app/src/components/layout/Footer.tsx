import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.tsx';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const toast = useToast();

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    toast.push('Thanks for subscribing!', { variant: 'success' });
    setEmail('');
  }

  return (
    <footer className={styles.footer} data-testid="footer">
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>Northwind Goods</div>
            <p className={styles.brandTagline}>
              Considered essentials for everyday life. Made well, shipped slow.
            </p>
            <form className={styles.newsletter} onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="newsletter-input"
              />
              <button type="submit" data-testid="newsletter-submit">
                Subscribe
              </button>
            </form>
          </div>
          <div className={styles.col}>
            <h3>Shop</h3>
            <ul>
              <li>
                <Link to="/products">All products</Link>
              </li>
              <li>
                <Link to="/products?category=apparel-mens">Men's</Link>
              </li>
              <li>
                <Link to="/products?category=apparel-womens">Women's</Link>
              </li>
              <li>
                <Link to="/products?category=accessories">Accessories</Link>
              </li>
            </ul>
          </div>
          <div className={styles.col}>
            <h3>Help</h3>
            <ul>
              <li>
                <a href="#">Shipping</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
              <li>
                <a href="#">Size guide</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>
          <div className={styles.col}>
            <h3>Company</h3>
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Sustainability</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Northwind Goods. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
