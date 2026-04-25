import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.tsx';
import Footer from './Footer.tsx';
import CartDrawer from '../cart/CartDrawer.tsx';
import Toaster from '../ui/Toaster.tsx';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <>
      <Header onCartClick={() => setDrawerOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Toaster />
    </>
  );
}
