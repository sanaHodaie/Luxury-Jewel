import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import styles from './DeleteToast.module.css';

export const DeleteToast = () => {
  const { deleteToast, hideDeleteToast } = useCart();

  return (
    <AnimatePresence>
      {deleteToast.show && (
        <div className={styles.overlay} onClick={hideDeleteToast}>
          <motion.div
            className={styles.toastCard}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <button
              type="button"
              className={styles.closeBtn}
              onClick={hideDeleteToast}
              aria-label="بستن پیام"
            >
              <X size={16} />
            </button>

            <div className={styles.iconWrapper}>
              <Trash2 size={26} />
            </div>

            <div>
              <h4 className={styles.title}>حذف از سبد خرید</h4>
              <p className={styles.message}>
                {deleteToast.message || 'محصول با موفقیت از سبد خرید حذف شد.'}
              </p>
            </div>

            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteToast;
