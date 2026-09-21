import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link , useSearchParams, useParams, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Filter,
  Search,
  Heart,
  ShoppingCart,
  Eye,
  Check,
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  Award,
  RotateCcw,
  Ruler,
  Gift,
  Star,
  X,
  Zap,
  CheckCircle2,
  MessageCircle,
  Grid,
  List,
  ArrowUpDown,
  Flame,
  ChevronDown,
  Info,
  PhoneCall,
  Lock,
  Sparkle,
  Layers,
} from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';
import { ImageZoom } from '../components/ImageZoom/ImageZoom';
import styles from './CollectionsPage.module.css';


// Import Ring Images
import mensWeddingBandImg from '../assets/images/Gemini_Generated_Image_owrj33owrj33owrj (1).webp';
import emeraldRingImg from '../assets/images/Gemini_Generated_Image_t3b3pct3b3pct3b3.webp';
import rubyRingImg from '../assets/images/Gemini_Generated_Image_raa8soraa8soraa8.webp';
import roseGoldRingImg from '../assets/images/Gemini_Generated_Image_hw2516hw2516hw25.webp';
import diamondRingImgs from '../assets/images/Gemini_Generated_Image_b2a6z6b2a6z6b2a6.webp';
import isolatedWeddingRingImg from '../assets/images/Gemini_Generated_Image_xwcx5uxwcx5uxwcx.webp';
import isolatedRingImg from '../assets/images/ChatGPT Image Aug 8, 2026, 03_09_42 PM.webp';
import vintageRingImg from '../assets/images/Gemini_Generated_Image_6by9ww6by9ww6by9.webp';
import blackDiamondRingImg from '../assets/images/Gemini_Generated_Image_lbpu5elbpu5elbpu.webp';
import sapphireRingImg from '../assets/images/Gemini_Generated_Image_58u9x458u9x458u9.webp';
import weddingRingHeroImg from '../assets/images/ChatGPT Image Aug 8, 2026, 03_11_55 PM.webp';
import hoopEarringsImg from '../assets/images/Gemini_Generated_Image_lq3o2xlq3o2xlq3o.webp';
import emeraldearringImg from '../assets/images/Gemini_Generated_Image_7qekzf7qekzf7qek.webp' ;
import rubyearringImg from '../assets/images/Gemini_Generated_Image_hhzroihhzroihhzr.webp' ;
import diamondearRingImg from '../assets/images/Gemini_Generated_Image_aiwfvfaiwfvfaiwf.webp';
import roseGoldEarRingImg from '../assets/images/Gemini_Generated_Image_s18mdns18mdns18m (1).webp'
import amethystNecklaceImg from '../assets/images/Gemini_Generated_Image_glzlgdglzlgdglzl.webp';
import rubyBerlianImg from '../assets/images/Gemini_Generated_Image_t45la7t45la7t45l.webp';
import pearlNecklaceImg from '../assets/images/Gemini_Generated_Image_hqa9erhqa9erhqa9.webp';

// Helper to convert numbers to Persian digits
const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

// Helper to format currency in Persian
const formatPersianCurrency = (priceNum) => {
  if (!priceNum) return '';
  const formatted = new Intl.NumberFormat('fa-IR').format(priceNum);
  return formatted;
};

// Calculate adjusted price based on ring size selection
const getSizeAdjustedPrice = (basePriceNum, size) => {
  const multipliers = {
    '48': 0.96,
    '50': 0.98,
    '52': 1.00,
    '54': 1.00,
    '56': 1.02,
    '58': 1.04,
    '60': 1.06,
    '62': 1.08,
  };
  const mult = multipliers[size] || 1.0;
  return Math.round(basePriceNum * mult);
};

