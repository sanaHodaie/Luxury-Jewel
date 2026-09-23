import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowUpLeft,
  ArrowUp,
} from 'lucide-react';
import styles from './Footer.module.css';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

export const Footer = () => {
  const { settings } = useSiteSettings();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Brand Essence */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoText}>Luxury Jewel</span>
            </Link>

            <p className={styles.brandDesc}>
              گالری اختصاصی طلا و جواهرات فاخر. طراحی‌های منحصر‌به‌فرد، الماس‌های شناسنامه‌دار GIA و نهایت درخشش برای لحظات جاودانه زندگی شما.
            </p>

            <div className={styles.socials}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="اینستاگرام"
              >
                <Instagram size={18} />
              </a>
              <a href="tel:02122003344" className={styles.socialIcon} aria-label="تماس تلفنی">
                <Phone size={18} />
              </a>
              <a
                href="https://wa.me/989123456789"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="واتس‌اپ"
              >
                <MessageCircle size={18} />
              </a>
              <a href="mailto:{settings.contactEmail}" className={styles.socialIcon} aria-label="ایمیل">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className={styles.colTitle}>دسترسی سریع</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link to="/">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  صفحه اصلی
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/collections">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  مجموعه‌ها
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/story">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  داستان ما
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/testimonials">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  نظرات مشتریان
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/contact">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div>
            <h3 className={styles.colTitle}>دسته‌بندی‌ها</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link to="/collections?category=rings">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  حلقه‌ها و انگشترها
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/collections?category=earrings">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  گوشواره‌ها
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/collections?category=necklaces">
                  <ArrowUpLeft size={14} className={styles.arrowIcon} />
                  گردنبندها و آویزها
                </Link>
              </li>

            </ul>
          </div>

          {/* Column 4: Contact & Showroom */}
          <div>
            <h3 className={styles.colTitle}>اطلاعات شو روم</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactRow}>
                <MapPin size={18} className={styles.contactIcon} />
                <span>{settings.contactAddress}</span>
              </div>
              <div className={styles.contactRow}>
                <Phone size={18} className={styles.contactIcon} />
                <span className={styles.ltrText}>۰۲۱-۲۲۰۰۳۳۴۴</span>
              </div>
              <div className={styles.contactRow}>
                <Clock size={18} className={styles.contactIcon} />
                <span>۱۰:۰۰ الی ۲۱:۰۰ (پذیرش حضوری)</span>
              </div>

            </div>
          </div>
        </div>

        <div className={styles.separator} />

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <div className={styles.copyright}>
            © تمامی حقوق مادی و معنوی متعلق به گالری {settings.brandName} می‌باشد.
          </div>

          <div className={styles.madeWithLove}>
            <span>طراحی شده با</span>
            <Heart size={15} fill="var(--accent)" color="var(--accent)" />
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTopBtn}
            aria-label="بازگشت به بالای صفحه"
          >
            <span>بازگشت به بالا</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
