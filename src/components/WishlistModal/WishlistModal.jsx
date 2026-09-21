import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';

export const WishlistModal = () => {
  const { wishlist, isOpen, closeWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'rtl',
          padding: '16px',
        }}
        onClick={closeWishlist}
      >
        <motion.div
          style={{
            background: 'var(--bg-card)',
            padding: '24px',
            borderRadius: '24px',
            maxWidth: '460px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--theme-glass-border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
        >
          {/* Modal Header Bar with Title and Opposite Close Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--theme-glass-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={20} style={{ color: '#ef4444', fill: '#ef4444' }} />
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>
                علاقه‌مندی‌ها
              </h3>
            </div>
            <button
              onClick={closeWishlist}
              aria-label="بستن"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--theme-glass-border)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Wishlist Items List */}
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
              <Heart size={42} style={{ color: 'var(--text-secondary)', opacity: 0.4, marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                هیچ محصولی در لیست علاقه‌مندی‌ها وجود ندارد.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto',
                paddingRight: '4px',
                maxHeight: '55vh',
              }}
            >
              {wishlist.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '16px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--theme-glass-border)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  {/* Product Image */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || 'محصول'}
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid var(--theme-glass-border)',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '12px',
                        background: 'var(--bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    >
                      <Heart size={24} />
                    </div>
                  )}

                  {/* Product Name & Price */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name || 'محصول سفارشی'}
                    </span>
                    {item.price && (
                      <span style={{ color: 'var(--accent)', fontSize: '0.88rem', fontWeight: 800 }}>
                        {item.price}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => addToCart(item)}
                      title="افزودن به سبد خرید"
                      style={{
                        background: 'var(--accent)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span style={{ display: 'inline-block' }}>خرید</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(item)}
                      title="حذف از علاقه‌مندی‌ها"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '10px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WishlistModal;

