import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Sparkles } from 'lucide-react';
import styles from './BrandStory.module.css';

export const BrandStory = () => {
  const statItems = [
    {
      emoji: '💎',
      title: '۱۰+ سال سابقه',
      sub: 'خلق شاهکارهای ماندگار و دست‌ساز طلا و جواهر',
    },
    {
      emoji: '🎨',
      title: '۵۰+ طرح اختصاصی',
      sub: 'طراحی‌های منحصر‌به‌فرد منطبق با متدهای روز دنیا',
    },
    {
      emoji: '❤️',
      title: '۱۰۰۰+ مشتری وفادار',
      sub: 'اعتماد و رضایت کامل خریداران محترم در سراسر کشور',
    },
  ];

  return (
    <section id="story" className={styles.section}>
      <div className={styles.glowCircle} />

      <div className={styles.container}>
        {/* Left Column: Story Content */}
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>داستان برند ما</span>
          </div>

          <h2 className={styles.title}>
            از سال ۲۰۱۶، ما در تلاشیم تا{' '}
            <span className={styles.highlight}>رویای شما را مجسم کنیم</span>
          </h2>

          <p className={styles.textParagraph}>
            در «Luxury Jewel»، اعتقاد داریم جواهرات تنها یک زیورآلات ساده نیستند؛ بلکه بیانگر شخصیت، احساسات و لحظات گرانبهای زندگی شما هستند.
          </p>

          <p className={styles.textParagraph}>
            ما با ترکیب هنر اصیل جواهرسازی، جدیدترین فناوری‌های سه‌بعدی و انتخاب نایاب‌ترین گوهرها، اصالتی بی‌بدیل را به استایل شما هدیه می‌دهیم.
          </p>

          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>
              «زیبایی واقعی در ظرافت جزئیاتی نهفته است که با عشق و دقت فراوان توسط استادکاران خستگی‌ناپذیر شکل گرفته‌اند.»
            </p>
          </div>
        </motion.div>

        {/* Right Column: Stat Cards */}
        <motion.div
          className={styles.statsWrapper}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              className={styles.statCard}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.statIconBox}>{item.emoji}</div>
              <div className={styles.statInfo}>
                <span className={styles.statTitle}>{item.title}</span>
                <span className={styles.statSub}>{item.sub}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
