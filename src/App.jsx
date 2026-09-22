import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';


import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import FeaturedProducts from './components/FeaturedProducts/FeaturedProducts';
import LuxuryCollection from './components/LuxuryCollection/LuxuryCollection';
import SpecialDiscounts from './components/SpecialDiscounts/SpecialDiscounts';
import Footer from './components/Footer/Footer';

import BrandStoryPage from './pages/BrandStoryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import CollectionsPage from './pages/CollectionsPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { TestimonialsProvider } from './contexts/TestimonialsContext';

// پنل مدیریت
import AdminLayout from './components/admin/AdminLayout';
import RequireAdmin from './components/admin/RequireAdmin';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';
import AdminBrandStoryPage from './pages/admin/AdminBrandStoryPage';
import AdminContactPage from './pages/admin/AdminContactPage';
import styles from './App.module.css';

// لایوت فروشگاه
function StoreLayout() {
  return (
    <div className={styles.appWrapper}>
      <Navigation />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const HomePage = () => (
  <>
    <Hero />
    <FeaturedProducts />
    <LuxuryCollection />
    <SpecialDiscounts />
  </>
);

export default function App() {
  return (
<ThemeProvider>
  <ProductsProvider>
    <SiteSettingsProvider>
      <TestimonialsProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* مسیرهای فروشگاه */}
                <Route element={<StoreLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collections/:category" element={<CollectionsPage />} />
                  <Route path="/rings" element={<CollectionsPage />} />
                  <Route path="/rings/:category" element={<CollectionsPage />} />
                  <Route path="/earrings" element={<CollectionsPage />} />
                  <Route path="/necklaces" element={<CollectionsPage />} />
                  <Route path="/bracelets" element={<CollectionsPage />} />
                  <Route path="/story" element={<BrandStoryPage />} />
                  <Route path="/testimonials" element={<TestimonialsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Route>

                {/* پنل مدیریت */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<RequireAdmin />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                      <Route path="brand-story" element={<AdminBrandStoryPage />} />
                      <Route path="contact" element={<AdminContactPage />} />
                      <Route
                    path="testimonials"
                    element={<AdminTestimonialsPage />}
                  />
                  </Route>
                </Route>

                {/* هر مسیر ناموجود به صفحه اصلی هدایت میشه */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
             </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </TestimonialsProvider>
    </SiteSettingsProvider>
  </ProductsProvider>
</ThemeProvider>
  );
}
