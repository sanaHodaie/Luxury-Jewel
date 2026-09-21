import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Heart,
  Sparkles,
  ShieldCheck,
  Gem,
  Award,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useProducts } from '../../contexts/ProductsContext';
import ProductCard from './ProductCard';
import { ImageZoom } from '../ImageZoom/ImageZoom';
import styles from './FeaturedProducts.module.css';

import braceletImg from '../../assets/images/bangle_bracelet_1785079017091.webp';
import earringsImg from '../../assets/images/hoop_earrings_1785079033142.webp';
import necklaceImg from '../../assets/images/Gemini_Generated_Image_u9p07qu9p07qu9p0.webp';
import ringImg from '../../assets/images/diamond_ring_1785079058339.webp';
import rubyPendantImg from '../../assets/images/Gemini_Generated_Image_xrqiypxrqiypxrqi.webp';
import sapphireRingImg from '../../assets/images/Gemini_Generated_Image_dqn24pdqn24pdqn2.webp';
import earringsImgS from '../../assets/images/Gemini_Generated_Image_7zepjg7zepjg7zep.webp';
import braceletImg1 from '../../assets/images/Gemini_Generated_Image_1cbp311cbp311cbp.webp';

export const FeaturedProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();


  const { featuredProducts: products } = useProducts();

  const marqueeProducts = [...products, ...products];

  const handleManualScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
      });
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <section id="featured" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <span className={styles.subtitle}>شاهکارهای برگزیده</span>
          <h2 className={styles.title}>مجموعه جواهرات محبوب</h2>
          <p className={styles.description}>
            حرکت مداوم و نرم محصولات؛ از زیبایی تراش الماس تا درخشش طلا و گوهرسنگ‌های نایاب.
          </p>

          {/* Interactive Controls Bar */}
          <div className={styles.controlsBar}>
            <button
              type="button"
              className={styles.scrollNavBtn}
              onClick={() => handleManualScroll('right')}
              aria-label="حرکت به راست"
              title="حرکت به راست"
            >
              <ChevronRight size={20} />
            </button>

            <button
              type="button"
              className={styles.scrollNavBtn}
              onClick={() => handleManualScroll('left')}
              aria-label="حرکت به چپ"
              title="حرکت به چپ"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </motion.div>

        {/* Continuous Smooth Left-to-Right Scrolling Marquee Track */}
        <div className={styles.marqueeViewport} ref={sliderRef}>
          <div className={`${styles.marqueeTrack} ${isPaused ? styles.pausedAnimation : ''}`}>
            {marqueeProducts.map((product, idx) => (
              <div key={`${product.id}-${idx}`} className={styles.marqueeItem}>
                <ProductCard
                  product={product}
                  index={idx % 8}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Masterpiece Modal */}
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
              initial={{ scale: 0.9, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 25 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Top Header */}
              <div className={styles.modalHeader}>
                <div className={styles.headerTitleGroup}>
                  <Gem size={20} className={styles.headerIcon} />
                  <div>
                    <h3 className={styles.modalMainTitle}>جزئیات شاهکار برگزیده</h3>
                    <span className={styles.modalSubTitle}>گالری طلا و جواهرات لوکس ژوئل</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedProduct(null)}
                  aria-label="بستن"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className={styles.modalBody}>
                <div className={styles.modalLayoutGrid}>
                  {/* Left: Product Image with Zoom */}
                  <div className={styles.modalImageContainer}>
                    <div className={styles.modalBadgeRow}>
                      <span className={styles.modalTagBadge}>
                        <Sparkles size={13} />
                        <span>{selectedProduct.tag}</span>
                      </span>
                      <button
                        type="button"
                        className={`${styles.modalWishlistBtn} ${
                          isInWishlist(selectedProduct.id) ? styles.wishlistActive : ''
                        }`}
                        onClick={() => toggleWishlist(selectedProduct)}
                        title="افزودن به علاقه‌مندی‌ها"
                      >
                        <Heart
                          size={18}
                          fill={isInWishlist(selectedProduct.id) ? '#ef4444' : 'none'}
                          color={isInWishlist(selectedProduct.id) ? '#ef4444' : 'currentColor'}
                        />
                      </button>
                    </div>

                    <div className={styles.zoomWrapper}>
                      <ImageZoom
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        zoomLevel={2.8}
                        showHint={true}
                      />
                    </div>
                  </div>

                  {/* Right: Info & Specs */}
                  <div className={styles.modalDetailsColumn}>
                    <h2 className={styles.productNameTitle}>{selectedProduct.name}</h2>

                    <p className={styles.productDescriptionText}>{selectedProduct.description}</p>

                    {/* Specifications Box */}
                    <div className={styles.specificationsBox}>
                      <div className={styles.specBoxHeader}>
                        <Award size={16} color="var(--accent)" />
                        <span>شناسنامه و مشخصات فنی اثر:</span>
                      </div>
                      <div className={styles.specGrid}>
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>نوع گوهر / نگین:</span>
                          <span className={styles.specValue}>
                            {selectedProduct.gemType || 'الماس و طلا ۱۸ عیار'}
                          </span>
                        </div>
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>وزن تقریبی طلا:</span>
                          <span className={styles.specValue}>
                            {selectedProduct.weightGold || '۷.۵ گرم'}
                          </span>
                        </div>
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>کد بین‌المللی شناسنامه:</span>
                          <span className={styles.specValueCode}>
                            {selectedProduct.certCode || 'GIA-JL-2026'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Guarantee Badge */}
                    <div className={styles.trustBanner}>
                      <ShieldCheck size={18} className={styles.trustIcon} />
                      <span>
                        همراه با شناسنامه معتبر، فاکتور رسمی و ارسال اختصاصی بیمه‌شده
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Footer Bar */}
              <div className={styles.modalFooter}>
                <div className={styles.priceContainer}>
                  <span className={styles.priceLabel}>قیمت نهایی با احتساب مالیات:</span>
                  <div className={styles.priceValueRow}>
                    <span className={styles.priceAmount}>{selectedProduct.price}</span>
                    <span className={styles.priceCurrency}>تومان</span>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    type="button"
                    className={styles.modalCartBtn}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} />
                    <span>افزودن به سبد خرید</span>
                  </button>
                </div>
              </div>

              {/* Toast Notice */}
              <AnimatePresence>
                {addedNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={styles.toastNotice}
                  >
                    <CheckCircle size={18} />
                    <span>محصول با موفقیت به سبد خرید شما افزوده شد!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedProducts;
