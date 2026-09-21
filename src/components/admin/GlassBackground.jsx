// src/components/admin/GlassBackground.jsx
// Decorative animated backdrop for the admin login screen.
import React from 'react';
import { motion } from 'framer-motion';
import styles from './GlassBackground.module.css';

const BLOBS = [
  { className: styles.blobOne, duration: 18 },
  { className: styles.blobTwo, duration: 24 },
  { className: styles.blobThree, duration: 21 },
];

export default function GlassBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      {BLOBS.map((blob, i) => (
        <motion.span
          key={i}
          className={`${styles.blob} ${blob.className}`}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.12, 0.95, 1],
          }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className={styles.grid} />
    </div>
  );
}
