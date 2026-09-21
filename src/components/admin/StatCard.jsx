// src/components/admin/StatCard.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import styles from './StatCard.module.css';

const COLOR_VARS = {
  gold: '#c9971f',
  accent: 'var(--accent)',
  teal: '#2fb3a3',
  navy: '#3b5bdb',
};

/** Animated count-up that respects Persian digit grouping. */
function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(target) || 0;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const progress = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}

export default function StatCard({ icon, color = 'accent', label, value = 0, sub, sparkData, format }) {
  const animated = useCountUp(value);
  const tint = COLOR_VARS[color] || COLOR_VARS.accent;
  const formatted = format
    ? format(animated)
    : Math.round(animated).toLocaleString('fa-IR');

  return (
    <motion.div className={styles.card} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <div className={styles.topRow}>
        <span className={styles.iconBadge} style={{ color: tint, background: `color-mix(in srgb, ${tint} 14%, transparent)` }}>
          {icon}
        </span>
        <span className={styles.label}>{label}</span>
      </div>

      <p className={styles.value} style={{ color: tint }}>
        {formatted}
      </p>

      {sub && <p className={styles.sub}>{sub}</p>}

      {Array.isArray(sparkData) && sparkData.length > 1 && (
        <div className={styles.spark}>
          <ResponsiveContainer width="100%" height={38}>
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tint} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={tint} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={tint}
                strokeWidth={2}
                fill={`url(#spark-${color})`}
                isAnimationActive
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
