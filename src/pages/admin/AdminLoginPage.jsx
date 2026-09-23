
// src/pages/admin/AdminLoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  Gem,
  AlertCircle,
  Mail,
} from 'lucide-react';

import { useProducts } from '../../contexts/ProductsContext';
import styles from './AdminLoginPage.module.css';

export default function AdminLoginPage() {
  const {
    loginAdmin,
    isAdminAuthed,
    authLoading,
  } = useProducts();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     WAIT FOR AUTH SESSION CHECK
  ========================================================= */

  if (authLoading) {
    return null;
  }

  /* =========================================================
     ALREADY LOGGED IN
  ========================================================= */

  if (isAdminAuthed) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError('');

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        'لطفاً ایمیل خود را وارد کنید.'
      );

      setShake(true);

      setTimeout(() => {
        setShake(false);
      }, 500);

      return;
    }

    if (!password) {
      setError(
        'لطفاً رمز عبور خود را وارد کنید.'
      );

      setShake(true);

      setTimeout(() => {
        setShake(false);
      }, 500);

      return;
    }

    setLoading(true);

    try {
      const result =
        await loginAdmin(
          cleanEmail,
          password
        );

      if (result?.ok) {
        navigate(
          '/admin/dashboard',
          {
            replace: true,
          }
        );

        return;
      }

      setError(
        'ایمیل یا رمز عبور صحیح نیست.'
      );

      setShake(true);

      setTimeout(() => {
        setShake(false);
      }, 500);
    } catch (error) {
      console.error(
        '[AdminLoginPage] Login error:',
        error
      );

      setError(
        'ورود انجام نشد. لطفاً دوباره تلاش کنید.'
      );

      setShake(true);

      setTimeout(() => {
        setShake(false);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ============================================
          Background بنفش ملایم
      ============================================ */}

      <div className={styles.bgBase} />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGlow3} />
      <div className={styles.bgPattern} />
      <div className={styles.bgVignette} />

      <motion.form
        className={styles.card}
        onSubmit={handleSubmit}
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake
            ? [0, -10, 10, -8, 8, 0]
            : 0,
        }}
        transition={{
          duration: shake
            ? 0.45
            : 0.6,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <span
          className={styles.topAccent}
          aria-hidden="true"
        />

        <motion.div
          className={styles.iconBadge}
          animate={{
            rotate: [
              0,
              -8,
              8,
              0,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
        >
          <Gem size={26} />
        </motion.div>

        <h1 className={styles.title}>
          ورود به پنل مدیریت
        </h1>

        <p className={styles.subtitle}>
          Luxury Jewel — مدیریت محصولات فروشگاه
        </p>

        {/* =====================================================
            EMAIL
        ===================================================== */}

        <label
          className={styles.label}
          htmlFor="admin-email"
        >
          ایمیل
        </label>

        <div className={styles.inputRow}>
          <Mail
            size={18}
            className={styles.inputIcon}
          />

          <input
            id="admin-email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => {
              setEmail(
                e.target.value
              );

              setError('');
            }}
            placeholder="ایمیل خود را وارد کنید"
            autoComplete="email"
            autoFocus
            dir="ltr"
          />
        </div>

        {/* =====================================================
            PASSWORD
        ===================================================== */}

        <label
          className={styles.label}
          htmlFor="admin-password"
        >
          رمز عبور
        </label>

        <div className={styles.inputRow}>
          <Lock
            size={18}
            className={styles.inputIcon}
          />

          <input
            id="admin-password"
            type={
              showPassword
                ? 'text'
                : 'password'
            }
            className={styles.input}
            value={password}
            onChange={(e) => {
              setPassword(
                e.target.value
              );

              setError('');
            }}
            placeholder="رمز عبور خود را وارد کنید"
            autoComplete="current-password"
            dir="ltr"
          />

          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() =>
              setShowPassword(
                (s) => !s
              )
            }
            aria-label={
              showPassword
                ? 'پنهان کردن رمز'
                : 'نمایش رمز'
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        <AnimatePresence>
          {error && (
            <motion.div
              className={styles.error}
              initial={{
                opacity: 0,
                y: -6,
                height: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                y: -6,
                height: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <AlertCircle size={14} />

              <span>
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================
            SUBMIT
        ===================================================== */}

        <motion.button
          type="submit"
          className={styles.submitBtn}
          whileHover={
            loading
              ? undefined
              : { y: -2 }
          }
          whileTap={
            loading
              ? undefined
              : { scale: 0.98 }
          }
          disabled={loading}
        >
          {loading
            ? 'در حال ورود...'
            : 'ورود به پنل'}
        </motion.button>

        <a
          className={styles.backLink}
          href="/"
        >
          بازگشت به فروشگاه
        </a>
      </motion.form>
    </div>
  );
}

