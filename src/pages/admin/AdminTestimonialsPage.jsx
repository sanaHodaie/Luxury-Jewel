import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  MapPin,
  Calendar,
  Package,
  Save,
  X,
  RotateCcw,
  MessageCircle,
  Heart,
  UserCheck,
  Sparkles,
  AlertCircle,
  Layers,
  Award,
} from 'lucide-react';

import {
  useTestimonials,
} from '../../contexts/TestimonialsContext';

import styles from './AdminTestimonialsPage.module.css';

const EMPTY_FORM = {
  name: '',
  city: '',
  date: 'همین الان',
  verified: true,
  category: 'online',
  product: '',
  rating: 5,
  likes: 0,
  title: '',
  text: '',
  avatarEmoji: '🌟',
  hasPhoto: false,
  photoUrl: null,
  brandReply: '',
};

const CATEGORY_LABELS = {
  online: 'خرید آنلاین',
  inperson: 'گالری فرشته',
  custom: 'سفارش سفارشی',
};

/* ============ Helpers ============ */
const toPersianDigits = (str) =>
  String(str).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

/* ============ Toast (Center Screen) ============ */
function Toast({ toast, onClose }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!toast) {
      setLeaving(false);
      return;
    }

    setLeaving(false);

    const fadeTimer = setTimeout(() => setLeaving(true), 2500);
    const removeTimer = setTimeout(onClose, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [toast, onClose]);

  if (!toast) return null;
  const isError = toast.type === 'error';

  return (
    <div className={styles.toastOverlay}>
      <div
        className={`${styles.toast} ${
          isError ? styles.toastError : styles.toastSuccess
        } ${leaving ? styles.toastLeaving : ''}`}
      >
        {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
        <span>{toast.message}</span>
        <button type="button" onClick={onClose} className={styles.toastClose}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ============ Section Card ============ */
function SectionCard({
  icon: Icon,
  iconTone = 'indigo',
  title,
  description,
  count,
  action,
  children,
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLeft}>
          <div
            className={`${styles.sectionIcon} ${styles[`iconTone_${iconTone}`]}`}
          >
            <Icon size={20} />
          </div>
          <div className={styles.sectionHeaderContent}>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>{title}</h2>
              {typeof count === 'number' && (
                <span className={styles.sectionCount}>
                  {count.toLocaleString('fa-IR')}
                </span>
              )}
            </div>
            {description && (
              <p className={styles.sectionDescription}>{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ============ Confirm Delete Button ============ */
function DeleteButton({ onConfirm, title = 'حذف' }) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <button
      type="button"
      className={`${styles.deleteButton} ${
        confirming ? styles.deleteButtonConfirm : ''
      }`}
      onClick={() => {
        if (confirming) {
          onConfirm();
          setConfirming(false);
        } else {
          setConfirming(true);
        }
      }}
      title={confirming ? 'برای تأیید دوباره کلیک کنید' : title}
    >
      {confirming ? <CheckCircle2 size={16} /> : <Trash2 size={16} />}
    </button>
  );
}

export default function AdminTestimonialsPage() {
  const {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    toggleVerified,
    resetReviews,
  } = useTestimonials();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [deleteId, setDeleteId] = useState(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [toast, setToast] = useState(null);

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        review.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!query) return true;

      return (
        review.name?.toLowerCase().includes(query) ||
        review.city?.toLowerCase().includes(query) ||
        review.product?.toLowerCase().includes(query) ||
        review.title?.toLowerCase().includes(query) ||
        review.text?.toLowerCase().includes(query)
      );
    });
  }, [reviews, searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const verified = reviews.filter((r) => r.verified).length;

    // ✅ میانگین امتیاز با اعداد فارسی
    const avgRating = total
      ? toPersianDigits(
          (
            reviews.reduce(
              (sum, r) => sum + Number(r.rating || 0),
              0
            ) / total
          ).toFixed(1)
        )
      : '۰';

    const totalLikes = reviews.reduce(
      (sum, r) => sum + Number(r.likes || 0),
      0
    );
    return { total, verified, avgRating, totalLikes };
  }, [reviews]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      ...EMPTY_FORM,
      date: 'همین الان',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (review) => {
    setEditingId(review.id);

    setFormData({
      ...EMPTY_FORM,
      ...review,
      name: review.name || '',
      city: review.city || '',
      date: review.date || '',
      product: review.product || '',
      rating: Number(review.rating) || 5,
      likes: Number(review.likes) || 0,
      title: review.title || '',
      text: review.text || '',
      brandReply: review.brandReply || '',
      avatarEmoji: review.avatarEmoji || '🌟',
      hasPhoto: Boolean(review.hasPhoto),
      photoUrl: review.photoUrl || null,
      verified: Boolean(review.verified),
      category: review.category || 'online',
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.text.trim()) {
      return;
    }

    const reviewData = {
      ...formData,
      name: formData.name.trim(),
      city: formData.city.trim(),
      product: formData.product.trim(),
      title: formData.title.trim(),
      text: formData.text.trim(),
      brandReply: formData.brandReply.trim(),
      rating: Number(formData.rating),
      likes: Number(formData.likes),
      verified: Boolean(formData.verified),
      hasPhoto: Boolean(formData.hasPhoto),
      photoUrl: formData.photoUrl || null,
    };

    if (editingId !== null) {
      updateReview(editingId, reviewData);
      setToast({
        type: 'success',
        message: 'نظر مشتری با موفقیت ویرایش شد.',
      });
    } else {
      addReview({
        ...reviewData,
        id: Date.now(),
      });
      setToast({
        type: 'success',
        message: 'نظر مشتری با موفقیت افزوده شد.',
      });
    }

    closeModal();
  };

  const handleDelete = () => {
    if (deleteId === null) return;

    deleteReview(deleteId);
    setDeleteId(null);
    setToast({
      type: 'success',
      message: 'نظر مشتری با موفقیت حذف شد.',
    });
  };

  const handleReset = () => {
    resetReviews();
    setShowResetConfirm(false);
    setToast({
      type: 'success',
      message: 'نظرات به لیست اولیه بازگشت.',
    });
  };

  const handleToastClose = useCallback(() => setToast(null), []);

  return (
    <div dir="rtl" className={styles.page}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerBadge}>
            <Sparkles size={14} />
            <span>پنل مدیریت محتوا</span>
          </div>
          <h1 className={styles.headerTitle}>نظرات مشتریان</h1>
          <p className={styles.headerDescription}>
            مدیریت نظرات و تجربیات ثبت‌شده مشتریان. تغییرات به‌صورت
            زنده در لیست اعمال می‌شوند.
          </p>

          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    reviews.length
                      ? Math.min(
                          100,
                          Math.round(
                            (stats.verified / stats.total) * 100
                          )
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className={styles.progressLabel}>
              {reviews.length
                ? Math.round((stats.verified / stats.total) * 100)
                : 0}
              ٪ تأییدشده
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw size={17} />
            <span>بازگردانی</span>
          </button>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={openAddModal}
          >
            <Plus size={18} />
            <span>افزودن نظر</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_indigo}`}>
            <MessageSquare size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>مجموع نظرات</span>
            <strong className={styles.statValue}>
              {stats.total.toLocaleString('fa-IR')}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_emerald}`}>
            <UserCheck size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>تأییدشده</span>
            <strong className={styles.statValue}>
              {stats.verified.toLocaleString('fa-IR')}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_amber}`}>
            <Star size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>میانگین امتیاز</span>
            <strong className={styles.statValue}>{stats.avgRating}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_rose}`}>
            <Heart size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>مجموع لایک‌ها</span>
            <strong className={styles.statValue}>
              {stats.totalLikes.toLocaleString('fa-IR')}
            </strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <SectionCard
        icon={Layers}
        iconTone="sky"
        title="جستجو و فیلتر"
        description="نظرات را بر اساس دسته‌بندی یا عبارت جستجو پیدا کنید."
      >
        <div className={styles.searchBox}>
          <Search size={17} />

          <input
            type="text"
            placeholder="جستجو در نام، محصول، عنوان یا متن نظر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={styles.clearSearch}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className={styles.categoryFilters}>
          <button
            type="button"
            className={selectedCategory === 'all' ? styles.filterActive : ''}
            onClick={() => setSelectedCategory('all')}
          >
            همه ({reviews.length})
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'online' ? styles.filterActive : ''
            }
            onClick={() => setSelectedCategory('online')}
          >
            خرید آنلاین
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'inperson' ? styles.filterActive : ''
            }
            onClick={() => setSelectedCategory('inperson')}
          >
            گالری
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'custom' ? styles.filterActive : ''
            }
            onClick={() => setSelectedCategory('custom')}
          >
            سفارشی
          </button>
        </div>
      </SectionCard>

      {/* =====================================================
          REVIEWS LIST
      ===================================================== */}

      <SectionCard
        icon={MessageSquare}
        iconTone="violet"
        title="لیست نظرات"
        description={`${filteredReviews.length} مورد نمایش داده می‌شود`}
        count={filteredReviews.length}
      >
        {filteredReviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.reviewItem}
              >
                <div className={styles.reviewMain}>
                  {/* User */}
                  <div className={styles.userColumn}>
                    <div className={styles.avatar}>
                      {review.avatarEmoji || '🌟'}
                    </div>

                    <div>
                      <div className={styles.userName}>{review.name}</div>
                      <div className={styles.userLocation}>
                        <MapPin size={12} />
                        {review.city || 'بدون شهر'}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={styles.reviewContent}>
                    <div className={styles.reviewTop}>
                      <div className={styles.reviewTitleGroup}>
                        <h3>{review.title || 'بدون عنوان'}</h3>

                        {review.verified ? (
                          <span className={styles.verified}>
                            <CheckCircle2 size={13} />
                            تأییدشده
                          </span>
                        ) : (
                          <span className={styles.notVerified}>
                            <XCircle size={13} />
                            تأییدنشده
                          </span>
                        )}
                      </div>

                      <div className={styles.rating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={
                              star <= review.rating
                                ? 'var(--accent)'
                                : 'none'
                            }
                            stroke={
                              star <= review.rating
                                ? 'var(--accent)'
                                : 'var(--text-secondary)'
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className={styles.reviewText}>{review.text}</p>

                    <div className={styles.reviewMeta}>
                      <span>
                        <Package size={13} />
                        {review.product || 'بدون محصول'}
                      </span>

                      <span>
                        <Calendar size={13} />
                        {review.date || 'بدون تاریخ'}
                      </span>

                      <span>
                        <Heart size={13} />
                        {review.likes || 0} لایک
                      </span>

                      <span className={styles.categoryBadge}>
                        {CATEGORY_LABELS[review.category] || 'سایر'}
                      </span>
                    </div>

                    {review.brandReply && (
                      <div className={styles.brandReply}>
                        <MessageCircle size={14} />

                        <div>
                          <strong>پاسخ مدیر</strong>
                          <p>{review.brandReply}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.reviewActions}>
                  <button
                    type="button"
                    className={
                      review.verified
                        ? styles.verifyButtonActive
                        : styles.verifyButton
                    }
                    onClick={() => toggleVerified(review.id)}
                    title={
                      review.verified ? 'لغو تأیید' : 'تأیید خریدار'
                    }
                  >
                    {review.verified ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                  </button>

                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => openEditModal(review)}
                    title="ویرایش"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => setDeleteId(review.id)}
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={42} />
            <h3>نظری پیدا نشد</h3>
            <p>با تغییر عبارت جستجو یا فیلترها دوباره تلاش کنید.</p>
          </div>
        )}
      </SectionCard>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      <AnimatePresence>
        {isModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ✅ Header ثابت */}
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderContent}>
                  <div className={styles.modalHeaderIcon}>
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h2>
                      {editingId !== null
                        ? 'ویرایش نظر مشتری'
                        : 'افزودن نظر مشتری'}
                    </h2>
                    <p>اطلاعات نظر را وارد یا ویرایش کنید.</p>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={closeModal}
                >
                  <X size={19} />
                </button>
              </div>

              {/* ✅ Form با بدنه اسکرول‌شونده و فوتر ثابت */}
              <form
                onSubmit={handleSubmit}
                className={styles.form}
              >
                <div className={styles.formScrollBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>نام مشتری *</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.name}
                        onChange={(e) =>
                          handleChange('name', e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>شهر</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.city}
                        onChange={(e) =>
                          handleChange('city', e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>محصول</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.product}
                        onChange={(e) =>
                          handleChange('product', e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>تاریخ</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.date}
                        onChange={(e) =>
                          handleChange('date', e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>دسته‌بندی</label>
                      <select
                        className={styles.select}
                        value={formData.category}
                        onChange={(e) =>
                          handleChange('category', e.target.value)
                        }
                      >
                        <option value="online">خرید آنلاین</option>
                        <option value="inperson">گالری فرشته</option>
                        <option value="custom">سفارش سفارشی</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>امتیاز</label>
                      <select
                        className={styles.select}
                        value={formData.rating}
                        onChange={(e) =>
                          handleChange('rating', Number(e.target.value))
                        }
                      >
                        <option value={5}>۵ ستاره</option>
                        <option value={4}>۴ ستاره</option>
                        <option value={3}>۳ ستاره</option>
                        <option value={2}>۲ ستاره</option>
                        <option value={1}>۱ ستاره</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>تعداد لایک</label>
                      <input
                        type="number"
                        className={styles.input}
                        min="0"
                        value={formData.likes}
                        onChange={(e) =>
                          handleChange('likes', Number(e.target.value))
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>ایموجی پروفایل</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.avatarEmoji}
                        onChange={(e) =>
                          handleChange('avatarEmoji', e.target.value)
                        }
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>عنوان نظر</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.title}
                      onChange={(e) =>
                        handleChange('title', e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>متن نظر *</label>
                    <textarea
                      className={styles.textarea}
                      rows={5}
                      value={formData.text}
                      onChange={(e) =>
                        handleChange('text', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>پاسخ مدیر گالری</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      value={formData.brandReply}
                      onChange={(e) =>
                        handleChange('brandReply', e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.switches}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.verified}
                        onChange={(e) =>
                          handleChange('verified', e.target.checked)
                        }
                      />
                      <span>خریدار تأییدشده</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.hasPhoto}
                        onChange={(e) =>
                          handleChange('hasPhoto', e.target.checked)
                        }
                      />
                      <span>دارای تصویر</span>
                    </label>
                  </div>

                  {formData.hasPhoto && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>آدرس تصویر</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.photoUrl || ''}
                        onChange={(e) =>
                          handleChange('photoUrl', e.target.value)
                        }
                        placeholder="آدرس تصویر را وارد کنید"
                      />
                    </div>
                  )}
                </div>

                {/* ✅ Footer ثابت */}
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={closeModal}
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    className={styles.primaryButton}
                  >
                    <Save size={16} />
                    <span>
                      {editingId !== null
                        ? 'ذخیره تغییرات'
                        : 'افزودن نظر'}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      <AnimatePresence>
        {deleteId !== null && (
          <div
            className={styles.confirmBackdrop}
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.confirmBox}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIcon}>
                <Trash2 size={22} />
              </div>

              <h3>حذف نظر مشتری؟</h3>

              <p>
                این نظر از لیست نظرات حذف خواهد شد و این عملیات
                قابل بازگشت نیست.
              </p>

              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setDeleteId(null)}
                >
                  انصراف
                </button>

                <button
                  type="button"
                  className={styles.confirmDelete}
                  onClick={handleDelete}
                >
                  <Trash2 size={15} />
                  حذف نظر
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          RESET CONFIRMATION
      ===================================================== */}

      <AnimatePresence>
        {showResetConfirm && (
          <div
            className={styles.confirmBackdrop}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.confirmBox}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIcon}>
                <RotateCcw size={22} />
              </div>

              <h3>بازگردانی نظرات؟</h3>

              <p>
                تمام تغییرات فعلی نظرات حذف می‌شود و لیست به نظرات
                اولیه بازمی‌گردد.
              </p>

              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowResetConfirm(false)}
                >
                  انصراف
                </button>

                <button
                  type="button"
                  className={styles.confirmDelete}
                  onClick={handleReset}
                >
                  <RotateCcw size={15} />
                  بازگردانی
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <Toast toast={toast} onClose={handleToastClose} />
    </div>
  );
}