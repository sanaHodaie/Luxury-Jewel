import React from 'react';
import { motion } from 'framer-motion';
import womensRingImg from '../../assets/images/964e4a816596bd4e09aedeed32055a05.webp';
import mensRingImg from '../../assets/images/mens_wedding_band_1785146591375.webp';

export const Gemstone = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* هاله نور نرم پشت حلقه‌ها */}
      <div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212, 175, 55, 0.32) 0%, rgba(212, 175, 55, 0.08) 60%, transparent 75%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      {/* عناصر درخشان ستاره‌ای شناور */}
      <motion.div
        animate={{
          scale: [0.8, 1.3, 0.8],
          opacity: [0.4, 1, 0.4],
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '12%',
          color: 'var(--accent, #d4af37)',
          fontSize: '1.6rem',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        ✨
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.3, 0.9, 0.3],
          y: [8, -8, 8],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '10%',
          color: 'var(--accent, #d4af37)',
          fontSize: '1.4rem',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        ✦
      </motion.div>

      {/* مجموعه اصلی حلقه‌ها (شناور عمودی + نزدیک و دور شدن روان) */}
      <motion.div
        animate={{
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        {/* حلقه زنانه */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            x: [-8, 8, -8],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '240px',
            height: '240px',
            position: 'relative',
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 15px 30px rgba(212, 175, 55, 0.45))',
            marginRight: '-40px',
            zIndex: 2,
          }}
        >
          <img
            src={womensRingImg}
            alt="حلقه تک نگین الماس زنانه"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '50%',
            }}
          />
        </motion.div>

        {/* حلقه مردانه */}
        <motion.div
          animate={{
            y: [6, -6, 6],
            x: [8, -8, 8],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '230px',
            height: '230px',
            position: 'relative',
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 15px 30px rgba(212, 175, 55, 0.35))',
            marginLeft: '-20px',
            zIndex: 1,
          }}
        >
          <img
            src={mensRingImg}
            alt="حلقه ازدواج مردانه پلاتین و طلا"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '50%',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Gemstone;