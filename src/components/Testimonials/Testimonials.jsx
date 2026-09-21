import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import styles from './Testimonials.module.css';

export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'سارا محمدی',
      role: 'خریدار سرویس طلا',
      text: '«کیفیت فوق‌العاده و طراحی بی‌نظیر! بسته بندی عالی بود و حس بسیار خوبی به آدم میده ❤️»',
      stars: 5,
      avatarEmoji: '👩‍💼',
    },
    {
      id: 2,
      name: 'احمد رضایی',
      role: 'خریدار حلقه سفارشی',
      text: '«خلاقیت و دقت در هر قطعه تحسین‌برانگیزه. مشاورین برند واقعا با حوصله راهنماییم کردن ✨»',
      stars: 5,
      avatarEmoji: '👨‍💼',
    },
    {
      id: 3,
      name: 'مریم حسینی',
      role: 'خریدار گردنبند آمیتیست',
      text: '«هر بار که این جواهرات رو می‌بینم، حس خوبی دارم. ظرافت ساخت و درخشش فوق العاده عالیه 🌸»',
      stars: 5,
      avatarEmoji: '👩‍🎨',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.subtitle}>رضایت شما، افتخار ماست</span>
          <h2 className={styles.title}>نظرات مشتریان عزیز</h2>
        </div>

        {/* Carousel Card */}
        <div className={styles.carousel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              className={styles.testimonialCard}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.stars}>
                {[...Array(activeTestimonial.stars)].map((_, i) => (
                  <Star key={i} size={20} fill="var(--gold-accent)" stroke="none" />
                ))}
              </div>

              <p className={styles.quoteText}>{activeTestimonial.text}</p>

              <div className={styles.authorContainer}>
                <div className={styles.avatarCircle}>
                  <span className={styles.avatarEmoji}>{activeTestimonial.avatarEmoji}</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{activeTestimonial.name}</span>
                  <span className={styles.authorRole}>{activeTestimonial.role}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navArrow}
            onClick={handleNext}
            aria-label="نظر بعدی"
          >
            <ChevronRight size={20} />
          </button>

          <div className={styles.dots}>
            {testimonials.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`نمایش نظر شماره ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.navArrow}
            onClick={handlePrev}
            aria-label="نظر قبلی"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
