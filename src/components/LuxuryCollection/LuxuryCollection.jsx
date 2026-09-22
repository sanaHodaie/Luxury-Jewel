import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Sparkles,
  Eye,
  X,
  CheckCircle,
  Crown,
  Gem,
  Scale,
  Award,
  ShieldCheck,
  Truck,
  Gift,
  PhoneCall,
  Check,
  Copy,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useProducts } from '../../contexts/ProductsContext';
import { ImageZoom } from '../ImageZoom/ImageZoom';
import styles from './LuxuryCollection.module.css';

const CATEGORIES = [
  { id: 'all', label: 'همه قطعات' },
  { id: 'ring', label: 'انگشتر' },
  { id: 'necklace', label: 'گردنبند' },
  { id: 'earring', label: 'گوشواره' },
  { id: 'bracelet', label: 'دستبند' }
];

export const LuxuryCollection = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [toastMessage, setToastMessage] = useState(null);
  const [compareItems, setCompareItems] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [modalTab, setModalTab] = useState('specs');
  const [selectedMetal, setSelectedMetal] = useState('yellow');
  const [copiedCode, setCopiedCode] = useState(false);
  const [vipSuccess, setVipSuccess] = useState(false);

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { luxuryProducts } = useProducts();

  const handleOpenProductModal = (product) => {
    setSelectedMetal('yellow');
    setModalTab('specs');
    setSelectedProduct(product);
  };

  const currentModalImage = useMemo(() => {
    if (!selectedProduct) return null;
    if (selectedProduct.metalImages && selectedProduct.metalImages[selectedMetal]) {
      return selectedProduct.metalImages[selectedMetal];
    }
    return selectedProduct.image;
  }, [selectedProduct, selectedMetal]);

  const toPersianDigits = (num) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => farsiDigits[parseInt(d, 10)]);
  };

  // ✅ فیلتر، جستجو و مرتب‌سازی محصولات
  const displayedProducts = useMemo(() => {
    if (!Array.isArray(luxuryProducts)) return [];

    let filtered = luxuryProducts.filter((product) => {
      // فیلتر دسته‌بندی
      if (selectedCategory !== 'all') {
        const cat = product.category ? product.category.toLowerCase() : '';
        const catFull = product.categoryFull ? product.categoryFull.toLowerCase() : '';
        const name = product.name ? product.name.toLowerCase() : '';

        if (selectedCategory === 'ring' && !cat.includes('ring') && !catFull.includes('انگشتر') && !name.includes('انگشتر')) return false;
        if (selectedCategory === 'necklace' && !cat.includes('necklace') && !catFull.includes('گردنبند') && !name.includes('گردنبند')) return false;
        if (selectedCategory === 'earring' && !cat.includes('earring') && !catFull.includes('گوشواره') && !name.includes('گوشواره')) return false;
        if (selectedCategory === 'bracelet' && !cat.includes('bracelet') && !catFull.includes('دستبند') && !name.includes('دستبند')) return false;
      }

      // فیلتر جستجو
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(query);
        const matchDesc = product.description?.toLowerCase().includes(query);
        const matchGem = product.gemType?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchGem) return false;
      }

      return true;
    });

    // مرتب‌سازی
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, '')));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.price.replace(/,/g, '')) - parseFloat(a.price.replace(/,/g, '')));
    }

    return filtered;
  }, [luxuryProducts, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product);
    showToast(`«${product.name}» به سبد خرید افزوده شد.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const isWishlisted = (id) => (isInWishlist ? isInWishlist(id) : wishlist.some((item) => item.id === id));

  const toggleCompare = (product, e) => {
    if (e) e.stopPropagation();
    if (compareItems.some((i) => i.id === product.id)) {
      setCompareItems((prev) => prev.filter((i) => i.id !== product.id));
      showToast('از لیست مقایسه حذف شد');
    } else {
      if (compareItems.length >= 3) {
        showToast('حداکثر ۳ قطعه امکان مقایسه همزمان دارند');
        return;
      }
      setCompareItems((prev) => [...prev, product]);
      showToast('به لیست مقایسه اضافه شد');
    }
  };

  const copyCertCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVipSubmit = (e) => {
    e.preventDefault();
    setVipSuccess(true);
    setTimeout(() => {
      setVipSuccess(false);
      showToast('درخواست مشاوره VIP شما با موفقیت ثبت شد.');
    }, 1500);
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: window.innerWidth <= 768 ? '100%' : 20,
      scale: window.innerWidth <= 768 ? 1 : 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 280 }
    },
    exit: { 
      opacity: 0, 
      y: window.innerWidth <= 768 ? '100%' : 20,
      scale: window.innerWidth <= 768 ? 1 : 0.95,
      transition: { duration: 0.25 }
    }
  };

  return (
    <section id="luxury-collection" className={styles.section}>
      <div className={styles.container}>
        {/* Header Section */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className={styles.subtitleBadge}>
            <Crown size={15} />
            <span>قطعات نایاب و فاخر</span>
          </div>
          <h2 className={styles.title}>کالکشن لوکس</h2>
          <p className={styles.description}>
            مجموعه‌ای انحصاری از جواهرات گرانبها، گوهرسنگ‌های نایاب و الماس‌های شناسنامه‌دار که برای سخت‌پسنـدترین کلکسیونرها طراحی شده‌اند.
          </p>
        </motion.div>

        {/* 🏷️ Controls Bar (دسته‌بندی، سرچ و سورت) */}
        <div className={styles.controlsBar}>
          <div className={styles.categoriesScroll}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.filterActive : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.searchAndSort}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="جستجوی قطعه یا سنگ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className={styles.sortBox}>
              <ArrowUpDown size={15} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="default">پیش‌فرض</option>
                <option value="price-low">ارزان‌ترین</option>
                <option value="price-high">گران‌ترین</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={styles.grid}>
          {displayedProducts.map((product, index) => {
            const inWishlist = isWishlisted(product.id);
            const inCompare = compareItems.some((i) => i.id === product.id);

            return (
              <motion.div
                key={product.id}
                className={styles.luxuryCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                {/* Top Notch Badge */}
                <div className={styles.notchBadge} title="شناسنامه GIA">
                  <Gem size={14} />
                </div>

                {/* Image Container */}
                <div className={styles.imageWrapper} onClick={() => handleOpenProductModal(product)}>
                  <ImageZoom
                    src={product.image}
                    alt={product.name}
                    zoomLevel={2.6}
                    showHint={false}
                  />

                  <div className={styles.floatingActions}>
                    <button
                      type="button"
                      className={`${styles.iconActionBtn} ${inWishlist ? styles.activeWishlist : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      title="افزودن به علاقه‌مندی‌ها"
                    >
                      <Heart size={17} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : 'currentColor'} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.iconActionBtn} ${inCompare ? styles.activeCompare : ''}`}
                      onClick={(e) => toggleCompare(product, e)}
                      title="افزودن به مقایسه"
                    >
                      <Scale size={16} />
                    </button>

                    <button
                      type="button"
                      className={styles.iconActionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProductModal(product);
                      }}
                      title="نمایش سریع"
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  <span className={styles.purityTag}>{product.purity}</span>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <div className={styles.categoryLabel}>
                    <Sparkles size={13} />
                    <span>{product.categoryFull}</span>
                  </div>

                  <h3
                    className={styles.productTitle}
                    onClick={() => handleOpenProductModal(product)}
                  >
                    {product.name}
                  </h3>

                  <p className={styles.productDesc}>{product.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceWrapper}>
                      <span className={styles.priceLabel}>ارزش قطعه:</span>
                      <span className={styles.priceValue}>{product.price} تومان</span>
                    </div>

                    <button
                      type="button"
                      className={styles.cartActionBtn}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart size={15} />
                      <span>خرید</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {displayedProducts.length === 0 && (
          <div className={styles.emptySearchState}>
            <Gem size={40} style={{ opacity: 0.4 }} />
            <p>هیچ قطعه‌ای مطابق با جستجو یا دسته‌بندی انتخابی یافت نشد.</p>
            <button
              type="button"
              className={styles.resetSearchBtn}
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              نمایش همه قطعات
            </button>
          </div>
        )}

        {/* Assurance Badges Bar */}
        <div className={styles.assuranceBar}>
          <div className={styles.assuranceItem}>
            <Truck size={22} className={styles.assuranceIcon} />
            <div>
              <h4>حمل بیمه‌شده اختصاصی</h4>
              <p>تحویل توسط تیم تشریفات امنیتی در سراسر کشور</p>
            </div>
          </div>

          <div className={styles.assuranceItem}>
            <Award size={22} className={styles.assuranceIcon} />
            <div>
              <h4>شناسنامه معتبر GIA</h4>
              <p>تضمین اصالت گوهرسنگ‌ها با گواهی بین‌المللی</p>
            </div>
          </div>

          <div className={styles.assuranceItem}>
            <Gift size={22} className={styles.assuranceIcon} />
            <div>
              <h4>بسته‌بندی فاخر کلکسیونی</h4>
              <p>جعبه‌های چرمی دست‌ساز با مهر طلایی لوکس</p>
            </div>
          </div>

          <div className={styles.assuranceItem}>
            <PhoneCall size={22} className={styles.assuranceIcon} />
            <div>
              <h4>مشاور اختصاصی VIP</h4>
              <p>پشتیبانی و امکان پرو حضوری در شوروم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Compare Drawer Bar */}
      <AnimatePresence>
        {compareItems.length > 0 && (
          <motion.div
            className={styles.floatingCompareBar}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
          >
            <div className={styles.compareBarContent}>
              <div className={styles.compareCountInfo}>
                <Scale size={20} />
                <span>مقایسه تخصصی ({toPersianDigits(compareItems.length)} از {toPersianDigits(3)})</span>
              </div>

              <div className={styles.compareThumbnails}>
                {compareItems.map((item) => (
                  <div key={item.id} className={styles.compareThumb}>
                    <img src={item.image} alt={item.name} />
                    <button
                      type="button"
                      onClick={() => toggleCompare(item)}
                      title="حذف"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.compareBarActions}>
                <button
                  type="button"
                  className={styles.openCompareBtn}
                  onClick={() => setIsCompareOpen(true)}
                >
                  جدول مقایسه
                </button>
                <button
                  type="button"
                  className={styles.clearCompareBtn}
                  onClick={() => setCompareItems([])}
                >
                  پاکسازی
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <motion.div
            className={styles.modalOverlay}
            onClick={() => setIsCompareOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.compareModalContent}
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.dragHandle} onClick={() => setIsCompareOpen(false)} />

              <div className={styles.modalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={22} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>مقایسه تخصصی گوهرسنگ‌های لوکس</h3>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setIsCompareOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className={styles.compareModalScrollBody}>
                <div className={styles.compareTableWrapper}>
                  <table className={styles.compareTable}>
                    <thead>
                      <tr>
                        <th>ویژگی / تصویر</th>
                        {compareItems.map((item) => (
                          <th key={item.id}>
                            <div className={styles.tableHeaderCell}>
                              <img src={item.image} alt={item.name} className={styles.tableImg} />
                              <div className={styles.tableName}>{item.name}</div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>قیمت تحویل</td>
                        {compareItems.map((item) => (
                          <td key={item.id} className={styles.tablePrice}>{item.price} تومان</td>
                        ))}
                      </tr>
                      <tr>
                        <td>نوع گوهر اصلی</td>
                        {compareItems.map((item) => (
                          <td key={item.id}>{item.gemType}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>وزن طلا / پایه</td>
                        {compareItems.map((item) => (
                          <td key={item.id}>{item.weightGold}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>قیراط / اندازه</td>
                        {compareItems.map((item) => (
                          <td key={item.id}>{item.carat}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>شناسنامه رسمی</td>
                        {compareItems.map((item) => (
                          <td key={item.id}>{item.certCode} (GIA)</td>
                        ))}
                      </tr>
                      <tr>
                        <td>اقدام</td>
                        {compareItems.map((item) => (
                          <td key={item.id}>
                            <button
                              type="button"
                              className={styles.tableCartBtn}
                              onClick={() => handleAddToCart(item)}
                            >
                              خرید مستقیم
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details & GIA Certificate Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className={styles.modalOverlay}
            onClick={() => setSelectedProduct(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.dragHandle} onClick={() => setSelectedProduct(null)} />

              <div className={styles.modalHeader}>
                <div className={styles.modalCategoryBadge}>
                  <Gem size={16} style={{ color: 'var(--accent)' }} />
                  <span>{selectedProduct.categoryFull}</span>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setSelectedProduct(null)}
                  aria-label="بستن"
                >
                  <X size={18} />
                </button>
              </div>

              <div className={styles.modalScrollBody}>
                <div className={styles.modalGrid}>
                  {/* Image Section */}
                  <div className={styles.modalImageWrapper}>
                    <ImageZoom
                      src={currentModalImage}
                      alt={selectedProduct.name}
                      zoomLevel={2.8}
                      showHint={false}
                    />

                    <div className={styles.metalSelectorBox}>
                      <span className={styles.metalLabel}>
                        پایه طلا: {selectedMetal === 'yellow' ? 'طلای زرد' : selectedMetal === 'white' ? 'طلای سفید' : 'رزگلد'}
                      </span>
                      <div className={styles.metalOptions}>
                        <button
                          type="button"
                          className={`${styles.metalDot} ${selectedMetal === 'yellow' ? styles.metalActive : ''}`}
                          style={{ background: '#d4af37' }}
                          onClick={() => setSelectedMetal('yellow')}
                          title="طلای زرد ۱۸ عیار"
                        />
                        <button
                          type="button"
                          className={`${styles.metalDot} ${selectedMetal === 'white' ? styles.metalActive : ''}`}
                          style={{ background: '#e0e0e0' }}
                          onClick={() => setSelectedMetal('white')}
                          title="طلای سفید ۱۸ عیار"
                        />
                        <button
                          type="button"
                          className={`${styles.metalDot} ${selectedMetal === 'rose' ? styles.metalActive : ''}`}
                          style={{ background: '#b76e79' }}
                          onClick={() => setSelectedMetal('rose')}
                          title="رزگلد فاخر"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Information Section */}
                  <div className={styles.modalInfoWrapper}>
                    <h3 className={styles.modalTitle}>{selectedProduct.name}</h3>
                    <div className={styles.modalPrice}>{selectedProduct.price} تومان</div>

                    <div className={styles.certBanner}>
                      <Award size={18} style={{ color: 'var(--accent)' }} />
                      <div className={styles.certCodeInfo}>
                        <span>کد شناسنامه بین‌المللی:</span>
                        <strong>{selectedProduct.certCode}</strong>
                      </div>
                      <button
                        type="button"
                        className={styles.copyCertBtn}
                        onClick={() => copyCertCode(selectedProduct.certCode)}
                        title="کپی شناسه GIA"
                      >
                        {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div className={styles.tabsNav}>
                      <button
                        type="button"
                        className={`${styles.tabBtn} ${modalTab === 'specs' ? styles.tabActive : ''}`}
                        onClick={() => setModalTab('specs')}
                      >
                        مشخصات فنی
                      </button>
                      <button
                        type="button"
                        className={`${styles.tabBtn} ${modalTab === 'warranty' ? styles.tabActive : ''}`}
                        onClick={() => setModalTab('warranty')}
                      >
                        ضمانت و ارسال
                      </button>
                      <button
                        type="button"
                        className={`${styles.tabBtn} ${modalTab === 'vip' ? styles.tabActive : ''}`}
                        onClick={() => setModalTab('vip')}
                      >
                        مشاوره VIP
                      </button>
                    </div>

                    <div className={styles.tabContentArea}>
                      {modalTab === 'specs' && (
                        <div className={styles.specsList}>
                          <div className={styles.specRow}>
                            <span>نوع گوهرسنگ:</span>
                            <strong>{selectedProduct.gemType}</strong>
                          </div>
                          <div className={styles.specRow}>
                            <span>وزن طلا:</span>
                            <strong>{selectedProduct.weightGold}</strong>
                          </div>
                          <div className={styles.specRow}>
                            <span>وزن سنگ اصلی:</span>
                            <strong>{selectedProduct.carat}</strong>
                          </div>
                          <div className={styles.specRow}>
                            <span>پایه و عیار طلا:</span>
                            <strong>
                              {selectedMetal === 'yellow'
                                ? 'طلای زرد ۱۸ عیار (۷۵۰)'
                                : selectedMetal === 'white'
                                ? 'طلای سفید ۱۸ عیار (۷۵۰)'
                                : 'رزگلد ۱۸ عیار (۷۵۰)'}
                            </strong>
                          </div>
                          <p className={styles.modalDesc}>{selectedProduct.description}</p>
                        </div>
                      )}

                      {modalTab === 'warranty' && (
                        <div className={styles.warrantyBox}>
                          <div className={styles.warrantyItem}>
                            <ShieldCheck size={16} />
                            <span>ضمانت ۱۰۰٪ اصالت سنگ و عیار طلا با شناسنامه معتبر</span>
                          </div>
                          <div className={styles.warrantyItem}>
                            <Truck size={16} />
                            <span>تحویل توسط تیم حمل امنیتی و بیمه تا درب منزل</span>
                          </div>
                          <div className={styles.warrantyItem}>
                            <Gift size={16} />
                            <span>همراه با جعبه چرمی کلکسیونی و کارت ضمانت مادام‌العمر</span>
                          </div>
                        </div>
                      )}

                      {modalTab === 'vip' && (
                        <form onSubmit={handleVipSubmit} className={styles.vipForm}>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            جهت پرو حضوری در شوروم خصوصی یا مشاوره اختصاصی شماره خود را وارد کنید:
                          </p>
                          <div className={styles.vipFormFields}>
                            <input
                              type="tel"
                              required
                              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                              className={styles.vipInput}
                            />
                            <button type="submit" className={styles.vipSubmitBtn}>
                              {vipSuccess ? <Check size={16} /> : 'ثبت درخواست'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className={styles.modalFooterActions}>
                      <button
                        type="button"
                        className={styles.modalAddCartBtn}
                        onClick={() => {
                          handleAddToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                      >
                        <ShoppingCart size={17} />
                        <span>افزودن به سبد خرید</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.modalWishlistBtn} ${isWishlisted(selectedProduct.id) ? styles.wishlistActive : ''}`}
                        onClick={() => toggleWishlist(selectedProduct)}
                      >
                        <Heart size={18} fill={isWishlisted(selectedProduct.id) ? '#ef4444' : 'none'} color={isWishlisted(selectedProduct.id) ? '#ef4444' : 'currentColor'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.85, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={styles.toastBox}
          >
            <CheckCircle size={20} style={{ color: 'var(--accent)' }} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LuxuryCollection;