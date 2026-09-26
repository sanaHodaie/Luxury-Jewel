import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import Gemstone from './Gemstone';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.glowBg} />
      <div className={styles.glowBgSecondary} />

      <div className={styles.container}>
        {/* Left Column: Text & CTA */}
        <motion.div
          className={styles.contentColumn}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className={styles.badge}>
           
            <span> جدیدترین مجموعه ۲۰۲۶</span>
          </div>

          <h1 className={styles.title}>
            زیبایی در هر{' '}
            <span className={styles.accentText}>جزئیات</span>
          </h1>

          <p className={styles.subtitle}>
            خلق جواهراتی بی‌پایان با ترکیبی هوشمندانه از طراحی مدرن و طلا و سنگ‌های قیمتی دست‌ساز. حس درخشش و اصالت واقعی را تجربه کنید.
          </p>

          <div className={styles.ctaGroup}>
            <a href="#featured" className={styles.primaryBtn}>
              <span>مشاهده محصولات</span>
              <ArrowLeft size={18} />
            </a>
            <a href="/story" className={styles.secondaryBtn}>
              <span>داستان ما</span>
            </a>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>۱۰,۰۰۰+</span>
              <span className={styles.statLabel}>مشتری راضی</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>۵۰+</span>
              <span className={styles.statLabel}>طرح منحصربه‌فرد</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>۱۰ سال</span>
              <span className={styles.statLabel}>سابقه درخشان</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive 3D Gemstone */}
        <motion.div
          className={styles.gemstoneColumn}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <Gemstone />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
