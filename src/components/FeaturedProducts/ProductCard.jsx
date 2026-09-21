import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ImageZoom } from '../ImageZoom/ImageZoom';
import styles from './FeaturedProducts.module.css';

export const ProductCard = ({ product, onSelect, index = 0 }) => {
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: -60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
    >
      {/* Top badges & heart button */}
      <div className={styles.cardTopBar}>
        <span className={styles.typeBadge}>{product.tag || product.typePersian || product.type}</span>
        <button
          type="button"
          className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="افزودن به علاقه‌مندی‌ها"
        >
          <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
        </button>
      </div>

      {/* Product Image Container with Magnifying Glass Zoom */}
      <div className={styles.imageContainer}>
        <ImageZoom
          src={product.image}
          alt={product.name}
          zoomLevel={2.6}
        />
      </div>

      {/* Info & Actions */}
      <div className={styles.cardInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>{product.price} تومان</p>
        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.quickViewBtn}
            onClick={() => onSelect(product)}
          >
            <Eye size={16} />
            <span>جزئیات محصول</span>
          </button>
          <button
            type="button"
            className={styles.addToCartCardBtn}
            onClick={handleAddToCart}
            aria-label="افزودن به سبد خرید"
            style={{
              background: justAdded ? '#4caf50' : 'var(--accent)',
              transition: 'background 0.3s ease',
            }}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={18} color="#ffffff" />
                </motion.span>
              ) : (
                <motion.span
                  key="bag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <ShoppingBag size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

