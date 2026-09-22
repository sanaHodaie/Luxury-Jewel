import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import fakeMap from '../assets/images/fake-map.webp';
import galleryShowroomImg from '../assets/images/ChatGPT Image Aug 7, 2026, 09_35_51 PM.webp';
import galleryDisplayImg from '../assets/images/ChatGPT Image Aug 7, 2026, 09_43_52 PM.webp';

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Calendar as CalendarIcon,
  User,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Instagram,
  MessageCircle,
  Gem,
  Award,
  Navigation as NavIcon,
  Car,
  Headphones,
  AlertCircle,
  Check,
  Users,
  BellRing,
} from 'lucide-react';

import styles from './ContactPage.module.css';

import {
  useSiteSettings,
  DEFAULT_CONTACT_PAGE,
} from '../contexts/SiteSettingsContext';

// =========================================================
// Persian Month Names
// =========================================================

const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

// =========================================================
// Helper to convert English digits to Persian
// =========================================================

const toPersianDigits = (num) => {
  const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  return String(num).replace(
    /\d/g,
    (d) => pDigits[parseInt(d, 10)]
  );
};

// =========================================================
// Contact Page
// =========================================================

export const ContactPage = () => {
  const { settings } = useSiteSettings();

  // =======================================================
  // CONTACT PAGE SETTINGS
  // =======================================================

  const contact =
    settings?.contactPage || DEFAULT_CONTACT_PAGE;
    console.log(
  'FAQ FROM SITE SETTINGS:',
  contact?.faq?.items
);

  const quickCards = contact.quickCards || {};

  // =======================================================
  // GLOBAL CONTACT INFORMATION
  // =======================================================

  const tel = String(
    settings?.contactPhone || ''
  ).replace(/[^0-9+]/g, '');

  const wa = String(
    settings?.whatsapp || ''
  ).replace(/[^0-9+]/g, '');

  const phoneUrl = tel
    ? `tel:${tel}`
    : 'tel:02122003344';

  const whatsappUrl =
    contact?.social?.whatsappUrl ||
    (wa
      ? `https://wa.me/${wa.replace(/\+/g, '')}`
      : 'https://wa.me/');

  const instagramUrl =
    contact?.social?.instagramUrl ||
    settings?.instagram ||
    'https://instagram.com';

  const mapsUrl =
    contact?.location?.mapsUrl ||
    'https://maps.google.com';

  // =======================================================
  // CONTACT FORM STATE
  // =======================================================

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'consultation',
    preferredChannel: 'phone',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // =======================================================
  // VIP APPOINTMENT FORM STATE
  // =======================================================

  const [vipData, setVipData] = useState({
    name: '',
    phone: '',
    date: contact.vip.defaultDate,
    timeSlot: '16-18',
    interestCategory: 'bridal',
  });

  const [vipSubmitted, setVipSubmitted] = useState(false);

  // =======================================================
  // JALALI CALENDAR PICKER STATE
  // =======================================================

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1406);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1);
  const [selectedDay, setSelectedDay] = useState(29);

  const datePickerRef = useRef(null);

  // =======================================================
  // FAQ ACCORDION STATE
  // =======================================================

  const [openFaq, setOpenFaq] = useState(0);

  // =======================================================
  // Scroll to top on page mount
  // =======================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, []);

  // =======================================================
  // Close calendar on outside click
  // =======================================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  // =======================================================
  // Update VIP Persian Date
  // =======================================================

  const handleSelectPersianDay = (dayNum) => {
    setSelectedDay(dayNum);

    const dateStr = `${toPersianDigits(dayNum)} ${
      PERSIAN_MONTHS[selectedMonthIndex]
    } ${toPersianDigits(selectedYear)}`;

    setVipData({
      ...vipData,
      date: dateStr,
    });

    setShowCalendar(false);
  };

  // =======================================================
  // Contact Form Submit
  // =======================================================

  const handleContactSubmit = (e) => {
    e.preventDefault();

    setFormError('');

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      setFormError(
        contact.mainForm.messages.validationError ||
          'لطفاً تمامی فیلدهای ضروری (نام، شماره تماس و متن پیام) را تکمیل نمایید.'
      );

      return;
    }

    setFormSubmitted(true);

    setTimeout(() => {
      setFormSubmitted(false);

      setFormData({
        fullName: '',
        phone: '',
        email: '',
        subject: 'consultation',
        preferredChannel: 'phone',
        message: '',
      });
    }, 4000);
  };

  // =======================================================
  // VIP Appointment Submit
  // =======================================================

  const handleVipSubmit = (e) => {
    e.preventDefault();

    if (
      !vipData.name.trim() ||
      !vipData.phone.trim()
    ) {
      return;
    }

    setVipSubmitted(true);

    setTimeout(() => {
      setVipSubmitted(false);

      setVipData({
        name: '',
        phone: '',
        date: contact.vip.defaultDate,
        timeSlot: '16-18',
        interestCategory: 'bridal',
      });
    }, 4000);
  };

  // =======================================================
  // Jalali Month Days
  // =======================================================

  const daysInMonth =
    selectedMonthIndex < 6
      ? 31
      : selectedMonthIndex < 11
        ? 30
        : 29;

  return (
    <div className={styles.pageWrapper}>

      {/* ===================================================
          HERO
      =================================================== */}

      <section className={styles.heroSection}>
        <div className={styles.heroGlowOverlay} />

        <div className={styles.container}>

          {/* Breadcrumb */}

          <nav
            className={styles.breadcrumb}
            aria-label="مسیریابی"
          >
            <Link
              to="/"
              className={styles.breadcrumbLink}
            >
              خانه
            </Link>

            <ChevronLeft
              size={14}
              className={styles.breadcrumbSeparator}
            />

            <span
              className={styles.breadcrumbActive}
            >
              تماس با ما
            </span>
          </nav>

          {/* Hero Grid */}

          <div className={styles.heroGrid}>

            <div className={styles.heroContent}>

              {/* Badge */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                className={styles.badgeGroup}
              >
                <Sparkles
                  size={16}
                  className={styles.sparkleIcon}
                />

                <span>
                  {contact.hero.badge}
                </span>
              </motion.div>

              {/* Title */}

              <motion.h1
                initial={{
                  opacity: 0,
                  y: -40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: 'easeOut',
                }}
                className={styles.heroTitle}
              >
                {contact.hero.title}
              </motion.h1>

              {/* Subtitle */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: 'easeOut',
                }}
                className={styles.heroSubtitle}
              >
                {contact.hero.subtitle}
              </motion.p>

              {/* Action Buttons */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
                className={styles.heroActionBtns}
              >

                <a
                  href="#vip-booking"
                  className={styles.heroPrimaryBtn}
                >
                  <CalendarIcon size={18} />

                  <span>
                    {contact.hero.primaryButtonText}
                  </span>
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.heroSecondaryBtn}
                >
                  <NavIcon size={18} />

                  <span>
                    {contact.hero.secondaryButtonText}
                  </span>
                </a>

                <a
                  href={phoneUrl}
                  className={styles.heroOutlineBtn}
                >
                  <Phone size={18} />

                  <span>
                    {contact.hero.phoneButtonText}
                    {settings?.contactPhone
                      ? `: ${settings.contactPhone}`
                      : ''}
                  </span>
                </a>

              </motion.div>
            </div>

            {/* Hero Gallery */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                x: -30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: 'easeOut',
              }}
              className={styles.heroGalleryCard}
            >
              <div
                className={
                  styles.heroGalleryImgWrapper
                }
              >
                <img
                  src={galleryDisplayImg}
                  alt="نمای اختصاصی گالری ژوئل"
                  className={styles.heroGalleryImg}
                />

                <div
                  className={
                    styles.heroGalleryGradientOverlay
                  }
                />

                <div
                  className={styles.heroGalleryBadge}
                >
                  <Gem size={15} />

                  <span>
                    {contact.gallery.badge}
                  </span>
                </div>

                <div
                  className={
                    styles.heroGalleryCaption
                  }
                >
                  <strong>
                    {contact.gallery.title}
                  </strong>

                  <span>
                    {contact.gallery.description}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================================================
          QUICK CONTACT CARDS
      =================================================== */}

      <section className={styles.quickCardsSection}>
        <div className={styles.container}>

          <div className={styles.cardsGrid}>

            {/* ============ Address ============ */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`${styles.infoCard} ${styles.cardAddress}`}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardPattern} />

              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIconBox} ${styles.iconAddress}`}>
                  <MapPin size={22} />
                </div>
                <span className={styles.cardTag}>
                  <Sparkles size={11} />
                  {quickCards.address?.tagText || 'موقعیت گالری'}
                </span>
              </div>

              <h3 className={styles.cardTitle}>
                {quickCards.address?.title}
              </h3>

              <p className={styles.cardDetail}>
                {quickCards.address?.detail ||
                  settings?.contactAddress ||
                  ''}
              </p>

              {/* Mini Map */}


              {/* Parking */}
              <div className={styles.cardChip}>
                <Car size={13} />
                <span>{quickCards.address?.subText}</span>
              </div>

              {/* Action */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardActionBtn}
              >
                <NavIcon size={15} />
                <span>
                  {quickCards.address?.actionText ||
                    'مسیریابی روی نقشه'}
                </span>
                <ChevronLeft size={13} className={styles.cardActionArrow} />
              </a>
            </motion.div>

            {/* ============ Working Hours ============ */}
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${styles.infoCard} ${styles.cardHours}`}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardPattern} />

              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIconBox} ${styles.iconHours}`}>
                  <Clock size={22} />
                </div>
                <span className={styles.cardTag}>
                  <span className={styles.cardTagLiveDot} />
                  {quickCards.hours?.liveText || 'اکنون باز است'}
                </span>
              </div>

              <h3 className={styles.cardTitle}>
                {quickCards.hours?.title}
              </h3>

              <p className={styles.cardDetail}>
                {quickCards.hours?.description ||
                  'برای مشاوره اختصاصی و بازدید از کالکشن‌ها در ساعات زیر منتظر شما هستیم.'}
              </p>

              {/* Hours List */}
              <div className={styles.hoursList}>
                {quickCards.hours?.rows?.map((row, index) => (
                  <div className={styles.hoursRow} key={index}>
                    <div className={styles.hoursRowDot} />
                    <span className={styles.hoursRowLabel}>
                      {row.label}
                    </span>
                    <strong className={styles.hoursRowValue}>
                      {row.value}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className={`${styles.cardChip} ${styles.cardChipAmber}`}>
                <AlertCircle size={13} />
                <span>
                  {quickCards.hours?.noteText ||
                    'پنجشنبه‌ها تا ۲۰:۰۰ و جمعه‌ها با وقت قبلی'}
                </span>
              </div>
            </motion.div>

            {/* ============ Phone ============ */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`${styles.infoCard} ${styles.cardPhone}`}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardPattern} />

              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIconBox} ${styles.iconPhone}`}>
                  <Phone size={22} />
                  <span className={styles.iconLiveDot} />
                </div>
                <span className={styles.cardTag}>
                  <Headphones size={11} />
                  {quickCards.phone?.responseText || 'پاسخگویی سریع'}
                </span>
              </div>

              <h3 className={styles.cardTitle}>
                {quickCards.phone?.title}
              </h3>

              <p className={styles.cardDetail}>
                {quickCards.phone?.description ||
                  'کارشناسان ما آماده پاسخگویی و مشاوره تخصصی جواهرات هستند.'}
              </p>

              {/* Phone List */}
              <div className={styles.phoneList}>

                {/* Office */}
                <a href={phoneUrl} className={styles.phoneRow}>
                  <div className={styles.phoneRowIcon}>
                    <Phone size={15} />
                  </div>
                  <div className={styles.phoneRowContent}>
                    <span className={styles.phoneRowLabel}>
                      {quickCards.phone?.officeLabel}
                    </span>
                    <strong className={styles.phoneRowNumber}>
                      {settings?.contactPhone || ''}
                    </strong>
                  </div>
                  <div className={styles.phoneRowCall}>
                    <Phone size={13} />
                  </div>
                </a>

                {/* VIP */}
                <a
                  href={wa ? `tel:${wa}` : phoneUrl}
                  className={`${styles.phoneRow} ${styles.phoneRowVip}`}
                >
                  <div className={styles.phoneRowIcon}>
                    <Gem size={15} />
                  </div>
                  <div className={styles.phoneRowContent}>
                    <span className={styles.phoneRowLabel}>
                      {quickCards.phone?.vipLabel}
                    </span>
                    <strong className={styles.phoneRowNumber}>
                      {settings?.whatsapp || ''}
                    </strong>
                  </div>
                  <div className={styles.phoneRowCall}>
                    <Phone size={13} />
                  </div>
                </a>

              </div>

              {/* Trust Footer */}
              <div className={styles.cardTrust}>
                <ShieldCheck size={13} />
                <span>
                  {quickCards.phone?.trustText || 'تماس امن و محرمانه'}
                </span>
                <div className={styles.trustDots}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </motion.div>

            {/* ============ WhatsApp ============ */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${styles.infoCard} ${styles.cardWhatsapp}`}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardPattern} />

              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIconBox} ${styles.iconWhatsapp}`}>
                  <MessageCircle size={22} />
                  <span className={styles.iconLiveDot} />
                </div>
                <span className={styles.cardTag}>
                  <Sparkles size={11} />
                  {quickCards.whatsapp?.liveText || 'آنلاین ۲۴/۷'}
                </span>
              </div>

              <h3 className={styles.cardTitle}>
                {quickCards.whatsapp?.title}
              </h3>

              <p className={styles.cardDetail}>
                {quickCards.whatsapp?.description}
              </p>

              {/* WhatsApp Preview */}
              <div className={styles.waPreview}>
                <div className={styles.waBubble}>
                  <span className={styles.waBubbleText}>
                    {quickCards.whatsapp?.previewText ||
                      'سلام، در خدمت شما هستیم 💎'}
                  </span>
                  <span className={styles.waBubbleTime}>✓✓</span>
                </div>
              </div>

              {/* Action */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.cardActionBtn} ${styles.actionWhatsapp}`}
              >
                <MessageCircle size={15} />
                <span>{quickCards.whatsapp?.buttonText}</span>
                <ChevronLeft size={13} className={styles.cardActionArrow} />
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================================================
          MAIN FORMS
      =================================================== */}

      <section className={styles.mainFormsSection}>
        <div className={styles.container}>

          <div className={styles.formsLayoutGrid}>

            {/* Main Contact Form */}

            <motion.div
              initial={{
                opacity: 0,
                x: 70,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: '-60px',
              }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
              className={styles.formContainerCard}
            >

              <div className={styles.formHeader}>

                <div
                  className={
                    styles.formHeaderBadge
                  }
                >
                  <Send size={15} />

                  <span>
                    {contact.mainForm.badge}
                  </span>
                </div>

                <h2
                  className={styles.formMainTitle}
                >
                  {contact.mainForm.title}
                </h2>

                <p
                  className={styles.formSubTitle}
                >
                  {contact.mainForm.subtitle}
                </p>

              </div>

              {formSubmitted ? (

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className={styles.successAlertBox}
                >
                  <CheckCircle2
                    size={48}
                    className={styles.successIcon}
                  />

                  <h3>
                    {contact.mainForm.messages.successTitle}
                  </h3>

                  <p>
                    {contact.mainForm.messages.successDescription}
                  </p>
                </motion.div>

              ) : (

                <form
                  onSubmit={handleContactSubmit}
                  className={styles.contactForm}
                >

                  {formError && (
                    <div
                      className={
                        styles.errorBanner
                      }
                    >
                      <AlertCircle size={18} />

                      <span>
                        {formError}
                      </span>
                    </div>
                  )}

                  {/* Full Name + Phone */}

                  <div
                    className={
                      styles.formRowTwoCols
                    }
                  >

                    <div
                      className={styles.formField}
                    >
                      <label
                        className={
                          styles.fieldLabel
                        }
                      >
                        <span className={styles.labelText}>
                          {
                            contact.mainForm.fields
                              .fullNameLabel
                          }
                          <span
                            className={
                              styles.requiredStar
                            }
                          >
                            *
                          </span>
                        </span>
                      </label>

                      <div
                        className={
                          styles.inputIconWrapper
                        }
                      >
                        <User
                          size={18}
                          className={
                            styles.fieldIcon
                          }
                        />

                        <input
                          type="text"
                          required
                          placeholder={
                            contact.mainForm.fields
                              .fullNamePlaceholder
                          }
                          value={
                            formData.fullName
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName:
                                e.target.value,
                            })
                          }
                          className={
                            styles.textInput
                          }
                        />
                      </div>
                    </div>

                    <div
                      className={styles.formField}
                    >
                      <label
                        className={
                          styles.fieldLabel
                        }
                      >
                        <span className={styles.labelText}>
                          {
                            contact.mainForm.fields
                              .phoneLabel
                          }
                          <span
                            className={
                              styles.requiredStar
                            }
                          >
                            *
                          </span>
                        </span>
                      </label>

                      <div
                        className={
                          styles.inputIconWrapper
                        }
                      >
                        <Phone
                          size={18}
                          className={
                            styles.fieldIcon
                          }
                        />

                        <input
                          type="tel"
                          required
                          placeholder={
                            contact.mainForm.fields
                              .phonePlaceholder
                          }
                          value={
                            formData.phone
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone:
                                e.target.value,
                            })
                          }
                          className={`${styles.textInput} ${styles.phoneInput}`}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Email + Subject */}

                  <div
                    className={
                      styles.formRowTwoCols
                    }
                  >

                    <div
                      className={styles.formField}
                    >
                      <label
                        className={
                          styles.fieldLabel
                        }
                      >
                        <span className={styles.labelText}>
                          {
                            contact.mainForm.fields
                              .emailLabel
                          }
                        </span>
                      </label>

                      <div
                        className={
                          styles.inputIconWrapper
                        }
                      >
                        <Mail
                          size={18}
                          className={
                            styles.fieldIcon
                          }
                        />

                        <input
                          type="email"
                          placeholder={
                            contact.mainForm.fields
                              .emailPlaceholder
                          }
                          value={
                            formData.email
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email:
                                e.target.value,
                            })
                          }
                          className={`${styles.textInput} ${styles.emailInput}`}
                        />
                      </div>
                    </div>

                    <div
                      className={styles.formField}
                    >
                      <label
                        className={
                          styles.fieldLabel
                        }
                      >
                        <span className={styles.labelText}>
                          {
                            contact.mainForm.fields
                              .subjectLabel
                          }
                        </span>
                      </label>

                      <select
                        value={
                          formData.subject
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subject:
                              e.target.value,
                          })
                        }
                        className={
                          styles.selectInput
                        }
                      >

                        {contact.mainForm.subjects.map(
                          (item) => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </option>
                          )
                        )}

                      </select>
                    </div>

                  </div>

                  {/* Preferred Channel */}

                  <div
                    className={styles.formField}
                  >
                    <label
                      className={
                        styles.fieldLabel
                      }
                    >
                      <span className={styles.labelText}>
                        {
                          contact.mainForm.fields
                            .preferredChannelLabel
                        }
                      </span>
                    </label>

                    <div
                      className={
                        styles.radioGroupRow
                      }
                    >

                      {contact.mainForm.channels.map(
                        (channel) => (
                          <label
                            key={channel.value}
                            className={`${
                              styles.radioLabel
                            } ${
                              formData.preferredChannel ===
                              channel.value
                                ? styles.radioSelected
                                : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredChannel"
                              value={channel.value}
                              checked={
                                formData.preferredChannel ===
                                channel.value
                              }
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  preferredChannel:
                                    channel.value,
                                })
                              }
                            />

                            <span>
                              {channel.label}
                            </span>
                          </label>
                        )
                      )}

                    </div>
                  </div>

                  {/* Message */}

                  <div
                    className={styles.formField}
                  >
                    <label
                      className={
                        styles.fieldLabel
                      }
                    >
                      <span className={styles.labelText}>
                        {
                          contact.mainForm.fields
                            .messageLabel
                        }
                        <span
                          className={
                            styles.requiredStar
                          }
                        >
                          *
                        </span>
                      </span>
                    </label>

                    <textarea
                      required
                      rows={5}
                      placeholder={
                        contact.mainForm.fields
                          .messagePlaceholder
                      }
                      value={
                        formData.message
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message:
                            e.target.value,
                        })
                      }
                      className={
                        styles.textareaInput
                      }
                    />

                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                  >
                    <Send size={18} />

                    <span>
                      {
                        contact.mainForm.fields
                          .submitButtonText
                      }
                    </span>
                  </button>

                </form>
              )}

            </motion.div>

            {/* =================================================
                VIP BOOKING
            ================================================= */}

            <motion.div
              id="vip-booking"
              initial={{
                opacity: 0,
                x: -70,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: '-60px',
              }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
              className={styles.vipCard}
            >

              <div className={styles.vipHeader}>

                <div
                  className={styles.vipBadge}
                >
                  <Gem size={16} />

                  <span>
                    {contact.vip.badge}
                  </span>
                </div>

                <h3
                  className={styles.vipTitle}
                >
                  {contact.vip.title}
                </h3>

                <p
                  className={styles.vipSubtitle}
                >
                  {contact.vip.subtitle}
                </p>

              </div>

              {vipSubmitted ? (

                <div
                  className={
                    styles.vipSuccessNotice
                  }
                >
                  <CheckCircle2
                    size={40}
                    className={
                      styles.vipSuccessIcon
                    }
                  />

                  <h4>
                    {contact.vip.successMessage.title}
                  </h4>

                  <p>
                    {contact.vip.successMessage.description}
                  </p>
                </div>

              ) : (

                <form
                  onSubmit={handleVipSubmit}
                  className={styles.vipForm}
                >

                  {/* Name */}

                  <div
                    className={styles.formField}
                  >
                    <label
                      className={
                        styles.fieldLabel
                      }
                    >
                      <span className={styles.labelText}>
                        {contact.vip.fields.nameLabel}
                        <span
                          className={
                            styles.requiredStar
                          }
                        >
                          *
                        </span>
                      </span>
                    </label>

                    <input
                      type="text"
                      required
                      placeholder={
                        contact.vip.fields
                          .namePlaceholder
                      }
                      value={vipData.name}
                      onChange={(e) =>
                        setVipData({
                          ...vipData,
                          name: e.target.value,
                        })
                      }
                      className={
                        styles.textInput
                      }
                    />
                  </div>

                  {/* Phone */}

                  <div
                    className={styles.formField}
                  >
                    <label
                      className={
                        styles.fieldLabel
                      }
                    >
                      <span className={styles.labelText}>
                        {contact.vip.fields.phoneLabel}
                        <span
                          className={
                            styles.requiredStar
                          }
                        >
                          *
                        </span>
                      </span>
                    </label>

                    <input
                      type="tel"
                      required
                      placeholder={
                        contact.vip.fields
                          .phonePlaceholder
                      }
                      value={vipData.phone}
                      onChange={(e) =>
                        setVipData({
                          ...vipData,
                          phone: e.target.value,
                        })
                      }
                      className={`${styles.textInput} ${styles.phoneInput}`}
                    />
                  </div>

                  {/* Persian Date Picker */}

                  <div
                    className={styles.formField}
                    ref={datePickerRef}
                  >
                    <label
                      className={
                        styles.fieldLabel
                      }
                    >
                      <span className={styles.labelText}>
                        {contact.vip.fields.dateLabel}
                        <span
                          className={
                            styles.requiredStar
                          }
                        >
                          *
                        </span>
                      </span>
                    </label>

                    <div
                      className={
                        styles.shamsiDatePickerWrapper
                      }
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setShowCalendar(
                            !showCalendar
                          )
                        }
                        className={
                          styles.shamsiTriggerBtn
                        }
                      >
                        <CalendarIcon
                          size={18}
                          className={
                            styles.shamsiCalIcon
                          }
                        />

                        <span
                          className={
                            styles.shamsiValText
                          }
                        >
                          {vipData.date}
                        </span>

                        <ChevronDown
                          size={16}
                          className={
                            styles.shamsiArrowIcon
                          }
                        />
                      </button>

                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 10,
                              scale: 0.95,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: 10,
                              scale: 0.95,
                            }}
                            transition={{
                              duration: 0.2,
                            }}
                            className={
                              styles.calendarPopover
                            }
                          >

                            <div
                              className={
                                styles.calHeaderRow
                              }
                            >

                              <button
                                type="button"
                                className={
                                  styles.calNavBtn
                                }
                                onClick={() => {
                                  if (
                                    selectedMonthIndex >
                                    0
                                  ) {
                                    setSelectedMonthIndex(
                                      selectedMonthIndex -
                                        1
                                    );
                                  } else {
                                    setSelectedMonthIndex(
                                      11
                                    );

                                    setSelectedYear(
                                      selectedYear -
                                        1
                                    );
                                  }
                                }}
                              >
                                <ChevronRight
                                  size={18}
                                />
                              </button>

                              <div
                                className={
                                  styles.calTitleGroup
                                }
                              >
                                <strong>
                                  {
                                    PERSIAN_MONTHS[
                                      selectedMonthIndex
                                    ]
                                  }
                                </strong>

                                <span>
                                  {toPersianDigits(
                                    selectedYear
                                  )}
                                </span>
                              </div>

                              <button
                                type="button"
                                className={
                                  styles.calNavBtn
                                }
                                onClick={() => {
                                  if (
                                    selectedMonthIndex <
                                    11
                                  ) {
                                    setSelectedMonthIndex(
                                      selectedMonthIndex +
                                        1
                                    );
                                  } else {
                                    setSelectedMonthIndex(
                                      0
                                    );

                                    setSelectedYear(
                                      selectedYear +
                                        1
                                    );
                                  }
                                }}
                              >
                                <ChevronLeft
                                  size={18}
                                />
                              </button>

                            </div>

                            <div
                              className={
                                styles.calWeekGrid
                              }
                            >
                              <span>ش</span>
                              <span>ی</span>
                              <span>د</span>
                              <span>س</span>
                              <span>چ</span>
                              <span>پ</span>
                              <span>ج</span>
                            </div>

                            <div
                              className={
                                styles.calDaysGrid
                              }
                            >
                              {Array.from(
                                {
                                  length: daysInMonth,
                                },
                                (_, i) => i + 1
                              ).map((d) => {

                                const isSelected =
                                  d === selectedDay;

                                return (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() =>
                                      handleSelectPersianDay(
                                        d
                                      )
                                    }
                                    className={`${
                                      styles.calDayBtn
                                    } ${
                                      isSelected
                                        ? styles.calDaySelected
                                        : ''
                                    }`}
                                  >
                                    {toPersianDigits(d)}
                                  </button>
                                );

                              })}
                            </div>

                            <div
                              className={
                                styles.calFooterBar
                              }
                            >

                              <span
                                className={
                                  styles.yearSelectLabel
                                }
                              >
                                سال:
                              </span>

                              <div
                                className={
                                  styles.yearBtns
                                }
                              >

                                <button
                                  type="button"
                                  className={`${
                                    styles.yearBtn
                                  } ${
                                    selectedYear ===
                                    1405
                                      ? styles.yearActive
                                      : ''
                                  }`}
                                  onClick={() =>
                                    setSelectedYear(
                                      1405
                                    )
                                  }
                                >
                                  ۱۴۰۵
                                </button>

                                <button
                                  type="button"
                                  className={`${
                                    styles.yearBtn
                                  } ${
                                    selectedYear ===
                                    1406
                                      ? styles.yearActive
                                      : ''
                                  }`}
                                  onClick={() =>
                                    setSelectedYear(
                                      1406
                                    )
                                  }
                                >
                                  ۱۴۰۶
                                </button>

                              </div>
                            </div>

                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>

                  {/* Time Slot */}

                  <div
                    className={styles.formField}
                  >
                    <label
                      className={
                        styles.fieldLabel
                      }
                    >
                      <span className={styles.labelText}>
                        {contact.vip.fields.timeLabel}
                      </span>
                    </label>

                    <select
                      value={
                        vipData.timeSlot
                      }
                      onChange={(e) =>
                        setVipData({
                          ...vipData,
                          timeSlot:
                            e.target.value,
                        })
                      }
                      className={
                        styles.selectInput
                      }
                    >

                      {contact.vip.timeSlots.map(
                        (slot) => (
                          <option
                            key={slot.value}
                            value={slot.value}
                          >
                            {slot.label}
                          </option>
                        )
                      )}

                    </select>
                  </div>

                  {/* Interest */}

                  <div
                    className={styles.formField}
                  >
                    <label
                      className={
                        styles.fieldLabel
                      }
                    >
                      <span className={styles.labelText}>
                        {
                          contact.vip.fields
                            .interestLabel
                        }
                      </span>
                    </label>

                    <select
                      value={
                        vipData.interestCategory
                      }
                      onChange={(e) =>
                        setVipData({
                          ...vipData,
                          interestCategory:
                            e.target.value,
                        })
                      }
                      className={
                        styles.selectInput
                      }
                    >

                      {contact.vip.interests.map(
                        (interest) => (
                          <option
                            key={interest.value}
                            value={interest.value}
                          >
                            {interest.label}
                          </option>
                        )
                      )}

                    </select>
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className={
                      styles.vipSubmitBtn
                    }
                  >
                    <CalendarIcon size={18} />

                    <span>
                      {
                        contact.vip.fields
                          .submitButtonText
                      }
                    </span>
                  </button>

                  {/* Trust Note */}

                  <div
                    className={
                      styles.vipTrustNote
                    }
                  >
                    <ShieldCheck size={16} />

                    <span>
                      {contact.vip.trustNote}
                    </span>
                  </div>

                </form>
              )}

            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================================================
          LOCATION
      =================================================== */}

      <section className={styles.mapSection}>
        <div className={styles.container}>

          {/* Location Header */}

          <motion.div
            initial={{
              opacity: 0,
              y: -30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-50px',
            }}
            transition={{
              duration: 0.6,
            }}
            className={
              styles.locationHeaderCentered
            }
          >

            <div className={styles.sectionTag}>
              <MapPin size={16} />

              <span>
                {contact.location.tag}
              </span>
            </div>

            <h2 className={styles.mapTitle}>
              {contact.location.title}
            </h2>

            <p
              className={
                styles.mapDescCentered
              }
            >
              {contact.location.description}
            </p>

          </motion.div>

          {/* Location Content */}

          <div
            className={
              styles.locationContentGrid
            }
          >

            {/* RIGHT SIDE */}

            <motion.div
              initial={{
                opacity: 0,
                x: 50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: '-50px',
              }}
              transition={{
                duration: 0.7,
              }}
              className={
                styles.locationRightSide
              }
            >

              <div
                className={
                  styles.showroomFrameWrapper
                }
              >
                <img
                  src={galleryShowroomImg}
                  alt="تصویر شو روم مرکزی گالری فرشته"
                  className={
                    styles.showroomImg
                  }
                  loading="lazy"
                />

                <div
                  className={
                    styles.showroomOverlay
                  }
                />

                <div
                  className={
                    styles.showroomLabelBadge
                  }
                >
                  <Gem size={16} />

                  <span>
                    {contact.location.showroomBadge}
                  </span>
                </div>
              </div>

              {/* Access Features */}

              <div
                className={
                  styles.accessFeaturesGrid
                }
              >

                {contact.location.accessFeatures.map(
                  (feature, index) => {

                    const icons = [
                      Car,
                      ShieldCheck,
                      Award,
                    ];

                    const FeatureIcon =
                      icons[index] || Check;

                    return (
                      <div
                        className={
                          styles.accessItem
                        }
                        key={index}
                      >
                        <FeatureIcon
                          size={20}
                          className={
                            styles.accessIcon
                          }
                        />

                        <div>
                          <strong>
                            {feature}
                          </strong>
                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            </motion.div>

            {/* LEFT SIDE MAP */}

            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: '-50px',
              }}
              transition={{
                duration: 0.7,
              }}
              className={
                styles.locationLeftSide
              }
            >

              <div
                className={
                  styles.mapFrameWrapper
                }
              >
                <img
                  src={fakeMap}
                  alt="نقشه موقعیت شو روم مرکزی گالری فرشته"
                  className={styles.mapImage}
                  loading="lazy"
                />

                <div
                  className={
                    styles.mapOverlay
                  }
                />

                <div
                  className={
                    styles.mapPinPulse
                  }
                >
                  <div
                    className={
                      styles.pinDot
                    }
                  >
                    💎
                  </div>

                  <div
                    className={
                      styles.pulseRing
                    }
                  />
                </div>

                <div
                  className={
                    styles.mapLabelCard
                  }
                >
                  <strong>
                    {contact.location.mapTitle}
                  </strong>

                  <span>
                    {contact.location.mapAddress ||
                      settings?.contactAddress ||
                      ''}
                  </span>
                </div>

              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.mapDirectBtn
                }
              >
                <NavIcon size={18} />

                <span>
                  {contact.location.mapButtonText}
                </span>
              </a>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================================================
          FAQ + SOCIAL
      =================================================== */}

      <section
        className={
          styles.faqAndSocialSection
        }
      >
        <div className={styles.container}>

          <div
            className={
              styles.faqSocialGrid
            }
          >

            {/* SOCIAL */}

            <motion.div
              initial={{
                opacity: 0,
                x: 50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: '-40px',
              }}
              transition={{
                duration: 0.7,
              }}
              className={
                styles.socialMembershipCard
              }
            >

              <div
                className={
                  styles.socialCardHeader
                }
              >

                <div
                  className={
                    styles.socialBadge
                  }
                >
                  <Users size={16} />

                  <span>
                    {contact.social.badge}
                  </span>
                </div>

                <h2
                  className={
                    styles.socialTitle
                  }
                >
                  {contact.social.title}
                </h2>

                <p
                  className={
                    styles.socialDesc
                  }
                >
                  {contact.social.description}
                </p>

              </div>

              {/* Benefits */}

              <div
                className={
                  styles.socialBenefitsList
                }
              >

                {contact.social.benefits.map(
                  (benefit, index) => (
                    <div
                      className={
                        styles.socialBenefitItem
                      }
                      key={index}
                    >
                      <CheckCircle2
                        size={18}
                        className={
                          styles.socialBenefitIcon
                        }
                      />

                      <span>
                        {benefit}
                      </span>
                    </div>
                  )
                )}

              </div>

              {/* Social Buttons */}

              <div
                className={
                  styles.socialBtnsGrid
                }
              >

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    styles.socialInstaBtn
                  }
                >
                  <Instagram size={20} />

                  <span>
                    {contact.social.instagramLabel}
                  </span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    styles.socialWaBtn
                  }
                >
                  <MessageCircle size={20} />

                  <span>
                    {contact.social.whatsappLabel}
                  </span>
                </a>

              </div>

              <div
                className={
                  styles.socialLiveBadge
                }
              >
                <BellRing size={15} />

                <span>
                  {contact.social.liveBadge}
                </span>
              </div>

            </motion.div>

            {/* FAQ */}

            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: '-40px',
              }}
              transition={{
                duration: 0.7,
              }}
              className={
                styles.faqSectionWrapper
              }
            >

              <div
                className={
                  styles.faqHeaderCompact
                }
              >

                <span
                  className={
                    styles.subTag
                  }
                >
                  {contact.faq.tag}
                </span>

                <h2
                  className={
                    styles.faqTitleCompact
                  }
                >
                  {contact.faq.title}
                </h2>

                <p
                  className={
                    styles.faqDescCompact
                  }
                >
                  {contact.faq.description}
                </p>

              </div>

              <div
                className={
                  styles.faqListCompact
                }
              >

                {contact.faq.items.map(
                  (item, index) => {

                    const isOpen =
                      openFaq === index;

                    return (
                      <div
                        key={index}
                        className={`${
                          styles.faqCard
                        } ${
                          isOpen
                            ? styles.faqCardOpen
                            : ''
                        }`}
                      >

                        <button
                          type="button"
                          className={
                            styles.faqQuestionBtn
                          }
                          onClick={() =>
                            setOpenFaq(
                              isOpen
                                ? -1
                                : index
                            )
                          }
                        >
                          <span>
                            {item.question}
                          </span>

                          <ChevronDown
                            size={18}
                            className={`${
                              styles.faqChevron
                            } ${
                              isOpen
                                ? styles.faqChevronRotate
                                : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>

                          {isOpen && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: 'auto',
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                              }}
                              transition={{
                                duration: 0.25,
                              }}
                              className={
                                styles.faqAnswerBox
                              }
                            >
                              <p
                                className={
                                  styles.faqAnswerText
                                }
                              >
                                {item.answer}
                              </p>
                            </motion.div>
                          )}

                        </AnimatePresence>

                      </div>
                    );
                  }
                )}

              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;