export default function CollectionsPage() {
  const { collectionProducts } = useProducts();
  const RINGS_DATA = collectionProducts;
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const { category: routeCategory } = useParams();
  const location = useLocation();

  // State Management
  const initialCat = routeCategory || searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedMetal, setSelectedMetal] = useState('all');

  // Auto scroll to top on mount / location change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  // Sync category if URL param changes
  useEffect(() => {
    const cat = routeCategory || searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [routeCategory, searchParams]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('bestselling');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRingForModal, setSelectedRingForModal] = useState(null);
  const [addedToCartToast, setAddedToCartToast] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState('54');
  const [engravingText, setEngravingText] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Custom Dropdown States
  const [metalDropdownOpen, setMetalDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Modal Image Zoom State
  const [modalZoomPos, setModalZoomPos] = useState({ x: 50, y: 50 });
  const [isModalZooming, setIsModalZooming] = useState(false);

  // Refs for closing custom dropdowns on outside click
  const metalDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (metalDropdownRef.current && !metalDropdownRef.current.contains(event.target)) {
        setMetalDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Category Filters Definition
  const categories = [
    { id: 'all', label: 'همه کلکسیون‌ها', count: RINGS_DATA.length, icon: '✨' },
    { id: 'rings', label: 'حلقه‌ها', count: RINGS_DATA.filter((r) => ['rings', 'solitaire', 'gemstone', 'wedding', 'vintage', 'mens'].includes(r.category)).length, icon: '💍' },
    { id: 'earrings', label: 'گوشواره‌ها', count: RINGS_DATA.filter((r) => r.category === 'earrings').length, icon: '✨' },
    { id: 'necklaces', label: 'مدال‌ها', count: RINGS_DATA.filter((r) => r.category === 'necklaces').length, icon: '📿' },
  ];

  // Metals Filter Definition
  const metals = [
    { id: 'all', label: 'همه فلزات', icon: '✨' },
    { id: 'whiteGold', label: 'طلای سفید ۱۸ عیار', icon: '⚪' },
    { id: 'yellowGold', label: 'طلای زرد ۱۸ عیار', icon: '🟡' },
    { id: 'roseGold', label: 'رزگلد ایتالیایی', icon: '🌸' },
    { id: 'platinum', label: 'پلاتین خالص PT950', icon: '💎' },
  ];

  // Sort Options Definition
  const sortOptions = [
    { id: 'bestselling', label: 'مرتب‌سازی: پرفروش‌ترین‌ها' },
    { id: 'price-low', label: 'قیمت: از کم به زیاد' },
    { id: 'price-high', label: 'قیمت: از زیاد به کم' },
    { id: 'discount', label: 'بیشترین تخفیف' },
    { id: 'rating', label: 'بالاترین امتیاز مشتریان' },
  ];

  // Filter & Sort Logic
  const filteredRings = useMemo(() => {
    return RINGS_DATA.filter((ring) => {
      let matchesCategory = false;
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (selectedCategory === 'rings') {
        matchesCategory = ['rings', 'solitaire', 'gemstone', 'wedding', 'vintage', 'mens'].includes(ring.category);
      } else {
        matchesCategory = ring.category === selectedCategory;
      }

      const matchesMetal = selectedMetal === 'all' || ring.metalType === selectedMetal;
      const matchesSearch =
        ring.name.includes(searchQuery) ||
        ring.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ring.diamondInfo.includes(searchQuery) ||
        ring.metal.includes(searchQuery);

      return matchesCategory && matchesMetal && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.priceNum - b.priceNum;
      if (sortBy === 'price-high') return b.priceNum - a.priceNum;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [selectedCategory, selectedMetal, searchQuery, sortBy]);

  // Handle Add To Cart with Toast Feedback
  const handleAddToCart = (ring, e, customPrice) => {
    if (e) e.stopPropagation();
    const finalPrice = customPrice ? customPrice : ring.price;
    addToCart({
      id: ring.id,
      name: ring.name,
      price: finalPrice,
      image: ring.image,
      size: selectedRingSize,
      engraving: engravingText,
    });
    setAddedToCartToast(ring.name);
    setTimeout(() => {
      setAddedToCartToast(null);
    }, 3500);
  };

  // Scroll Animations Variants for Top, Bottom, Left, Right
  const animVariants = {
    fromTop: {
      initial: { opacity: 0, y: -40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: false, amount: 0.1 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    fromBottom: {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: false, amount: 0.1 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    fromLeft: {
      initial: { opacity: 0, x: -50 },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: false, amount: 0.1 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    fromRight: {
      initial: { opacity: 0, x: 50 },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: false, amount: 0.1 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Mouse move handler for modal image zoom
  const handleModalMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setModalZoomPos({ x, y });
  };

  // Selected Metal Label
  const currentMetalObj = metals.find((m) => m.id === selectedMetal) || metals[0];
  // Selected Sort Label
  const currentSortObj = sortOptions.find((s) => s.id === sortBy) || sortOptions[0];

  // Dynamic Hero Title and Subtitle based on selected category
  const getHeroDetails = () => {
    if (selectedCategory === 'earrings') {
      return {
        title: <>کلکسیون فاخر <span className={styles.goldGlowText}>گوشواره‌های برلیان</span> & گوهرسنگ</>,
        subtitle: `مجموعه‌ای بی‌نظیر از گوشواره‌های حلقه‌ای، میخی، آویز و الماس سلطنتی با تراش‌های استثنایی و قفل‌های ایمن طلای ۱۸ عیار همراه با شناسنامه بین‌المللی GIA.`
      };
    }
    if (selectedCategory === 'necklaces') {
      return {
        title: <>کلکسیون اختصاصی <span className={styles.goldGlowText}>مدال‌ها & گردنبندهای</span> فاخر</>,
        subtitle: `مدال‌های سلطنتی، آویزهای یاقوت برمه و زمرد کلمبیا و طوق‌های مروارید جنوب دریا با زنجیر طلای ۱۸ عیار و درخشش بی‌نظیر.`
      };
    }
    if (selectedCategory === 'rings') {
      return {
        title: <>مجموعه اختصاصی <span className={styles.goldGlowText}>حلقه‌ها & تک‌نگین‌های</span> فاخر</>,
        subtitle: `مجموعه‌ای بی‌نظیر از حلقه‌های سولیتیر، تک‌نگین برلیان، حلقه ازدواج و انگشترهای گوهرسنگ اصیل همراه با شناسنامه بین‌المللی.`
      };
    }
    return {
      title: <>شاهکارهای ماندگار <span className={styles.goldGlowText}>طلا & جواهرات</span> گالری فرشته</>,
      subtitle: `مجموعه‌ای بی‌نظیر از ${toPersianDigits(RINGS_DATA.length)} شاهکار دست‌ساز از حلقه‌ها، گوشواره‌ها و مدال‌های طلا و الماس با شناسنامه بین‌المللی.`
    };
  };

  const heroDetails = getHeroDetails();

  return (
    <div className={styles.collectionsPage}>
      {/* Toast Notification when adding to cart */}
      <AnimatePresence>
        {addedToCartToast && (
          <motion.div
            className={styles.cartToast}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
          >
            <CheckCircle2 size={22} className={styles.toastIcon} />
            <div>
              <strong>«{addedToCartToast}»</strong> به سبد خرید اضافه شد.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO / BANNER SECTION - Clean Glass Theme Matching Site */}
      <section className={styles.heroBanner}>
        <div className={styles.heroGlowEffect} />
        <div className={styles.container}>
          <motion.div
            className={styles.heroContent}
            initial={animVariants.fromTop.initial}
            whileInView={animVariants.fromTop.whileInView}
            viewport={animVariants.fromTop.viewport}
            transition={animVariants.fromTop.transition}
          >
            <div className={styles.heroBadge}>
              <Sparkles size={16} />
              <span>شاهکارهای ماندگار - گالری فرشته</span>
            </div>
            <h1 className={styles.heroTitle}>
              {heroDetails.title}
            </h1>
            <p className={styles.heroSubtitle}>
              {heroDetails.subtitle}
            </p>

            {/* Quick Guarantees Bar */}
            <motion.div
              className={styles.guaranteeBar}
              initial={animVariants.fromBottom.initial}
              whileInView={animVariants.fromBottom.whileInView}
              viewport={animVariants.fromBottom.viewport}
              transition={{ ...animVariants.fromBottom.transition, delay: 0.2 }}
            >
              <div className={styles.guaranteeItem}>
                <ShieldCheck size={20} className={styles.guaranteeIcon} />
                <span>۱۰۰٪ طلا & الماس شناسنامه‌دار GIA</span>
              </div>
              <div className={styles.guaranteeDivider} />
              <div className={styles.guaranteeItem}>
                <Truck size={20} className={styles.guaranteeIcon} />
                <span>ارسال ایمن اختصاصی همراه بیمه</span>
              </div>
              <div className={styles.guaranteeDivider} />
              <div className={styles.guaranteeItem}>
                <RotateCcw size={20} className={styles.guaranteeIcon} />
                <span>ضمانت تعویض و بازخرید رسمی</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. FILTER & TOOLBAR SECTION */}
      <section className={styles.toolbarSection}>
        <div className={styles.container}>
          {/* Category Tabs */}
          <motion.div
            className={styles.categoryPillsWrapper}
            initial={animVariants.fromRight.initial}
            whileInView={animVariants.fromRight.whileInView}
            viewport={animVariants.fromRight.viewport}
            transition={animVariants.fromRight.transition}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.catPill} ${selectedCategory === cat.id ? styles.activeCatPill : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className={styles.catPillIcon}>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={styles.catCountBadge}>{toPersianDigits(cat.count)}</span>
              </button>
            ))}
          </motion.div>

          {/* Controls Bar: Search, Custom Metal Select, Custom Sort Select, View Toggle */}
          <motion.div
            className={styles.controlsBar}
            initial={animVariants.fromLeft.initial}
            whileInView={animVariants.fromLeft.whileInView}
            viewport={animVariants.fromLeft.viewport}
            transition={{ ...animVariants.fromLeft.transition, delay: 0.15 }}
          >
            {/* Search Input */}
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="جستجوی حلقه، الماس، زمرد، عیار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearchBtn}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Custom Styled Metals Dropdown */}
            <div className={styles.customSelectWrapper} ref={metalDropdownRef}>
              <button
                type="button"
                className={styles.customSelectHeader}
                onClick={() => {
                  setMetalDropdownOpen(!metalDropdownOpen);
                  setSortDropdownOpen(false);
                }}
              >
                <SlidersHorizontal size={16} className={styles.filterIcon} />
                <span>{currentMetalObj.label}</span>
                <ChevronDown
                  size={16}
                  className={`${styles.dropdownChevron} ${metalDropdownOpen ? styles.rotatedChevron : ''}`}
                />
              </button>

              <AnimatePresence>
                {metalDropdownOpen && (
                  <motion.div
                    className={styles.customSelectMenu}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    {metals.map((m) => (
                      <div
                        key={m.id}
                        className={`${styles.customOptionItem} ${selectedMetal === m.id ? styles.selectedOption : ''}`}
                        onClick={() => {
                          setSelectedMetal(m.id);
                          setMetalDropdownOpen(false);
                        }}
                      >
                        <span className={styles.optionIcon}>{m.icon}</span>
                        <span>{m.label}</span>
                        {selectedMetal === m.id && <Check size={14} className={styles.optionCheck} />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Styled Sort Dropdown */}
            <div className={styles.customSelectWrapper} ref={sortDropdownRef}>
              <button
                type="button"
                className={styles.customSelectHeader}
                onClick={() => {
                  setSortDropdownOpen(!sortDropdownOpen);
                  setMetalDropdownOpen(false);
                }}
              >
                <ArrowUpDown size={16} className={styles.filterIcon} />
                <span>{currentSortObj.label}</span>
                <ChevronDown
                  size={16}
                  className={`${styles.dropdownChevron} ${sortDropdownOpen ? styles.rotatedChevron : ''}`}
                />
              </button>

              <AnimatePresence>
                {sortDropdownOpen && (
                  <motion.div
                    className={styles.customSelectMenu}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    {sortOptions.map((s) => (
                      <div
                        key={s.id}
                        className={`${styles.customOptionItem} ${sortBy === s.id ? styles.selectedOption : ''}`}
                        onClick={() => {
                          setSortBy(s.id);
                          setSortDropdownOpen(false);
                        }}
                      >
                        <span>{s.label}</span>
                        {sortBy === s.id && <Check size={14} className={styles.optionCheck} />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Grid/List Mode Toggle */}
            <div className={styles.viewModeToggle}>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeViewBtn : ''}`}
                onClick={() => setViewMode('grid')}
                title="نمایش شبکه‌ای"
              >
                <Grid size={18} />
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeViewBtn : ''}`}
                onClick={() => setViewMode('list')}
                title="نمایش لیستی"
              >
                <List size={18} />
              </button>
            </div>
          </motion.div>

          {/* Results Summary with Persian Numbers */}
          <div className={styles.resultsCountText}>
            نمایش <strong>{toPersianDigits(filteredRings.length)}</strong> عدد از مجموع {toPersianDigits(RINGS_DATA.length)} حلقه فاخر گالری
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS GRID SECTION */}
      <section className={styles.productsGridSection}>
        <div className={styles.container}>
          {filteredRings.length === 0 ? (
            <motion.div
              className={styles.noResultsBox}
              initial={animVariants.fromBottom.initial}
              whileInView={animVariants.fromBottom.whileInView}
            >
              <span style={{ fontSize: '3rem' }}>💎</span>
              <h3>هیچ حلقه‌ای با این مشخصات یافت نشد</h3>
              <p>لطفاً عبارات جستجو یا فیلترهای انتخابی را تغییر دهید.</p>
              <button
                type="button"
                className={styles.resetFiltersBtn}
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMetal('all');
                  setSearchQuery('');
                }}
              >
                بازنشانی همه فیلترها
              </button>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' ? styles.ringsGrid : styles.ringsList}>
              {filteredRings.map((ring, index) => {
                const inWishlist = isInWishlist(ring.id);
                const cardAnim = index % 2 === 0 ? animVariants.fromLeft : animVariants.fromRight;

                if (viewMode === 'list') {
                  // LIST VIEW LAYOUT (طولانی طوری - تمیز، بدون هم‌پوشانی و بدون کپشن‌های اضافی)
                  return (
                    <motion.div
                      key={ring.id}
                      className={styles.ringListItem}
                      initial={cardAnim.initial}
                      whileInView={cardAnim.whileInView}
                      viewport={cardAnim.viewport}
                      transition={{ ...cardAnim.transition, delay: (index % 4) * 0.1 }}
                    >
                      {/* Image Area with Large Dimensions & Hover Zoom */}
                      <div
                        className={styles.listImgWrapper}
                        onClick={() => setSelectedRingForModal(ring)}
                      >
                        <ImageZoom
                          src={ring.image}
                          alt={ring.name}
                          zoomLevel={2.5}
                          showHint={true}
                        />
                      </div>

                      {/* Content Area */}
                      <div className={styles.listContentBody}>
                        <div className={styles.listHeaderRow}>
                          <div>
                            <span className={styles.catLabel}>{ring.categoryLabel}</span>
                            <h3
                              className={styles.ringTitle}
                              onClick={() => setSelectedRingForModal(ring)}
                            >
                              {ring.name}
                            </h3>
                            <div className={styles.englishSubName}>{ring.englishName}</div>
                          </div>

                          <div className={styles.ratingBox}>
                            <Star size={14} fill="#d4af37" color="#d4af37" />
                            <span>{toPersianDigits(ring.rating)}</span>
                            <span className={styles.reviewsText}>
                              ({toPersianDigits(ring.reviewsCount)} نظر)
                            </span>
                          </div>
                        </div>

                        {/* Badges Row - Clean positioning */}
                        <div className={styles.listBadgesRow}>
                          {ring.badges.map((b, idx) => (
                            <span key={idx} className={styles.cardBadge}>
                              {b}
                            </span>
                          ))}
                          {ring.stock <= 2 && (
                            <span className={styles.stockUrgencyPill}>
                              <Flame size={12} />
                              تنها {toPersianDigits(ring.stock)} عدد باقی مانده
                            </span>
                          )}
                        </div>

                        {/* Technical Specs - Clean alignment without gaps */}
                        <div className={styles.listSpecsRow}>
                          <div className={styles.listSpecItem}>
                            <span className={styles.specLabel}>نوع فلز:</span>
                            <strong className={styles.specValue}>{ring.metal}</strong>
                          </div>
                          <div className={styles.listSpecItem}>
                            <span className={styles.specLabel}>مشخصات نگین:</span>
                            <strong className={styles.specValue}>{ring.diamondInfo}</strong>
                          </div>
                          <div className={styles.listSpecItem}>
                            <span className={styles.specLabel}>عیار:</span>
                            <strong className={styles.specValue}>{ring.purity}</strong>
                          </div>
                        </div>

                        {/* Price & Actions Row */}
                        <div className={styles.listFooterRow}>
                          <div className={styles.priceWrapper}>
                            {ring.oldPrice && (
                              <span className={styles.oldPrice}>{ring.oldPrice} تومان</span>
                            )}
                            <div className={styles.currentPrice}>
                              {ring.price} <span className={styles.tomanUnit}>تومان</span>
                            </div>
                          </div>

                          <div className={styles.listActionsGroup}>
                            <button
                              type="button"
                              className={`${styles.actionBtnList} ${inWishlist ? styles.activeHeart : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(ring);
                              }}
                              title={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                            >
                              <Heart size={18} fill={inWishlist ? '#ff4d4d' : 'none'} />
                            </button>

                            <button
                              type="button"
                              className={styles.quickDetailBtn}
                              onClick={() => setSelectedRingForModal(ring)}
                            >
                              <Eye size={16} />
                              <span>جزئیات</span>
                            </button>

                            <button
                              type="button"
                              className={styles.addToCartBtn}
                              onClick={(e) => handleAddToCart(ring, e)}
                            >
                              <ShoppingCart size={18} />
                              <span>افزودن به سبد</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // GRID VIEW LAYOUT
                return (
                  <motion.div
                    key={ring.id}
                    className={styles.ringCard}
                    initial={cardAnim.initial}
                    whileInView={cardAnim.whileInView}
                    viewport={cardAnim.viewport}
                    transition={{ ...cardAnim.transition, delay: (index % 4) * 0.1 }}
                  >
                    {/* Card Image Area */}
                    <div
                      className={styles.cardImgContainer}
                      onClick={() => setSelectedRingForModal(ring)}
                    >
                      <ImageZoom
                        src={ring.image}
                        alt={ring.name}
                        zoomLevel={2.5}
                        showHint={true}
                      />
                      <div className={styles.imgOverlayGlow} />

                      {/* Top Badges */}
                      <div className={styles.badgeGroup}>
                        {ring.badges.map((b, idx) => (
                          <span key={idx} className={styles.cardBadge}>
                            {b}
                          </span>
                        ))}
                      </div>

                      {/* Urgency Stock Pulse */}
                      {ring.stock <= 2 && (
                        <div className={styles.stockUrgencyBadge}>
                          <Flame size={13} className={styles.flameIcon} />
                          <span>تنها {toPersianDigits(ring.stock)} عدد باقی مانده</span>
                        </div>
                      )}

                      {/* Floating Action Buttons - High Contrast Glass Buttons */}
                      <div className={styles.cardActionsOverlay}>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${inWishlist ? styles.activeHeart : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(ring);
                          }}
                          title={inWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                        >
                          <Heart size={18} fill={inWishlist ? '#ff4d4d' : 'none'} />
                        </button>

                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRingForModal(ring);
                          }}
                          title="پیش‌نمایش سریع & مشخصات"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body Information */}
                    <div className={styles.cardBody}>
                      <div className={styles.cardCategoryHeader}>
                        <span className={styles.catLabel}>{ring.categoryLabel}</span>
                        <div className={styles.ratingBox}>
                          <Star size={13} fill="#d4af37" color="#d4af37" />
                          <span>{toPersianDigits(ring.rating)}</span>
                          <span className={styles.reviewsText}>
                            ({toPersianDigits(ring.reviewsCount)})
                          </span>
                        </div>
                      </div>

                      <h3
                        className={styles.ringTitle}
                        onClick={() => setSelectedRingForModal(ring)}
                      >
                        {ring.name}
                      </h3>
                      <div className={styles.englishSubName}>{ring.englishName}</div>

                      {/* Technical Specs Summary */}
                      <div className={styles.specsCompact}>
                        <div className={styles.specTag}>
                          <span className={styles.specLabel}>فلز:</span>
                          <strong className={styles.specVal}>{ring.metal}</strong>
                        </div>
                        <div className={styles.specTag}>
                          <span className={styles.specLabel}>نگین:</span>
                          <strong className={styles.specVal}>{ring.diamondInfo}</strong>
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className={styles.priceRow}>
                        <div className={styles.priceWrapper}>
                          {ring.oldPrice && (
                            <span className={styles.oldPrice}>{ring.oldPrice} تومان</span>
                          )}
                          <div className={styles.currentPrice}>
                            {ring.price} <span className={styles.tomanUnit}>تومان</span>
                          </div>
                        </div>

                        {ring.discountPercent > 0 && (
                          <span className={styles.discountBadge}>
                            %{toPersianDigits(ring.discountPercent)} تخفیف
                          </span>
                        )}
                      </div>

                      {/* Installment Hint */}
                      <div className={styles.installmentHint}>
                        <Zap size={13} color="var(--accent)" />
                        <span>اقساطی: ۴ قسط {ring.installmentPrice} تومانی بدون کارمزد</span>
                      </div>

                      {/* Primary Call To Action Buttons */}
                      <div className={styles.cardButtonsRow}>
                        <button
                          type="button"
                          className={styles.addToCartBtn}
                          onClick={(e) => handleAddToCart(ring, e)}
                        >
                          <ShoppingCart size={18} />
                          <span>افزودن به سبد خرید</span>
                        </button>

                        <button
                          type="button"
                          className={styles.quickDetailBtn}
                          onClick={() => setSelectedRingForModal(ring)}
                        >
                          <span>دیدن جزئیات</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. INTERACTIVE RING SIZE GUIDE SECTION - Transparent Glass Gradient */}
      <section className={styles.sizeGuideSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sizeGuideBox}
            initial={animVariants.fromBottom.initial}
            whileInView={animVariants.fromBottom.whileInView}
            viewport={animVariants.fromBottom.viewport}
            transition={animVariants.fromBottom.transition}
          >
            <div className={styles.sizeGuideText}>
              <div className={styles.goldBadgeCompact}>
                <Ruler size={16} />
                <span>راهنمای سایزگیری آکادمیک</span>
              </div>
              <h2>نمی‌دانید سایز انگشتر شما چند است؟</h2>
              <p>
                با راهنمای اختصاصی گالری فرشته، سایز دقیق دور انگشت خود را در کمتر از ۱ دقیقه اندازه‌گیری کنید.
                همچنین امکان ارسال رایگان حلقه سایزگیری به درب منزل شما وجود دارد.
              </p>
              <div className={styles.sizeButtonsGroup}>
                <button
                  type="button"
                  className={styles.sizeGuideTriggerBtn}
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                >
                  <Ruler size={18} />
                  <span>{showSizeGuide ? 'بستن راهنما' : 'مشاهده جدول و آموزش سایزگیری'}</span>
                </button>

                <a
                  href="https://wa.me/989121111111?text=سلام،%20درخواست%20ارسال%20رایگان%20حلقه%20سایزگیری%20دارم"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappConsultBtn}
                >
                  <MessageCircle size={18} />
                  <span>درخواست حلقه سایزگیری رایگان در واتس‌اپ</span>
                </a>
              </div>
            </div>

            {/* Expandable Size Guide Content */}
            <AnimatePresence>
              {showSizeGuide && (
                <motion.div
                  className={styles.expandedSizeTable}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.sizeStepsGrid}>
                    <div className={styles.stepCard}>
                      <span className={styles.stepNum}>۱</span>
                      <h4>اندازه‌گیری با نخ</h4>
                      <p>یک نخ یا نوار کاغذی محکم را دور مفصل انگشت خود بپیچید و محل تلاقی را علامت بزنید.</p>
                    </div>
                    <div className={styles.stepCard}>
                      <span className={styles.stepNum}>۲</span>
                      <h4>اندازه‌گیری میلی‌متری</h4>
                      <p>طول نخ علامت‌زده شده را با خط‌کش سانتیمتری به دقت میلی‌متر اندازه بگیرید.</p>
                    </div>
                    <div className={styles.stepCard}>
                      <span className={styles.stepNum}>۳</span>
                      <h4>تطبیق با جدول</h4>
                      <p>عدد به‌دست آمده (محیط انگشت) را با جدول سایزهای استاندارد مقایسه کنید (مثلاً ۵۴ میلی‌متر = سایز ۱۴).</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 5. CUSTOM ORDER / VIP CRAFTING BANNER */}
      <section className={styles.customOrderSection}>
        <div className={styles.container}>
          <div className={styles.customOrderGrid}>
            <motion.div
              className={styles.customOrderLeft}
              initial={animVariants.fromLeft.initial}
              whileInView={animVariants.fromLeft.whileInView}
              viewport={animVariants.fromLeft.viewport}
              transition={animVariants.fromLeft.transition}
            >
              <div className={styles.goldBadgeCompact}>
                <Gift size={16} />
                <span>طراحی سفارشی اختصاصی</span>
              </div>
              <h2>طراحی و ساخت حلقه رویایی شما از روی عکس یا ایده شخص شما</h2>
              <p>
                اگر مدل خاصی از برندهای مطرح دنیا (مانند Cartier, Tiffany, Graff) مد نظرتان است،
                استادکاران گالری فرشته با طلای ۱۸ عیار و الماس‌های شناسنامه‌دار آن را دقیقا مطابق با سلیقه شما طراحی و می‌سازند.
              </p>

              <div className={styles.vipPerksList}>
                <div className={styles.perkItem}>
                  <CheckCircle2 size={18} color="var(--accent)" />
                  <span>طراحی سه‌بعدی (3D CAD) پیش از ساخت و ارائه رندر حرفه‌ای</span>
                </div>
                <div className={styles.perkItem}>
                  <CheckCircle2 size={18} color="var(--accent)" />
                  <span>انتخاب آزادانه تراش، رنگ و درجه پاکی الماس با حضور خریدار</span>
                </div>
                <div className={styles.perkItem}>
                  <CheckCircle2 size={18} color="var(--accent)" />
                  <span>حکاکی اختصاصی جملات عاشقانه، تاریخ و اثر انگشت داخل رکاب</span>
                </div>
              </div>

              <div className={styles.customActionsRow}>
                <Link
                  to="/contact"
                  className={styles.customOrderPrimaryBtn}
                >
                  <PhoneCall size={18} />
                  <span>رزرو وقت مشاوره حضوری در شو روم الهیه</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className={styles.customOrderRightCard}
              initial={animVariants.fromRight.initial}
              whileInView={animVariants.fromRight.whileInView}
              viewport={animVariants.fromRight.viewport}
              transition={animVariants.fromRight.transition}
            >
              <div className={styles.artisanCardBadge}>
                <Sparkles size={18} />
                <span>کارگاه ساخت طلا و جواهر فرشته</span>
              </div>
              <img
                src={weddingRingHeroImg}
                alt="کارگاه ساخت سفارشی حلقه فرشته"
                className={styles.artisanImg}
              />
              <div className={styles.artisanOverlayText}>
                <strong>تحویل ۱۰ روزه سفارشات ساخت سفارشی</strong>
                <span>همراه با شناسنامه اصالت بین‌المللی و ضمانت تعویض مادام‌العمر</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. LUXURY QUICK VIEW MODAL - Clean Scrollbar & Dynamic Price by Ring Size */}
      <AnimatePresence>
        {selectedRingForModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedRingForModal(null)}
          >
            <motion.div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Prominent High-Contrast Close Button */}
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedRingForModal(null)}
                aria-label="بستن پنجره"
              >
                <X size={22} />
              </button>

              <div className={styles.modalGrid}>
                {/* Modal Image Frame with elegant padding and rounded corners */}
                <div className={styles.modalImgFrame}>
                  <div className={styles.modalImgWrapper}>
                    <ImageZoom
                      src={selectedRingForModal.image}
                      alt={selectedRingForModal.name}
                      zoomLevel={2.8}
                      showHint={true}
                    />

                    <div className={styles.modalBadgesRow}>
                      {selectedRingForModal.badges.map((b, idx) => (
                        <span key={idx} className={styles.modalBadge}>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Details & Dynamic Price Section */}
                <div className={styles.modalDetails}>
                  <div className={styles.modalCategoryLabel}>
                    {selectedRingForModal.categoryLabel}
                  </div>
                  <h2 className={styles.modalTitle}>{selectedRingForModal.name}</h2>
                  <div className={styles.modalSubTitle}>{selectedRingForModal.englishName}</div>

                  <p className={styles.modalDesc}>{selectedRingForModal.description}</p>

                  {/* Technical Specs Grid */}
                  <div className={styles.modalSpecsGrid}>
                    <div className={styles.modalSpecItem}>
                      <span>نوع فلز:</span>
                      <strong>{selectedRingForModal.metal}</strong>
                    </div>
                    <div className={styles.modalSpecItem}>
                      <span>مشخصات سنگ:</span>
                      <strong>{selectedRingForModal.diamondInfo}</strong>
                    </div>
                    <div className={styles.modalSpecItem}>
                      <span>عیار طلا:</span>
                      <strong>{selectedRingForModal.purity}</strong>
                    </div>
                    <div className={styles.modalSpecItem}>
                      <span>موجودی انبار:</span>
                      <strong style={{ color: selectedRingForModal.stock <= 2 ? '#ff6b6b' : '#51cf66' }}>
                        {toPersianDigits(selectedRingForModal.stock)} عدد موجود
                      </strong>
                    </div>
                  </div>

                  {/* Interactive Option Picker Section with Price Impact */}
                  <div className={styles.sizePickerSection}>
                    <div className={styles.pickerHeaderRow}>
                      <label className={styles.pickerLabel}>
                        <Ruler size={15} />
                        <span>
                          {selectedRingForModal.category === 'earrings'
                            ? 'نوع قفل و گیره گوشواره:'
                            : selectedRingForModal.category === 'necklaces'
                            ? 'طول زنجیر (سانتی‌متر):'
                            : selectedRingForModal.category === 'bracelets'
                            ? 'سایز مچ دست:'
                            : 'انتخاب سایز انگشتر:'}
                        </span>
                      </label>
                      {['earrings', 'necklaces', 'bracelets'].includes(selectedRingForModal.category) ? null : (
                        <span className={styles.sizePriceHint}>
                          (سایزهای بزرگتر شامل وزن طلای بیشتر)
                        </span>
                      )}
                    </div>

                    <div className={styles.sizeOptionsGrid}>
                      {selectedRingForModal.category === 'earrings' ? (
                        ['قفل اهرمی محکم', 'قفل میخی سوزنی', 'قفل فرانسوی'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`${styles.sizeBtn} ${selectedRingSize === opt ? styles.activeSizeBtn : ''}`}
                            onClick={() => setSelectedRingSize(opt)}
                          >
                            {opt}
                          </button>
                        ))
                      ) : selectedRingForModal.category === 'necklaces' ? (
                        ['۴۰ سانتی‌متر', '۴۵ سانتی‌متر', '۵۰ سانتی‌متر'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`${styles.sizeBtn} ${selectedRingSize === opt ? styles.activeSizeBtn : ''}`}
                            onClick={() => setSelectedRingSize(opt)}
                          >
                            {opt}
                          </button>
                        ))
                      ) : selectedRingForModal.category === 'bracelets' ? (
                        ['سایز ۱ (۱۶cm)', 'سایز ۲ (۱۸cm)', 'سایز ۳ (۲۰cm)'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`${styles.sizeBtn} ${selectedRingSize === opt ? styles.activeSizeBtn : ''}`}
                            onClick={() => setSelectedRingSize(opt)}
                          >
                            {opt}
                          </button>
                        ))
                      ) : (
                        ['48', '50', '52', '54', '56', '58', '60', '62'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            className={`${styles.sizeBtn} ${selectedRingSize === sz ? styles.activeSizeBtn : ''}`}
                            onClick={() => setSelectedRingSize(sz)}
                          >
                            سایز {toPersianDigits(sz)}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Free Engraving Option */}
                  <div className={styles.engravingSection}>
                    <label className={styles.pickerLabel}>
                      <Sparkles size={15} />
                      <span>حکاکی رایگان داخل حلقه (نام / تاریخ):</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: A & M - ۱۴۰۳/۰۵/۲۰"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      className={styles.engravingInput}
                      maxLength={30}
                    />
                  </div>

                  {/* Price & Action Row - DYNAMICALLY CALCULATED BY RING SIZE */}
                  {(() => {
                    const currentCalculatedPriceNum = getSizeAdjustedPrice(
                      selectedRingForModal.priceNum,
                      selectedRingSize
                    );
                    const formattedCurrentPrice = formatPersianCurrency(currentCalculatedPriceNum);

                    let formattedOldPrice = null;
                    if (selectedRingForModal.oldPriceNum) {
                      const oldCalcNum = getSizeAdjustedPrice(
                        selectedRingForModal.oldPriceNum,
                        selectedRingSize
                      );
                      formattedOldPrice = formatPersianCurrency(oldCalcNum);
                    }

                    return (
                      <div className={styles.modalPriceBox}>
                        <div>
                          {formattedOldPrice && (
                            <div className={styles.modalOldPrice}>
                              {formattedOldPrice} تومان
                            </div>
                          )}
                          <div className={styles.modalCurrentPrice}>
                            {formattedCurrentPrice} <small>تومان</small>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={styles.modalAddToCartBtn}
                          onClick={() => {
                            handleAddToCart(selectedRingForModal, null, `${formattedCurrentPrice} تومان`);
                            setSelectedRingForModal(null);
                          }}
                        >
                          <ShoppingCart size={18} />
                          <span>افزودن به سبد خرید</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Safety note */}
                  <div className={styles.safetyNote}>
                    <Lock size={14} />
                    <span>تحویل حضوری در شو روم فرشته یا ارسال توسط پیک اختصاصی مسلح</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
