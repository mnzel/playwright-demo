import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import styles from './Header.module.css';

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const { itemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileAccountOpen(false);
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link to="/" className={styles.logo} data-testid="logo">
          Northwind <span>Goods</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            data-testid="nav-home"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            data-testid="nav-products"
          >
            Shop
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <div className={styles.accountWrapper} data-testid="account-menu">
            <button
              type="button"
              className={styles.accountTrigger}
              onClick={() => setMobileAccountOpen((v) => !v)}
              aria-label="Account menu"
            >
              <span aria-hidden="true">👤</span>
              <span>{isAuthenticated && user ? user.name.split(' ')[0] : 'Account'}</span>
            </button>
            <div
              className={styles.accountMenu}
              data-open={mobileAccountOpen ? 'true' : 'false'}
              role="menu"
            >
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className={styles.accountMenuItem}
                    data-testid="account-menu-account"
                    role="menuitem"
                    onClick={() => setMobileAccountOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    className={styles.accountMenuItem}
                    data-testid="account-menu-logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={styles.accountMenuItem}
                    data-testid="account-menu-login"
                    role="menuitem"
                    onClick={() => setMobileAccountOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className={styles.accountMenuItem}
                    data-testid="account-menu-register"
                    role="menuitem"
                    onClick={() => setMobileAccountOpen(false)}
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            className={styles.cartButton}
            data-testid="cart-button"
            onClick={onCartClick}
            aria-label={`Cart with ${itemCount} items`}
          >
            <span aria-hidden="true">🛒</span>
            {itemCount > 0 && (
              <span className={styles.cartBadge} data-testid="cart-badge">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
