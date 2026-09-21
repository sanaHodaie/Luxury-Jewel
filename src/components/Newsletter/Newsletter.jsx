import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Heart } from 'lucide-react';
import styles from './Newsletter.module.css';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email?.trim();
    if (!trimmedEmail) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <section id="newsletter" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>عضو خانواده ما شوید 💌</h2>
          <p className={styles.subtitle}>
            با عضویت در خبرنامه ویژه، اولین نفری باشید که از رونمایی مجموعه‌های جدید، پیشنهادات خصوصی و تخفیف‌های ویژه باخبر می‌شوید.
          </p>

          {!isSubmitted ? (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                className={styles.input}
                placeholder="آدرس ایمیل خود را وارد کنید..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.submitBtn}>
                <span>عضویت رایگان</span>
                <Send size={18} />
              </button>
            </form>
          ) : (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2 size={24} />
              <span>ایمیل شما با موفقیت ثبت شد! خوش آمدید 🎉</span>
            </motion.div>
          )}

          <div className={styles.badge}>
            <span>۱۰۰۰+ عضو خوشحال 🌸</span>
          </div>
        </motion.div>
      </div>

      {/* Error Toast Notification - Centered on Screen */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.toastOverlay}
            onClick={() => setShowToast(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={styles.toastContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.toastIcon}>✉️</div>
              <p className={styles.toastMessage}>
                لطفا ابتدا ایمیل خود را وارد کنید دوست عزیز
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Newsletter;
