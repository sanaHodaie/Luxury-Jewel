import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, ShoppingCart, Heart, Eye, Check, X, ShieldCheck, Truck, Sparkles, CheckCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useProducts } from '../../contexts/ProductsContext';
import { ImageZoom } from '../ImageZoom/ImageZoom';
import styles from './SpecialDiscounts.module.css';

import emeraldRingImg from '../../assets/images/Gemini_Generated_Image_5hdbyg5hdbyg5hdb.webp';
import rubyPendantImg from '../../assets/images/Gemini_Generated_Image_wejfl5wejfl5wejf.webp';
import isolatedNoBg from '../../assets/images/Gemini_Generated_Image_2wdnmo2wdnmo2wdn.webp';
import pearlNecklaceImg from '../../assets/images/Gemini_Generated_Image_9yjzf49yjzf49yjz.webp';
import braceletImg from '../../assets/images/Gemini_Generated_Image_boya2nboya2nboya.webp';
import earringsImg from '../../assets/images/Gemini_Generated_Image_lp543ylp543ylp54.webp';

export const SpecialDiscounts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState('yellow');
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  // Countdown timer state (12 hours 45 mins 30 secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toPersianDigits = (num) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => farsiDigits[parseInt(d, 10)]);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice,
      originalPrice: product.originalPrice,
      image: product.image,
    });
    showToast(`${product.name} به سبد خرید اضافه شد.`);
  };

  const isWishlisted = (id) => {
    if (typeof isInWishlist === 'function') {
      return isInWishlist(id);
    }
    return wishlist?.some((item) => item.id === id);
  };

  const { discountProducts } = useProducts();

  return (
    <section className={styles.discountSection}>
      <div className={styles.container}>
        {/* Neon Header Box */}
        <div className={styles.headerContainer}>
          <div className={styles.neonBadgeWrapper}>
            <div className={styles.neonBadge}>
              <Flame size={18} className={styles.neonIcon} />
              <span>پیشنهادهای شگفت‌انگیز محدو‌د</span>
            </div>
          </div>

          <h2 className={styles.neonTitle}>
            کالکشن تخفیف‌های ویژه <span className={styles.neonTextGlow}>جواهرات طلایی</span>
          </h2>

          <p className={styles.sectionSubtitle}>
            فرصت استثنایی خرید قطعات کلکسیونی و شناسنامه‌دار با تخفیف محدود زمانی
          </p>

          {/* Live Countdown Timer */}
          <div className={styles.timerBar}>
            <div className={styles.timerTitle}>
              <Clock size={18} className={styles.timerClockIcon} />
              <span>زمان باقی‌مانده تا پایان پیشنهاد:</span>
            </div>
            <div className={styles.timerDigitsBox}>
              <div className={styles.timerUnit}>
                <span className={styles.timerNum}>{toPersianDigits(String(timeLeft.hours).padStart(2, '0'))}</span>
                <span className={styles.timerLabel}>ساعت</span>
              </div>
              <span className={styles.timerColon}>:</span>
              <div className={styles.timerUnit}>
                <span className={styles.timerNum}>{toPersianDigits(String(timeLeft.minutes).padStart(2, '0'))}</span>
                <span className={styles.timerLabel}>دقیقه</span>
              </div>
              <span className={styles.timerColon}>:</span>
              <div className={styles.timerUnit}>
                <span className={styles.timerNum}>{toPersianDigits(String(timeLeft.seconds).padStart(2, '0'))}</span>
                <span className={styles.timerLabel}>ثانیه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid with Alternating Left/Right Animations */}
        <div className={styles.cardGrid}>
          {discountProducts.map((product, index) => {
            const isFromRight = index % 2 === 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: isFromRight ? 70 : -70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: (index % 2) * 0.1 }}
                className={styles.popCardWrapper}
              >
                <div className={styles.popCard}>
                  {/* Floating Pop-Out Product Image */}
                  <div
                    className={styles.popImageFrame}
                    onClick={() => {
                      setSelectedMetal('yellow');
                      setSelectedProduct(product);
                    }}
                  >
                    <div className={styles.discountBadge}>
                      <span>{product.discountPercent} تخفیف</span>
                    </div>

                    <img src={product.image} alt={product.name} className={styles.popImg} />

                    <div className={styles.imageOverlayAction}>
                      <button
                        type="button"
                        className={styles.quickViewBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMetal('yellow');
                          setSelectedProduct(product);
                        }}
                        title="مشاهده سریع"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        className={`${styles.wishlistBtn} ${isWishlisted(product.id) ? styles.wishlistActive : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        title="علاقه‌مندی"
                      >
                        <Heart
                          size={18}
                          fill={isWishlisted(product.id) ? '#ef4444' : 'none'}
                          color={isWishlisted(product.id) ? '#ef4444' : 'currentColor'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className={styles.cardBody}>
                    <span className={styles.categoryTag}>{product.category}</span>
                    <h3
                      className={styles.productName}
                      onClick={() => {
                        setSelectedMetal('yellow');
                        setSelectedProduct(product);
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Stock Bar */}
                    <div className={styles.stockBox}>
                      <div className={styles.stockTextRow}>
                        <span>موجودی باقی‌مانده:</span>
                        <strong className={styles.stockCount}>
                          تنها {toPersianDigits(product.stockLeft)} عدد در انبار
                        </strong>
                      </div>
                      <div className={styles.stockTrack}>
                       <div
  className={styles.stockFill}
  style={{
    width: `${Math.max(10, 100 - product.stockLeft * 4)}%`,
  }}
                      />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className={styles.priceRow}>
                      <div className={styles.prices}>
                        <span className={styles.oldPrice}>{product.originalPrice}</span>
                        <div className={styles.newPrice}>
                          <strong>{product.discountPrice}</strong>
                          <span className={styles.currency}>تومان</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={styles.addToCartBtn}
                        onClick={(e) => handleAddToCart(product, e)}
                        title="افزودن به سبد خرید"
                      >
                        <ShoppingCart size={17} />
                        <span>خرید سریع</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal for Quick Details */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderTitle}>
                  <Sparkles size={18} style={{ color: 'var(--accent)' }} />
                  <span>پیشنهاد ویژه کلکسیونی</span>
                </div>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setSelectedProduct(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalScrollBody}>
                <div className={styles.modalGrid}>
                  <div className={styles.modalImageWrapper}>
                    <ImageZoom
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      zoomLevel={2.8}
                      showHint={false}
                    />
                  </div>

                  <div className={styles.modalInfoWrapper}>
                    <div className={styles.modalDiscountBadge}>
                      <Flame size={16} />
                      <span>{selectedProduct.discountPercent} تخفیف ویژه</span>
                    </div>

                    <h3 className={styles.modalTitle}>{selectedProduct.name}</h3>

                    <div className={styles.modalPriceBox}>
                      <span className={styles.modalOldPrice}>{selectedProduct.originalPrice} تومان</span>
                      <div className={styles.modalNewPrice}>
                        <span>{selectedProduct.discountPrice}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>تومان</span>
                      </div>
                    </div>

                    <div className={styles.specBox}>
                      <div className={styles.specRow}>
                        <span>گوهر اصلی:</span>
                        <strong>{selectedProduct.gemType}</strong>
                      </div>
                      <div className={styles.specRow}>
                        <span>وزن و عیار:</span>
                        <strong>{selectedProduct.weightGold}</strong>
                      </div>
                      <div className={styles.specRow}>
                        <span>شناسنامه رسمی:</span>
                        <strong>{selectedProduct.certCode}</strong>
                      </div>
                    </div>

                    <p className={styles.modalDesc}>{selectedProduct.description}</p>

                    <div className={styles.warrantyItem}>
                      <ShieldCheck size={16} color="var(--accent)" />
                      <span>تضمین اصالت ۱۰۰٪ با شناسنامه رسمی و ارسال امنیتی بیمه‌شده</span>
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
                        <ShoppingCart size={18} />
                        <span>افزودن مستقیم به سبد خرید</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.modalWishlistBtn} ${isWishlisted(selectedProduct.id) ? styles.wishlistActive : ''}`}
                        onClick={() => toggleWishlist(selectedProduct)}
                      >
                        <Heart
                          size={18}
                          fill={isWishlisted(selectedProduct.id) ? '#ef4444' : 'none'}
                          color={isWishlisted(selectedProduct.id) ? '#ef4444' : 'currentColor'}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
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

export default SpecialDiscounts;
