import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';
import styles from './AuthModal.module.css';

// Pre-seeded demo user if localStorage is empty
const INITIAL_USERS = [
  {
    firstName: 'مریم',
    lastName: 'احمدی',
    usernameOrPhone: '09123456789',
    password: '123456',
  },
];

export const getStoredUsers = () => {
  try {
    const saved = localStorage.getItem('joel_users');
    if (!saved) {
      localStorage.setItem('joel_users', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_USERS;
  }
};

export const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('joel_users', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users:', e);
  }
};

export const getStoredCurrentUser = () => {
  try {
    const saved = localStorage.getItem('joel_current_user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const saveCurrentUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem('joel_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('joel_current_user');
    }
  } catch (e) {
    console.error('Error setting current user:', e);
  }
};

const AuthModal = ({ isOpen, onClose }) => {
  // Mode can be: 'login' | 'signup' | 'forgot' | 'success_notice'
  const [mode, setMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessageText, setSuccessMessageText] = useState('');

  // Password Visibility Toggles (Eye / EyeOff)
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  // Form Fields State
  const [loginForm, setLoginForm] = useState({
    usernameOrPhone: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    usernameOrPhone: '',
    password: '',
    confirmPassword: '',
  });

  const [forgotForm, setForgotForm] = useState({
    usernameOrPhone: '',
    password: '',
    confirmPassword: '',
  });

  // Load current logged-in user on mount / open
  useEffect(() => {
    if (isOpen) {
      const activeUser = getStoredCurrentUser();
      setCurrentUser(activeUser);
      setErrorMessage('');
      // If not logged in, reset visibility & default mode
      if (!activeUser && mode === 'success_notice') {
        setMode('login');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Clear inputs and error
  const resetAllForms = () => {
    setLoginForm({ usernameOrPhone: '', password: '' });
    setSignupForm({
      firstName: '',
      lastName: '',
      usernameOrPhone: '',
      password: '',
      confirmPassword: '',
    });
    setForgotForm({ usernameOrPhone: '', password: '', confirmPassword: '' });
    setErrorMessage('');
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowSignupConfirmPassword(false);
    setShowForgotNewPassword(false);
    setShowForgotConfirmPassword(false);
  };

  const handleModeChange = (newMode) => {
    setErrorMessage('');
    resetAllForms();
    setMode(newMode);
  };

  // --- LOGIN SUBMIT HANDLER ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const identifier = loginForm.usernameOrPhone.trim();
    const pass = loginForm.password.trim();

    if (!identifier || !pass) {
      setErrorMessage('لطفاً نام کاربری/شماره تلفن و رمز عبور را وارد کنید');
      return;
    }

    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) =>
        (u.usernameOrPhone === identifier ||
          u.usernameOrPhone === identifier.replace(/^0/, '')) &&
        u.password === pass
    );

    if (!matchedUser) {
      setErrorMessage('نام کاربری، شماره تلفن یا رمز عبور اشتباه است');
      return;
    }

    // Success login
    saveCurrentUserToStorage(matchedUser);
    setCurrentUser(matchedUser);
    setSuccessMessageText(`خوش آمدید ${matchedUser.firstName} عزیز!`);
    setMode('success_notice');

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // --- SIGNUP SUBMIT HANDLER ---
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const firstName = signupForm.firstName.trim();
    const lastName = signupForm.lastName.trim();
    const phone = signupForm.usernameOrPhone.trim();
    const password = signupForm.password;
    const confirmPassword = signupForm.confirmPassword;

    // Validate fields
    if (!firstName || !lastName || !phone || !password || !confirmPassword) {
      setErrorMessage('لطفاً تمامی فیلدها را به طور کامل پر کنید');
      return;
    }

    // Password minimum 6 digits requirement
    if (password.length < 6) {
      setErrorMessage('رمز عبور باید حداقل شامل ۶ رقم یا کاراکتر باشد');
      return;
    }

    // Password confirm match
    if (password !== confirmPassword) {
      setErrorMessage('رمز عبور و تکرار آن با یکدیگر مطابقت ندارند');
      return;
    }

    // Check duplicate phone
    const users = getStoredUsers();
    const exists = users.some((u) => u.usernameOrPhone === phone);
    if (exists) {
      setErrorMessage('کاربری با این شماره تماس/نام کاربری قبلاً ثبت‌نام کرده است');
      return;
    }

    // Save user
    const newUser = { firstName, lastName, usernameOrPhone: phone, password };
    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);

    // Show central success screen message "ثبت نام شما کامل شد"
    setSuccessMessageText('ثبت نام شما با موفقیت کامل شد!');
    setLoginForm({ usernameOrPhone: phone, password: '' });
    setMode('success_notice');

    // Automatically transition back to login screen after 2 seconds
    setTimeout(() => {
      setMode('login');
      setErrorMessage('');
    }, 2000);
  };

  // --- FORGOT PASSWORD SUBMIT HANDLER ---
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const phone = forgotForm.usernameOrPhone.trim();
    const newPass = forgotForm.password;
    const confirmPass = forgotForm.confirmPassword;

    if (!phone || !newPass || !confirmPass) {
      setErrorMessage('لطفاً تمامی فیلدها را وارد نمایید');
      return;
    }

    if (newPass.length < 6) {
      setErrorMessage('رمز عبور جدید باید حداقل شامل ۶ رقم باشد');
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMessage('رمز عبور جدید و تکرار آن یکسان نیستند');
      return;
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.usernameOrPhone === phone);

    if (userIndex === -1) {
      setErrorMessage('کاربری با این نام کاربری یا شماره تماس یافت نشد');
      return;
    }

    // Update password
    users[userIndex].password = newPass;
    saveUsersToStorage(users);

    setSuccessMessageText('رمز عبور شما با موفقیت تغییر یافت!');
    setLoginForm({ usernameOrPhone: phone, password: '' });
    setMode('success_notice');

    setTimeout(() => {
      setMode('login');
      setErrorMessage('');
    }, 2000);
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    saveCurrentUserToStorage(null);
    setCurrentUser(null);
    setMode('login');
    resetAllForms();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        transition={{ duration: 0.25 }}
      >
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="بستن پنجره"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.brandBadge}>💎</div>
          <h2 className={styles.modalTitle}>
            {currentUser
              ? 'پروفایل کاربری'
              : mode === 'login'
              ? 'ورود به حساب کاربری'
              : mode === 'signup'
              ? 'ایجاد حساب کاربری جدید'
              : mode === 'forgot'
              ? 'بازیابی رمز عبور'
              : 'پیام سیستم'}
          </h2>
          <p className={styles.modalSubtitle}>
            {currentUser
              ? 'به گالری لوکس و تشریفاتی ژوئل خوش آمدید'
              : mode === 'login'
              ? 'لطفاً برای ورود به حساب، اطلاعات خود را وارد کنید'
              : mode === 'signup'
              ? 'مشخصات خود را جهت عضویت در گالری ژوئل تکمیل کنید'
              : mode === 'forgot'
              ? 'شماره تماس و رمز عبور جدید خود را وارد نمایید'
              : 'اطلاعات با موفقیت ثبت گردید'}
          </p>
        </div>

        {/* Modal Content Body */}
        <div className={styles.modalBody}>
          {/* LOGGED IN USER VIEW */}
          {currentUser ? (
            <div className={styles.loggedInCard}>
              <div className={styles.userAvatarLarge}>
                {currentUser.firstName ? currentUser.firstName[0] : '👤'}
              </div>
              <div className={styles.userInfoGroup}>
                <span className={styles.userName}>
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <span className={styles.userPhone}>
                  {currentUser.usernameOrPhone}
                </span>
              </div>

              <div className={styles.loggedInActions}>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>خروج از حساب کاربری</span>
                </button>
              </div>
            </div>
          ) : mode === 'success_notice' ? (
            /* CENTRAL SUCCESS NOTICE SCREEN */
            <div className={styles.successCard}>
              <div className={styles.successIconWrapper}>
                <CheckCircle2 size={40} />
              </div>
              <h3 className={styles.successTitle}>{successMessageText}</h3>
              <p className={styles.successText}>
                در حال انتقال به صفحه ورود... لطفا چند لحظه شکیبا باشید.
              </p>
              <div className={styles.redirectBadge}>
                <Sparkles size={14} />
                <span>انتقال هوشمند به صفحه ورود</span>
              </div>
            </div>
          ) : mode === 'login' ? (
            /* LOGIN MODE */
            <form onSubmit={handleLoginSubmit} className={styles.authForm}>
              {errorMessage && (
                <div className={styles.errorBanner}>
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Box 1: Username or Phone */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    نام کاربری یا شماره تلفن
                    <span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="نام کاربری یا شماره تلفن..."
                    className={styles.textInput}
                    value={loginForm.usernameOrPhone}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Box 2: Password with Eye Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    رمز عبور<span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="رمز عبور خود را وارد کنید..."
                    className={`${styles.textInput} ${styles.textInputWithEye}`}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                  />
                  {/* Eye Toggle Button */}
                  <button
                    type="button"
                    className={`${styles.eyeToggleBtn} ${
                      showLoginPassword ? styles.eyeToggleBtnActive : ''
                    }`}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    title={showLoginPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                    aria-label="تغییر وضعیت نمایش رمز عبور"
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <LogIn size={18} />
                <span>ورود به حساب کاربری</span>
              </button>

              {/* Links below login */}
              <div className={styles.linksContainer}>
                <button
                  type="button"
                  className={styles.switchLinkBtn}
                  onClick={() => handleModeChange('signup')}
                >
                  <span>حساب کاربری ندارید؟</span>
                  <span className={styles.switchLinkBtnStrong}>
                    درست کردن حساب
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.switchLinkBtn}
                  onClick={() => handleModeChange('forgot')}
                >
                  <KeyRound size={14} />
                  <span>فراموشی رمز عبور</span>
                </button>
              </div>
            </form>
          ) : mode === 'signup' ? (
            /* SIGNUP MODE */
            <form onSubmit={handleSignupSubmit} className={styles.authForm}>
              {errorMessage && (
                <div className={styles.errorBanner}>
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* First Name & Last Name Grid */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>
                      نام<span className={styles.requiredStar}>*</span>
                    </span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <User size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      required
                      placeholder="نام..."
                      className={styles.textInput}
                      value={signupForm.firstName}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, firstName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>
                      نام خانوادگی<span className={styles.requiredStar}>*</span>
                    </span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <User size={18} className={styles.inputIcon} />
                    <input
                      type="text"
                      required
                      placeholder="نام خانوادگی..."
                      className={styles.textInput}
                      value={signupForm.lastName}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number Box */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    شماره تماس<span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Phone size={18} className={styles.inputIcon} />
                  <input
                    type="tel"
                    required
                    placeholder="مثلاً: 09123456789"
                    className={styles.textInput}
                    value={signupForm.usernameOrPhone}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        usernameOrPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Password Box (min 6 digits) with Eye Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    رمز عبور (حداقل ۶ رقم)
                    <span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="رمز عبور حداقل ۶ کاراکتر..."
                    className={`${styles.textInput} ${styles.textInputWithEye}`}
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className={`${styles.eyeToggleBtn} ${
                      showSignupPassword ? styles.eyeToggleBtnActive : ''
                    }`}
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    title={showSignupPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  >
                    {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Box with Eye Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    تکرار رمز عبور
                    <span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showSignupConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="تکرار رمز عبور..."
                    className={`${styles.textInput} ${styles.textInputWithEye}`}
                    value={signupForm.confirmPassword}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className={`${styles.eyeToggleBtn} ${
                      showSignupConfirmPassword ? styles.eyeToggleBtnActive : ''
                    }`}
                    onClick={() =>
                      setShowSignupConfirmPassword(!showSignupConfirmPassword)
                    }
                    title={
                      showSignupConfirmPassword ? 'مخفی کردن رمز' : 'نمایش رمز'
                    }
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <UserPlus size={18} />
                <span>ثبت نام و ایجاد حساب</span>
              </button>

              <div className={styles.linksContainer}>
                <button
                  type="button"
                  className={styles.switchLinkBtn}
                  onClick={() => handleModeChange('login')}
                >
                  <span>قبلاً ثبت‌نام کرده‌اید؟</span>
                  <span className={styles.switchLinkBtnStrong}>
                    ورود به حساب
                  </span>
                </button>
              </div>
            </form>
          ) : mode === 'forgot' ? (
            /* FORGOT PASSWORD MODE */
            <form onSubmit={handleForgotSubmit} className={styles.authForm}>
              {errorMessage && (
                <div className={styles.errorBanner}>
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Username or Phone Box */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    نام کاربری یا شماره تماس
                    <span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Phone size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="شماره تماس یا نام کاربری..."
                    className={styles.textInput}
                    value={forgotForm.usernameOrPhone}
                    onChange={(e) =>
                      setForgotForm({
                        ...forgotForm,
                        usernameOrPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* New Password Box with Eye Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    رمز عبور جدید (حداقل ۶ رقم)
                    <span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="رمز عبور جدید..."
                    className={`${styles.textInput} ${styles.textInputWithEye}`}
                    value={forgotForm.password}
                    onChange={(e) =>
                      setForgotForm({ ...forgotForm, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className={`${styles.eyeToggleBtn} ${
                      showForgotNewPassword ? styles.eyeToggleBtnActive : ''
                    }`}
                    onClick={() =>
                      setShowForgotNewPassword(!showForgotNewPassword)
                    }
                    title={showForgotNewPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  >
                    {showForgotNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Box with Eye Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span>
                    تکرار رمز عبور جدید
                    <span className={styles.requiredStar}>*</span>
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showForgotConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="تکرار رمز عبور جدید..."
                    className={`${styles.textInput} ${styles.textInputWithEye}`}
                    value={forgotForm.confirmPassword}
                    onChange={(e) =>
                      setForgotForm({
                        ...forgotForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className={`${styles.eyeToggleBtn} ${
                      showForgotConfirmPassword ? styles.eyeToggleBtnActive : ''
                    }`}
                    onClick={() =>
                      setShowForgotConfirmPassword(!showForgotConfirmPassword)
                    }
                    title={
                      showForgotConfirmPassword ? 'مخفی کردن رمز' : 'نمایش رمز'
                    }
                  >
                    {showForgotConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <KeyRound size={18} />
                <span>ذخیره رمز عبور جدید</span>
              </button>

              <div className={styles.linksContainer}>
                <button
                  type="button"
                  className={styles.switchLinkBtn}
                  onClick={() => handleModeChange('login')}
                >
                  <LogIn size={14} />
                  <span>بازگشت به صفحه ورود</span>
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
