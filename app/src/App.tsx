import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import Layout from './components/layout/Layout.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

import HomePage from './pages/HomePage.tsx';
import ProductListPage from './pages/ProductListPage.tsx';
import ProductDetailPage from './pages/ProductDetailPage.tsx';
import CartPage from './pages/CartPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import AccountPage from './pages/AccountPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import ConfirmationPage from './pages/ConfirmationPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/confirmation/:orderId"
                element={
                  <ProtectedRoute>
                    <ConfirmationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
