import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Heart, Trash2, ChevronDown, Circle, Sparkles, Gem, Disc, FileText, Plus, Minus, CreditCard } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import WishlistModal from '../WishlistModal/WishlistModal';
import InvoiceModal from '../InvoiceModal/InvoiceModal';
import DeleteToast from '../DeleteToast/DeleteToast';
import AuthModal from '../AuthModal/AuthModal';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Navigation.module.css';

export const Navigation = () => {
  const { scrolled } = useScrollAnimation(20);
  const navigate = useNavigate();
  const location = useLocation();

  const { wishlist = [], openWishlist = () => {} } = useWishlist() || {};
  const {
    cartItems = [],
    removeFromCart,
    updateQuantity,
    totalCount = 0,
    totalPriceFormatted = '۰',
  } = useCart() || {};

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);

  const collectionCategories = [
    { id: 'rings', name: 'حلقه‌ها', icon: '💍', desc: 'سولیتیر، برلیان، گوهرسنگ و حلقه ازدواج', href: '/collections?category=rings' },
    { id: 'earrings', name: 'گوشواره‌ها', icon: '✨', desc: 'حلقه‌ای، میخی، آویز و الماس سلطنتی', href: '/collections?category=earrings' },
    { id: 'necklaces', name: 'مدال‌ها', icon: '📿', desc: 'مدال سلطنتی، آویز گوهرسنگ و طوق فاخر', href: '/collections?category=necklaces' },
  ];

  const navItems = [
    { label: 'خانه', href: '/', isRoute: true },
    { label: 'مجموعه‌ها', href: '/collections', isRoute: true, hasDropdown: true },
    { label: 'محصولات', href: '#featured' },
    { label: 'کالکشن لوکس', href: '#luxury-collection' },
    { label: 'داستان ما', href: '/story', isRoute: true },
    { label: 'نظرات مشتریان', href: '/testimonials', isRoute: true },
    { label: 'تماس با ما', href: '/contact', isRoute: true },
  ];

  const handleNavClick = (item, e) => {
    if (item.isRoute) {
      e.preventDefault();
      navigate(item.href);
      setMobileMenuOpen(false);
      setCollectionsDropdownOpen(false);
      return;
    }

    if (item.hasDropdown) {
      e.preventDefault();
      setCollectionsDropdownOpen(!collectionsDropdownOpen);
      return;
    }

    if (item.href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (location.pathname !== '/') {
        navigate(`/${item.href}`);
      } else {
        const targetId = item.href.replace('#', '');
        const targetElem = document.getElementById(targetId);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleCategoryClick = (cat, e) => {
    e.preventDefault();
    setCollectionsDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(cat.href || '/collections');
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolledHeader : ''}`}>
        <div className={styles.navContainer}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>💎</span>
            <span className={styles.logoText}>Luxury Jewel</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="منوی اصلی">
            <ul className={styles.navLinks}>
              {navItems.map((item) => (
                <li 
                  key={item.label}
                  className={item.hasDropdown ? styles.hasDropdownWrapper : ''}
                  onMouseEnter={() => item.hasDropdown && setCollectionsDropdownOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setCollectionsDropdownOpen(false)}
                >
                  <a 
                    href={item.href} 
                    className={`${styles.navLink} ${item.isRoute && location.pathname === item.href ? styles.activeNavLink : ''}`}
                    onClick={(e) => handleNavClick(item, e)}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown size={15} className={`${styles.dropdownChevron} ${collectionsDropdownOpen ? styles.chevronRotated : ''}`} />
                    )}
                  </a>

                  {/* Mega Dropdown Menu for Collections */}
                  {item.hasDropdown && (
                    <AnimatePresence>
                      {collectionsDropdownOpen && (
                        <motion.div
                          className={styles.dropdownMenu}
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.96 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                        >
                          <div className={styles.dropdownHeader}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>دسته‌بندی‌ها</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>گالری زیورآلات</span>
                          </div>
                          <div className={styles.dropdownGrid}>
                            {collectionCategories.map((cat) => (
                              <a
                                key={cat.id}
                                href={cat.href}
                                className={styles.dropdownItem}
                                onClick={(e) => handleCategoryClick(cat, e)}
                              >
                                <span className={styles.catIcon}>{cat.icon}</span>
                                <div>
                                  <div className={styles.catName}>{cat.name}</div>
                                  <div className={styles.catDesc}>{cat.desc}</div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions: User Icons + Theme Toggle + Mobile Menu Toggle */}
          <div className={styles.rightActions}>
            <div className={styles.userIconsGroup}>
              {/* User Login Icon */}
              <div 
                className={styles.iconWrapper}
                onMouseEnter={() => setActiveTooltip('user')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  type="button"
                  className={styles.userIconBtn}
                  onClick={() => setUserModalOpen(true)}
                  aria-label="ورود / ثبت نام"
                >
                  <User size={22} className={styles.iconSvg} />
                </button>
                {activeTooltip === 'user' && (
                  <div className={styles.tooltip}>ورود / ثبت‌نام</div>
                )}
              </div>

              {/* Wishlist / Favorites Icon */}
              <div 
                className={styles.iconWrapper}
                onMouseEnter={() => setActiveTooltip('wishlist')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  type="button"
                  className={styles.userIconBtn}
                  onClick={openWishlist}
                  aria-label="علاقه‌مندی‌ها"
                >
                  <Heart size={22} className={styles.iconSvg} />
                  {wishlist.length > 0 && (
                    <span className={styles.badge}>{wishlist.length}</span>
                  )}
                </button>
                {activeTooltip === 'wishlist' && (
                  <div className={styles.tooltip}>علاقه‌مندی‌ها</div>
                )}
              </div>

              {/* Shopping Cart Icon */}
              <div 
                className={styles.iconWrapper}
                onMouseEnter={() => setActiveTooltip('cart')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  type="button"
                  className={styles.userIconBtn}
                  onClick={() => setCartModalOpen(true)}
                  aria-label="سبد خرید"
                >
                  <ShoppingCart size={22} className={styles.iconSvg} />
                  <span className={`${styles.badge} ${styles.cartBadge}`}>
                    {totalCount}
                  </span>
                </button>
                {activeTooltip === 'cart' && (
                  <div className={styles.tooltip}>سبد خرید</div>
                )}
              </div>
            </div>

            <ThemeToggle />

            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="تغییر وضعیت منوی موبایل"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <ul className={styles.mobileNavLinks}>
                {navItems.map((item) => (
                  <React.Fragment key={item.label}>
                    <li>
                      <a
                        href={item.href}
                        className={styles.mobileNavLink}
                        onClick={(e) => handleNavClick(item, e)}
                      >
                        {item.label}
                      </a>
                    </li>
                    {item.hasDropdown && (
                      <li style={{ paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                        {collectionCategories.map((cat) => (
                          <a
                            key={cat.id}
                            href={cat.href}
                            className={styles.mobileSubLink}
                            onClick={(e) => handleCategoryClick(cat, e)}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </a>
                        ))}
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Wishlist Modal */}
      <WishlistModal />

      {/* Cart Modal Drawer */}
      <AnimatePresence>
        {cartModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setCartModalOpen(false)}>
            <motion.div
              className={styles.userModal}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 0 }}
            >
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setCartModalOpen(false)}
                aria-label="بستن سبد خرید"
              >
                <X size={18} />
              </button>

              <div className={styles.cartScrollContainer}>
                <div className={styles.cartHeaderCompact}>
                  <div className={styles.cartHeaderBadgeIcon}>🛍️</div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 className={styles.modalTitle}>سبد خرید شما</h3>
                    <p className={styles.modalSubtitle}>
                      {cartItems.length === 0
                        ? 'سبد خرید شما خالی است'
                        : `تعداد کل محصولات: ${totalCount} عدد`}
                    </p>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0', margin: 0 }}>
                    هنوز محصولی به سبد خرید اضافه نکرده‌اید.
                  </p>
                ) : (
                  <>
                    <div
                      className={styles.cartListScrollable}
                      style={{
                        maxHeight: cartItems.length > 4 ? '360px' : 'none',
                        overflowY: cartItems.length > 4 ? 'auto' : 'visible',
                      }}
                    >
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            borderRadius: '18px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--theme-glass-border)',
                            gap: '14px',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexGrow: 1, overflow: 'hidden' }}>
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0, border: '1px solid var(--theme-glass-border)' }}
                              />
                            )}
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '4px', fontWeight: 600 }}>
                                {item.price} تومان
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls + Trash Button */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                            <div className={styles.qtyWrapper}>
                              <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                title="افزایش تعداد"
                              >
                                <Plus size={14} />
                              </button>
                              <span className={styles.qtyValue}>{item.quantity}</span>
                              <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                title="کاهش تعداد"
                              >
                                <Minus size={14} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                background: 'rgba(255, 82, 82, 0.1)',
                                border: '1px solid rgba(255, 82, 82, 0.2)',
                                color: '#ff5252',
                                cursor: 'pointer',
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                              }}
                              title="حذف از سبد خرید"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Price Total Summary Row */}
                    <div className={styles.cartSummaryRow}>
                      <span>جمع کل سبد خرید:</span>
                      <span className={styles.cartTotalValue}>{totalPriceFormatted} تومان</span>
                    </div>

                    {/* Dual Action Buttons: Proforma Invoice & Payment */}
                    <div className={styles.cartActionsContainer}>
                      <button
                        type="button"
                        className={styles.invoiceBtn}
                        onClick={() => {
                          setCartModalOpen(false);
                          setInvoiceModalOpen(true);
                        }}
                      >
                        <FileText size={18} />
                        <span>مشاهده و دانلود پیش‌فاکتور</span>
                      </button>

                      <button
                        type="button"
                        className={styles.payActionBtn}
                        onClick={() => {
                          setCartModalOpen(false);
                          setInvoiceModalOpen(true);
                        }}
                      >
                        <CreditCard size={18} />
                        <span>تکمیل خرید و پرداخت</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Proforma Invoice Modal */}
      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />

      {/* Center-screen 10s Deletion Toast Notification */}
      <DeleteToast />

      {/* User Login/Register Modal */}
      <AuthModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
