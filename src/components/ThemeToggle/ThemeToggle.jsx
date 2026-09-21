import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const { currentTheme, changeTheme, THEMES } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click or touch outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const activeThemeObject =
    THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label="تغییر تم رنگی"
        aria-expanded={isOpen}
      >
        <Palette size={22} className={styles.themeIcon} />
        <span className={styles.label}>{activeThemeObject.name}</span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {THEMES.map((theme) => {
              const isActive = theme.id === currentTheme;
              return (
                <button
                  type="button"
                  key={theme.id}
                  className={`${styles.dropdownItem} ${
                    isActive ? styles.activeItem : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeTheme(theme.id);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className={styles.itemColorBadge}
                    style={{ background: theme.color || theme.accentColor || '#e8a87c' }}
                  />
                  <span className={styles.itemName}>{theme.name}</span>
                  {isActive && <span className={styles.checkIcon}>✓</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
