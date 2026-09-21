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
import { useSiteSettings } from '../contexts/SiteSettingsContext';

// Persian Month Names
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

// Helper to convert English digits to Persian
const toPersianDigits = (num) => {
  const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
};

export const ContactPage = () => {
  const { settings } = useSiteSettings();
  const tel = String(settings.contactPhone||'').replace(/[^0-9+]/g,'');
  const wa = String(settings.whatsapp||'').replace(/[^0-9+]/g,'');
  // Contact Form State
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

  // VIP Appointment Form State
  const [vipData, setVipData] = useState({
    name: '',
    phone: '',
    date: '۲۹ اردیبهشت ۱۴۰۶', // Default Persian date
    timeSlot: '16-18',
    interestCategory: 'bridal',
  });
  const [vipSubmitted, setVipSubmitted] = useState(false);

  // Jalali / Persian Calendar Picker State
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1406);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1); // اردیبهشت
  const [selectedDay, setSelectedDay] = useState(29);
  const datePickerRef = useRef(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Close calendar popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update VIP Date String when Persian date changes
  const handleSelectPersianDay = (dayNum) => {
    setSelectedDay(dayNum);
    const dateStr = `${toPersianDigits(dayNum)} ${PERSIAN_MONTHS[selectedMonthIndex]} ${toPersianDigits(selectedYear)}`;
    setVipData({ ...vipData, date: dateStr });
    setShowCalendar(false);
  };

  // Handle Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setFormError('لطفاً تمامی فیلدهای ضروری (نام، شماره تماس و متن پیام) را تکمیل نمایید.');
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

  // Handle VIP Appointment Submit
  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (!vipData.name.trim() || !vipData.phone.trim()) {
      return;
    }

    setVipSubmitted(true);
    setTimeout(() => {
      setVipSubmitted(false);
      setVipData({
        name: '',
        phone: '',
        date: '۲۹ اردیبهشت ۱۴۰۶',
        timeSlot: '16-18',
        interestCategory: 'bridal',
      });
    }, 4000);
  };

  const faqItems = [
    {
      q: 'آیا برای مراجعه حضوری به گالری فرشته، نیاز به رزرو وقت قبلی است؟',
      a: 'برای بازدید از شو روم عمومی نیازی به رزرو نیست، اما جهت دریافت مشاوره اختصاصی طلا و برلیان و سرویس‌های عروس در اتاق VIP، پیشنهاد می‌کنیم از طریق فرم همین صفحه وقت ملاقات اختصاصی خود را رزرو فرمایید تا کارشناسان ارشد ما در محیطی آرام و بدون معطلی پذیرای شما باشند.',
    },
    {
      q: 'شرایط سفارش ساخت طلا با طرح و عکس اختصاصی مشتری چگونه است؟',
      a: 'شما می‌توانید عکس یا طرح مد نظر خود را از طریق فرم تماس یا واتس‌اپ پشتیبانی ارسال کنید. تیم طراحی ۳بعدی ژوئل، ابتدا رندر دقیق محصول را همراه با وزن دقیق طلا و قیمت تخمینی به شما ارائه می‌دهد و پس از تایید اولیه، ساخت آن ظرف ۵ الی ۷ روز کاری انجام می‌شود.',
    },
    {
      q: 'نحوه ارسال سفارش‌های آنلاین به تهران و شهرستان‌ها چگونه است؟',
      a: 'کلیه سفارش‌های تهران توسط پیک اختصاصی بیمه‌شده همراه با فاکتور رسمی و شناسنامه بین‌المللی تحویل داده می‌شوند. سفارش‌های شهرستان نیز با پست پیشتاز بیمه‌شده یا باربری اختصاصی گاوصندوقی ارسال شده و تحویل کد پیگیری در کوتاه‌ترین زمان انجام می‌پذیرد.',
    },
    {
      q: 'آیا طلا و جواهرات خریداری‌شده دارای ضمانت بازخرید و فاکتور رسمی هستند؟',
      a: 'بله، تمامی محصولات گالری ژوئل همراه با فاکتور رسمی اتحادیه طلا و جواهر (با قید عیار ۱۸، وزن دقیق، مشخصات برلیان و کدهای شناسنامه GIA) صادر می‌شوند و گالری تعهد ۱۰۰٪ بازخرید و تعویض با فاکتور را تضمین می‌نماید.',
    },
  ];

  // Total days in selected Jalali Month
  const daysInMonth = selectedMonthIndex < 6 ? 31 : selectedMonthIndex < 11 ? 30 : 29;

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Header Section with Gallery Image */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlowOverlay} />

        <div className={styles.container}>
          {/* Breadcrumb Navigation */}
          <nav className={styles.breadcrumb} aria-label="مسیریابی">
            <Link to="/" className={styles.breadcrumbLink}>
              خانه
            </Link>
            <ChevronLeft size={14} className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbActive}>تماس با ما</span>
          </nav>

          {/* Hero Grid with Title & Gallery Image Side-by-Side */}
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={styles.badgeGroup}
              >
                <Sparkles size={16} className={styles.sparkleIcon} />
                <span>ارتباط با گالری لوکس ژوئل • پاسخگویی ۲۴ ساعته</span>
              </motion.div>

              {/* Title Animated */}
              <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                className={styles.heroTitle}
              >
                ارتباط با کارشناسان <span className={styles.goldGlowText}>Luxury Jewel</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className={styles.heroSubtitle}
              >
                مشاوره تخصصی خرید طلا، جواهرات مرصع و برلیان، سفارش ساخت اختصاصی و رزرو وقت
                ملاقات VIP در شو روم مرکزی الهیه. همراهی با شما افتخار ماست.
              </motion.p>

              {/* Quick Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={styles.heroActionBtns}
              >
                <a href="#vip-booking" className={styles.heroPrimaryBtn}>
                  <CalendarIcon size={18} />
                  <span>رزرو وقت ملاقات VIP</span>
                </a>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.heroSecondaryBtn}
                >
                  <NavIcon size={18} />
                  <span>مسیریابی شو روم الهیه</span>
                </a>

                <a href="tel:02122003344" className={styles.heroOutlineBtn}>
                  <Phone size={18} />
                  <span>تماس مستقیم: {settings.contactPhone}</span>
                </a>
              </motion.div>
            </div>

            {/* Gallery Image Box in Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className={styles.heroGalleryCard}
            >
              <div className={styles.heroGalleryImgWrapper}>
                <img
                  src={galleryDisplayImg}
                  alt="نمای اختصاصی گالری ژوئل"
                  className={styles.heroGalleryImg}
                />
                <div className={styles.heroGalleryGradientOverlay} />
                <div className={styles.heroGalleryBadge}>
                  <Gem size={15} />
                  <span>شو روم اختصاصی الهیه</span>
                </div>
                <div className={styles.heroGalleryCaption}>
                  <strong>گالری جواهرات مدرن ژوئل</strong>
                  <span>محیطی آرام و اختصاصی برای انتخاب طلا و برلیان</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact Info Cards Grid */}
      <section className={styles.quickCardsSection}>
        <div className={styles.container}>
          <div className={styles.cardsGrid}>
            {/* Card 1: Address */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={styles.infoCard}
            >
              <div className={styles.cardIconWrapper}>
                <MapPin size={24} />
              </div>
              <h3 className={styles.cardTitle}>آدرس شو روم مرکزی</h3>
              <p className={styles.cardDetail}>
                {settings.contactAddress}
              </p>
              <div className={styles.cardSubText}>
                <Car size={14} />
                <span>دارای پارکینگ اختصاصی VIP برای خریداران</span>
              </div>
            </motion.div>

            {/* Card 2: Working Hours */}
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={styles.infoCard}
            >
              <div className={styles.cardIconWrapper}>
                <Clock size={24} />
              </div>
              <h3 className={styles.cardTitle}>ساعات کاری گالری</h3>
              <div className={styles.hoursList}>
                <div className={styles.hoursRow}>
                  <span>شنبه تا پنج‌شنبه:</span>
                  <strong>۱۰:۰۰ الی ۲۱:۰۰</strong>
                </div>
                <div className={styles.hoursRow}>
                  <span>جمعه‌ها و ایام تعطیل:</span>
                  <strong>۱۵:۰۰ الی ۲۰:۰۰ (با هماهنگی)</strong>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Phone */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={styles.infoCard}
            >
              <div className={styles.cardIconWrapper}>
                <Phone size={24} />
              </div>
              <h3 className={styles.cardTitle}>شماره‌های تماس و مشاوره</h3>
              <div className={styles.phoneList}>
                <a href="tel:02122003344" className={styles.phoneLink}>
                  <span>تلفن دفتر مرکزی:</span>
                  <strong>{settings.contactPhone}</strong>
                </a>
                <a href="tel:09123456789" className={styles.phoneLink}>
                  <span>مشاوره و همراه VIP:</span>
                  <strong>{settings.whatsapp}</strong>
                </a>
              </div>
            </motion.div>

            {/* Card 4: WhatsApp & Support */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={styles.infoCard}
            >
              <div className={styles.cardIconWrapper}>
                <Headphones size={24} />
              </div>
              <h3 className={styles.cardTitle}>مشاوره آنلاین و واتس‌اپ</h3>
              <p className={styles.cardDetail}>
                ارسال مشاوره تصویری، استعلام آنلاین قیمت زنده طلا و پاسخگویی سریع توسط کارشناسان.
              </p>
              <a
                href="https://wa.me/989123456789"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappCardBtn}
              >
                <MessageCircle size={16} />
                <span>ارتباط مستقیم در واتس‌اپ</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Interactive Grid: Contact Form & VIP Booking */}
      <section className={styles.mainFormsSection}>
        <div className={styles.container}>
          <div className={styles.formsLayoutGrid}>
            {/* Main Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={styles.formContainerCard}
            >
              <div className={styles.formHeader}>
                <div className={styles.formHeaderBadge}>
                  <Send size={15} />
                  <span>پیام مستقیم</span>
                </div>
                <h2 className={styles.formMainTitle}>ارسال پیام و درخواست مشاوره</h2>
                <p className={styles.formSubTitle}>
                  کارشناسان ما در کوتاه‌ترین زمان ممکن (کمتر از ۲ ساعت) با شما تماس خواهند گرفت.
                </p>
              </div>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.successAlertBox}
                >
                  <CheckCircle2 size={48} className={styles.successIcon} />
                  <h3>پیام شما با موفقیت دریافت شد!</h3>
                  <p>
                    از ارتباط شما با گالری ژوئل سپاسگزاریم. کارشناسان ما به زودی جهت پاسخگویی و
                    مشاوره تخصصی با شما تماس می‌گیرند.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className={styles.contactForm}>
                  {formError && (
                    <div className={styles.errorBanner}>
                      <AlertCircle size={18} />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className={styles.formRowTwoCols}>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>
                        <span>نام و نام خانوادگی</span>
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <div className={styles.inputIconWrapper}>
                        <User size={18} className={styles.fieldIcon} />
                        <input
                          type="text"
                          required
                          placeholder="مثلاً: مریم احمدی"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className={styles.textInput}
                        />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>
                        <span>شماره تماس / موبایل</span>
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <div className={styles.inputIconWrapper}>
                        <Phone size={18} className={styles.fieldIcon} />
                        <input
                          type="tel"
                          required
                          placeholder="مثلاً: 09123456789"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formRowTwoCols}>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>
                        <span>پست الکترونیکی (ایمیل)</span>
                      </label>
                      <div className={styles.inputIconWrapper}>
                        <Mail size={18} className={styles.fieldIcon} />
                        <input
                          type="email"
                          placeholder="مثلاً: example@gmail.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={styles.textInput}
                        />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>
                        <span>موضوع درخواست</span>
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className={styles.selectInput}
                      >
                        <option value="consultation">مشاوره تخصصی طلا و برلیان</option>
                        <option value="custom_order">سفارش ساخت طرح اختصاصی</option>
                        <option value="order_tracking">پیگیری سفارش و فاکتور</option>
                        <option value="vip_appointment">رزرو وقت مشاوره حضوری</option>
                        <option value="feedback">پیشنهادات و انتقادات</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      <span>روش ترجیحی جهت پاسخگویی</span>
                    </label>
                    <div className={styles.radioGroupRow}>
                      <label
                        className={`${styles.radioLabel} ${
                          formData.preferredChannel === 'phone' ? styles.radioSelected : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredChannel"
                          value="phone"
                          checked={formData.preferredChannel === 'phone'}
                          onChange={() =>
                            setFormData({ ...formData, preferredChannel: 'phone' })
                          }
                        />
                        <span>تماس تلفنی</span>
                      </label>

                      <label
                        className={`${styles.radioLabel} ${
                          formData.preferredChannel === 'whatsapp' ? styles.radioSelected : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredChannel"
                          value="whatsapp"
                          checked={formData.preferredChannel === 'whatsapp'}
                          onChange={() =>
                            setFormData({ ...formData, preferredChannel: 'whatsapp' })
                          }
                        />
                        <span>پیام در واتس‌اپ</span>
                      </label>

                      <label
                        className={`${styles.radioLabel} ${
                          formData.preferredChannel === 'email' ? styles.radioSelected : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredChannel"
                          value="email"
                          checked={formData.preferredChannel === 'email'}
                          onChange={() =>
                            setFormData({ ...formData, preferredChannel: 'email' })
                          }
                        />
                        <span>ایمیل</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      <span>متن کامل پیام یا شرح درخواست</span>
                      <span className={styles.requiredStar}>*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="لطفاً جزئیات درخواست یا سوال خود را اینجا بنویسید..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className={styles.textareaInput}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <Send size={18} />
                    <span>ارسال پیام برای کارشناسان</span>
                  </button>
                </form>
              )}
            </motion.div>

            {/* VIP Appointment Booking Side Card */}
            <motion.div
              id="vip-booking"
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={styles.vipCard}
            >
              <div className={styles.vipHeader}>
                <div className={styles.vipBadge}>
                  <Gem size={16} />
                  <span>VIP Experience</span>
                </div>
                <h3 className={styles.vipTitle}>رزرو وقت مشاوره اختصاصی VIP</h3>
                <p className={styles.vipSubtitle}>
                  جهت بازدید اختصاصی از جدیدترین کلکسیون جواهرات و مشاوره تک‌به‌تک با استادکاران
                  در محیط سالن خصوصی گالری فرشته.
                </p>
              </div>

              {vipSubmitted ? (
                <div className={styles.vipSuccessNotice}>
                  <CheckCircle2 size={40} className={styles.vipSuccessIcon} />
                  <h4>درخواست وقت VIP شما ثبت شد!</h4>
                  <p>
                    تیم تشریفات گالری ژوئل جهت تایید نهایی وقت ملاقات با شما تماس خواهند گرفت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVipSubmit} className={styles.vipForm}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      <span>نام و نام خانوادگی</span>
                      <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="نام کامل شما..."
                      value={vipData.name}
                      onChange={(e) => setVipData({ ...vipData, name: e.target.value })}
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      <span>شماره تماس</span>
                      <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="۰۹۱۲..."
                      value={vipData.phone}
                      onChange={(e) => setVipData({ ...vipData, phone: e.target.value })}
                      className={styles.textInput}
                    />
                  </div>

                  {/* Persian / Jalali Date Picker Field */}
                  <div className={styles.formField} ref={datePickerRef}>
                    <label className={styles.fieldLabel}>
                      <span>تاریخ پیشنهادی بازدید (تقویم هجری شمسی)</span>
                      <span className={styles.requiredStar}>*</span>
                    </label>

                    <div className={styles.shamsiDatePickerWrapper}>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={styles.shamsiTriggerBtn}
                      >
                        <CalendarIcon size={18} className={styles.shamsiCalIcon} />
                        <span className={styles.shamsiValText}>{vipData.date}</span>
                        <ChevronDown size={16} className={styles.shamsiArrowIcon} />
                      </button>

                      {/* Interactive Persian Jalali Calendar Popover */}
                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={styles.calendarPopover}
                          >
                            <div className={styles.calHeaderRow}>
                              <button
                                type="button"
                                className={styles.calNavBtn}
                                onClick={() => {
                                  if (selectedMonthIndex > 0) {
                                    setSelectedMonthIndex(selectedMonthIndex - 1);
                                  } else {
                                    setSelectedMonthIndex(11);
                                    setSelectedYear(selectedYear - 1);
                                  }
                                }}
                              >
                                <ChevronRight size={18} />
                              </button>

                              <div className={styles.calTitleGroup}>
                                <strong>{PERSIAN_MONTHS[selectedMonthIndex]}</strong>
                                <span>{toPersianDigits(selectedYear)}</span>
                              </div>

                              <button
                                type="button"
                                className={styles.calNavBtn}
                                onClick={() => {
                                  if (selectedMonthIndex < 11) {
                                    setSelectedMonthIndex(selectedMonthIndex + 1);
                                  } else {
                                    setSelectedMonthIndex(0);
                                    setSelectedYear(selectedYear + 1);
                                  }
                                }}
                              >
                                <ChevronLeft size={18} />
                              </button>
                            </div>

                            <div className={styles.calWeekGrid}>
                              <span>ش</span>
                              <span>ی</span>
                              <span>د</span>
                              <span>س</span>
                              <span>چ</span>
                              <span>پ</span>
                              <span>ج</span>
                            </div>

                            <div className={styles.calDaysGrid}>
                              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                                const isSelected = d === selectedDay;
                                return (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => handleSelectPersianDay(d)}
                                    className={`${styles.calDayBtn} ${
                                      isSelected ? styles.calDaySelected : ''
                                    }`}
                                  >
                                    {toPersianDigits(d)}
                                  </button>
                                );
                              })}
                            </div>

                            <div className={styles.calFooterBar}>
                              <span className={styles.yearSelectLabel}>سال:</span>
                              <div className={styles.yearBtns}>
                                <button
                                  type="button"
                                  className={`${styles.yearBtn} ${
                                    selectedYear === 1405 ? styles.yearActive : ''
                                  }`}
                                  onClick={() => setSelectedYear(1405)}
                                >
                                  ۱۴۰۵
                                </button>
                                <button
                                  type="button"
                                  className={`${styles.yearBtn} ${
                                    selectedYear === 1406 ? styles.yearActive : ''
                                  }`}
                                  onClick={() => setSelectedYear(1406)}
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

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      <span>سانس زمانی ترجیحی</span>
                    </label>
                    <select
                      value={vipData.timeSlot}
                      onChange={(e) => setVipData({ ...vipData, timeSlot: e.target.value })}
                      className={styles.selectInput}
                    >
                      <option value="10-12">ساعت ۱۰:۰۰ الی ۱۲:۰۰ (صبح)</option>
                      <option value="12-14">ساعت ۱۲:۰۰ الی ۱۴:۰۰ (ظهر)</option>
                      <option value="14-16">ساعت ۱۴:۰۰ الی ۱۶:۰۰ (عصر)</option>
                      <option value="16-18">ساعت ۱۶:۰۰ الی ۱۸:۰۰ (عصر)</option>
                      <option value="18-20">ساعت ۱۸:۰۰ الی ۲۰:۰۰ (شب)</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                      <span>دسته‌بندی مورد علاقه جهت بازدید</span>
                    </label>
                    <select
                      value={vipData.interestCategory}
                      onChange={(e) =>
                        setVipData({ ...vipData, interestCategory: e.target.value })
                      }
                      className={styles.selectInput}
                    >
                      <option value="bridal">سرویس عروس و جواهرات برلیان</option>
                      <option value="engagement">حلقه نامزدی و تک‌نگین</option>
                      <option value="custom">سفارشات دست‌ساز اختصاصی</option>
                      <option value="daily_gold">طلا و زیورآلات مدرن روزمره</option>
                    </select>
                  </div>

                  <button type="submit" className={styles.vipSubmitBtn}>
                    <CalendarIcon size={18} />
                    <span>تایید و رزرو وقت VIP</span>
                  </button>

                  <div className={styles.vipTrustNote}>
                    <ShieldCheck size={16} />
                    <span>پذیرایی تشریفاتی و مشاوره کاملاً رایگان است.</span>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Showroom Location & Interactive Map Section */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          {/* Centered Header for Location Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className={styles.locationHeaderCentered}
          >
            <div className={styles.sectionTag}>
              <MapPin size={16} />
              <span>موقعیت مکانی و دسترسی</span>
            </div>
            <h2 className={styles.mapTitle}>میزبانی شما در شو روم مرکزی فرشته</h2>
            <p className={styles.mapDescCentered}>
              سالن اختصاصی ژوئل در یکی از بهترین مناطق الهیه تهران با امکانات رفاهی و امنیتی کامل
              آماده پذیرایی و میزبانی از شما عزیزان است.
            </p>
          </motion.div>

          {/* 2-Column Grid: Right Side Gallery Image & Access Features | Left Side Map */}
          <div className={styles.locationContentGrid}>
            {/* RIGHT SIDE (Right in RTL): Showroom Gallery Photo & Features */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7 }}
              className={styles.locationRightSide}
            >
              <div className={styles.showroomFrameWrapper}>
                <img
                  src={galleryShowroomImg}
                  alt="تصویر شو روم مرکزی گالری فرشته"
                  className={styles.showroomImg}
                  loading="lazy"
                />
                <div className={styles.showroomOverlay} />
                <div className={styles.showroomLabelBadge}>
                  <Gem size={16} />
                  <span>شو روم مرکزی الهیه (خیابان فرشته)</span>
                </div>
              </div>

              {/* Access Features list below gallery image */}
              <div className={styles.accessFeaturesGrid}>
                <div className={styles.accessItem}>
                  <Car size={20} className={styles.accessIcon} />
                  <div>
                    <strong>پارکینگ اختصاصی VIP:</strong>
                    <p>پارکینگ طبقاتی برج الماس جهت رفاه حال خریداران گالری.</p>
                  </div>
                </div>

                <div className={styles.accessItem}>
                  <ShieldCheck size={20} className={styles.accessIcon} />
                  <div>
                    <strong>امنیت و حریم خصوصی:</strong>
                    <p>سالن خصوصی جداگانه جهت انتخاب و تست جواهرات در آرامش کامل.</p>
                  </div>
                </div>

                <div className={styles.accessItem}>
                  <Award size={20} className={styles.accessIcon} />
                  <div>
                    <strong>کارشناس مقیم GIA:</strong>
                    <p>حضور کارشناس بین‌المللی جهت بررسی سنگ‌ها در حضور شما.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* LEFT SIDE (Left in RTL): Interactive Visual Map Frame */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7 }}
              className={styles.locationLeftSide}
            >
              <div className={styles.mapFrameWrapper}>
                <img
                  src={fakeMap}
                  alt="نقشه موقعیت شو روم مرکزی گالری فرشته"
                  className={styles.mapImage}
                  loading="lazy"
                />
                <div className={styles.mapOverlay} />

                <div className={styles.mapPinPulse}>
                  <div className={styles.pinDot}>💎</div>
                  <div className={styles.pulseRing} />
                </div>

                <div className={styles.mapLabelCard}>
                  <strong>گالری لاکچری ژوئل</strong>
                  <span>تهران، الهیه، خیابان فرشته، پلاک ۴۸، برج الماس</span>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapDirectBtn}
              >
                <NavIcon size={18} />
                <span>مسیریابی هوشمند با گوگل مپ / نشان</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combined FAQ & Social Membership Section Side-by-Side */}
      <section className={styles.faqAndSocialSection}>
        <div className={styles.container}>
          <div className={styles.faqSocialGrid}>
            {/* RIGHT SIDE (Right in RTL): Social Media Membership */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7 }}
              className={styles.socialMembershipCard}
            >
              <div className={styles.socialCardHeader}>
                <div className={styles.socialBadge}>
                  <Users size={16} />
                  <span>باشگاه همراهان و شبکه‌های اجتماعی</span>
                </div>
                <h2 className={styles.socialTitle}>عضویت در شبکه‌های اجتماعی ژوئل</h2>
                <p className={styles.socialDesc}>
                  با پیوستن به صفحه رسمی اینستاگرام و کانال اختصاصی ژوئل، از جدیدترین
                  کالکشن‌های دست‌ساز، استوری‌های روزانه، رونمایی قبل از عرضه عمومی و پیشنهادهای
                  ویژه اعضا مطلع شوید.
                </p>
              </div>

              {/* Perks List */}
              <div className={styles.socialBenefitsList}>
                <div className={styles.socialBenefitItem}>
                  <CheckCircle2 size={18} className={styles.socialBenefitIcon} />
                  <span>اطلاع‌رسانی آنلاین قیمت زنده طلا و برلیان</span>
                </div>
                <div className={styles.socialBenefitItem}>
                  <CheckCircle2 size={18} className={styles.socialBenefitIcon} />
                  <span>رونمایی اختصاصی از سرویس‌های عروس و انگشترها</span>
                </div>
                <div className={styles.socialBenefitItem}>
                  <CheckCircle2 size={18} className={styles.socialBenefitIcon} />
                  <span>شرکت در قرعه‌کشی‌های ماهانه و تخفیف‌های ویژه همراهان</span>
                </div>
              </div>

              {/* Social Action Buttons */}
              <div className={styles.socialBtnsGrid}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialInstaBtn}
                >
                  <Instagram size={20} />
                  <span>پیج اینستاگرام: Joel.Jewelry</span>
                </a>

                <a
                  href="https://wa.me/989123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialWaBtn}
                >
                  <MessageCircle size={20} />
                  <span>واتس‌اپ رسمی: {settings.whatsapp}</span>
                </a>
              </div>

              <div className={styles.socialLiveBadge}>
                <BellRing size={15} />
                <span>پاسخگویی سریع پیام‌ها در دایرکت و واتس‌اپ</span>
              </div>
            </motion.div>

            {/* LEFT SIDE (Left in RTL): FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7 }}
              className={styles.faqSectionWrapper}
            >
              <div className={styles.faqHeaderCompact}>
                <span className={styles.subTag}>پاسخ به سوالات شما</span>
                <h2 className={styles.faqTitleCompact}>سوالات متداول تماس و خرید حضوری</h2>
                <p className={styles.faqDescCompact}>
                  پاسخ به پرسش‌های متداول درباره بازدید، سفارشات سفارشی و فاکتور رسمی.
                </p>
              </div>

              <div className={styles.faqListCompact}>
                {faqItems.map((item, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ''}`}
                    >
                      <button
                        type="button"
                        className={styles.faqQuestionBtn}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          size={18}
                          className={`${styles.faqChevron} ${
                            isOpen ? styles.faqChevronRotate : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className={styles.faqAnswerBox}
                          >
                            <p className={styles.faqAnswerText}>{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
