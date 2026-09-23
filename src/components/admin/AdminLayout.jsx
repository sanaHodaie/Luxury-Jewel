// src/components/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gem,
  LayoutDashboard,
  Package,
  Store,
  LogOut,
  Menu,
  X,
  BookOpen,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { to: '/admin/products', label: 'محصولات', icon: Package },
  { to: '/admin/brand-story', label: 'داستان درباره ما', icon: BookOpen },
  { to: '/admin/contact', label: 'تماس با ما', icon: Phone },
  { to: '/admin/testimonials', label: 'نظرات مشتریان', icon: MessageSquare },
];

export default function AdminLayout() {
  const { logoutAdmin, products } = useProducts();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ---------- قفل اسکرول body وقتی Drawer بازه ----------
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  // ---------- بستن Drawer با کلید Escape ----------
  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  // ---------- بستن Drawer با تغییر مسیر ----------
  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    closeMobile();
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.brandIcon}>
          <Gem size={20} strokeWidth={2} />
        </span>
        <div className={styles.brandText}>
          <p className={styles.brandName}>Luxury Jewel</p>
          <p className={styles.brandSub}>پنل مدیریت</p>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeMobile}
          >
            <Icon size={17} strokeWidth={2} className={styles.navIcon} />
            <span className={styles.navLabel}>{label}</span>
            {to === '/admin/products' && (
              <span className={styles.countPill}>{products.length}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <NavLink to="/" className={styles.footerLink} onClick={closeMobile}>
          <Store size={16} />
          <span>مشاهده سایت</span>
        </NavLink>
        <button type="button" className={styles.footerLink} onClick={handleLogout}>
          <LogOut size={16} />
          <span>خروج از پنل</span>
        </button>
      </div>
    </>
  );

  return (
    <div className={styles.shell}>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
            />

            <motion.aside
              id="admin-mobile-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="منوی پنل مدیریت"
              className={styles.mobileSidebar}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={styles.main}>
        {/* ✅ Floating Glass Header */}
        <div className={styles.topbarWrap}>
          <header className={styles.topbar}>
            {/* دکمه منو موبایل */}
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={mobileOpen}
              aria-controls="admin-mobile-sidebar"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            {/* Brand Icon */}
            <div className={styles.topbarBrandIcon}>
              <Gem size={16} strokeWidth={2} />
            </div>

            {/* Title */}
            <div className={styles.topbarTitleGroup}>
              <span className={styles.topbarTitle}>مرکز مدیریت</span>
              <span className={styles.topbarDot}>·</span>
              <span className={styles.topbarSubtitle}>Luxury Jewel</span>
            </div>

            {/* Status */}
            <div className={styles.topbarStatus}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>آنلاین</span>
            </div>

            {/* دکمه سایت */}
            <NavLink to="/" className={styles.topbarSiteLink}>
              <Store size={14} />
              <span>سایت</span>
            </NavLink>
          </header>
        </div>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}