import React, { useMemo, useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [deleteId, setDeleteId] = useState(null);

  const [showResetConfirm, setShowResetConfirm] =
    useState(false);

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
  }, [
    reviews,
    searchQuery,
    selectedCategory,
  ]);

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
      avatarEmoji:
        review.avatarEmoji || '🌟',
      hasPhoto: Boolean(review.hasPhoto),
      photoUrl: review.photoUrl || null,
      verified: Boolean(review.verified),
      category:
        review.category || 'online',
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

    if (
      !formData.name.trim() ||
      !formData.text.trim()
    ) {
      return;
    }

    const reviewData = {
      ...formData,
      name: formData.name.trim(),
      city: formData.city.trim(),
      product: formData.product.trim(),
      title: formData.title.trim(),
      text: formData.text.trim(),
      brandReply:
        formData.brandReply.trim(),
      rating: Number(formData.rating),
      likes: Number(formData.likes),
      verified: Boolean(formData.verified),
      hasPhoto: Boolean(formData.hasPhoto),
      photoUrl:
        formData.photoUrl || null,
    };

    if (editingId !== null) {
      updateReview(editingId, reviewData);
    } else {
      addReview({
        ...reviewData,
        id: Date.now(),
      });
    }

    closeModal();
  };

  const handleDelete = () => {
    if (deleteId === null) return;

    deleteReview(deleteId);
    setDeleteId(null);
  };

  const handleReset = () => {
    resetReviews();
    setShowResetConfirm(false);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.headerIcon}>
            <MessageSquare size={22} />
          </div>

          <div>
            <h1>نظرات مشتریان</h1>
            <p>
              مدیریت نظرات و تجربیات ثبت‌شده مشتریان
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() =>
              setShowResetConfirm(true)
            }
          >
            <RotateCcw size={16} />
            <span>بازگردانی اولیه</span>
          </button>

          <button
            type="button"
            className={styles.addButton}
            onClick={openAddModal}
          >
            <Plus size={18} />
            <span>افزودن نظر</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MessageSquare size={19} />
          </div>

          <div>
            <span className={styles.statLabel}>
              مجموع نظرات
            </span>
            <strong className={styles.statValue}>
              {reviews.length}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <UserCheck size={19} />
          </div>

          <div>
            <span className={styles.statLabel}>
              خریداران تأییدشده
            </span>

            <strong className={styles.statValue}>
              {
                reviews.filter(
                  (review) => review.verified
                ).length
              }
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Star size={19} />
          </div>

          <div>
            <span className={styles.statLabel}>
              میانگین امتیاز
            </span>

            <strong className={styles.statValue}>
              {reviews.length
                ? (
                    reviews.reduce(
                      (sum, review) =>
                        sum +
                        Number(
                          review.rating || 0
                        ),
                      0
                    ) / reviews.length
                  ).toFixed(1)
                : '۰'}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Heart size={19} />
          </div>

          <div>
            <span className={styles.statLabel}>
              مجموع لایک‌ها
            </span>

            <strong className={styles.statValue}>
              {reviews.reduce(
                (sum, review) =>
                  sum +
                  Number(review.likes || 0),
                0
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.searchBox}>
          <Search size={17} />

          <input
            type="text"
            placeholder="جستجو در نام، محصول، عنوان یا متن نظر..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() =>
                setSearchQuery('')
              }
              className={styles.clearSearch}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className={styles.categoryFilters}>
          <button
            type="button"
            className={
              selectedCategory === 'all'
                ? styles.filterActive
                : ''
            }
            onClick={() =>
              setSelectedCategory('all')
            }
          >
            همه ({reviews.length})
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'online'
                ? styles.filterActive
                : ''
            }
            onClick={() =>
              setSelectedCategory('online')
            }
          >
            خرید آنلاین
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'inperson'
                ? styles.filterActive
                : ''
            }
            onClick={() =>
              setSelectedCategory('inperson')
            }
          >
            گالری
          </button>

          <button
            type="button"
            className={
              selectedCategory === 'custom'
                ? styles.filterActive
                : ''
            }
            onClick={() =>
              setSelectedCategory('custom')
            }
          >
            سفارشی
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className={styles.reviewsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>لیست نظرات</h2>
            <span>
              {filteredReviews.length} مورد نمایش داده
              می‌شود
            </span>
          </div>
        </div>

        {filteredReviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={styles.reviewItem}
              >
                <div className={styles.reviewMain}>
                  {/* User */}
                  <div className={styles.userColumn}>
                    <div className={styles.avatar}>
                      {review.avatarEmoji ||
                        '🌟'}
                    </div>

                    <div>
                      <div
                        className={
                          styles.userName
                        }
                      >
                        {review.name}
                      </div>

                      <div
                        className={
                          styles.userLocation
                        }
                      >
                        <MapPin size={12} />
                        {review.city ||
                          'بدون شهر'}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={
                      styles.reviewContent
                    }
                  >
                    <div
                      className={
                        styles.reviewTop
                      }
                    >
                      <div
                        className={
                          styles.reviewTitleGroup
                        }
                      >
                        <h3>
                          {review.title ||
                            'بدون عنوان'}
                        </h3>

                        {review.verified ? (
                          <span
                            className={
                              styles.verified
                            }
                          >
                            <CheckCircle2
                              size={13}
                            />
                            تأییدشده
                          </span>
                        ) : (
                          <span
                            className={
                              styles.notVerified
                            }
                          >
                            <XCircle
                              size={13}
                            />
                            تأییدنشده
                          </span>
                        )}
                      </div>

                      <div
                        className={
                          styles.rating
                        }
                      >
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={14}
                              fill={
                                star <=
                                review.rating
                                  ? 'var(--accent)'
                                  : 'none'
                              }
                              stroke={
                                star <=
                                review.rating
                                  ? 'var(--accent)'
                                  : 'var(--text-secondary)'
                              }
                            />
                          )
                        )}
                      </div>
                    </div>

                    <p
                      className={
                        styles.reviewText
                      }
                    >
                      {review.text}
                    </p>

                    <div
                      className={
                        styles.reviewMeta
                      }
                    >
                      <span>
                        <Package size={13} />
                        {review.product ||
                          'بدون محصول'}
                      </span>

                      <span>
                        <Calendar size={13} />
                        {review.date ||
                          'بدون تاریخ'}
                      </span>

                      <span>
                        <Heart size={13} />
                        {review.likes || 0}{' '}
                        لایک
                      </span>

                      <span
                        className={
                          styles.categoryBadge
                        }
                      >
                        {CATEGORY_LABELS[
                          review.category
                        ] ||
                          'سایر'}
                      </span>
                    </div>

                    {review.brandReply && (
                      <div
                        className={
                          styles.brandReply
                        }
                      >
                        <MessageCircle
                          size={14}
                        />

                        <div>
                          <strong>
                            پاسخ مدیر
                          </strong>

                          <p>
                            {review.brandReply}
                          </p>
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
                    onClick={() =>
                      toggleVerified(
                        review.id
                      )
                    }
                    title={
                      review.verified
                        ? 'لغو تأیید'
                        : 'تأیید خریدار'
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
                    className={
                      styles.editButton
                    }
                    onClick={() =>
                      openEditModal(review)
                    }
                    title="ویرایش"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    type="button"
                    className={
                      styles.deleteButton
                    }
                    onClick={() =>
                      setDeleteId(review.id)
                    }
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

            <h3>
              نظری پیدا نشد
            </h3>

            <p>
              با تغییر عبارت جستجو یا فیلترها دوباره
              تلاش کنید.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={closeModal}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              className={styles.modal}
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className={styles.modalHeader}>
                <div>
                  <h2>
                    {editingId !== null
                      ? 'ویرایش نظر مشتری'
                      : 'افزودن نظر مشتری'}
                  </h2>

                  <p>
                    اطلاعات نظر را وارد یا ویرایش
                    کنید.
                  </p>
                </div>

                <button
                  type="button"
                  className={
                    styles.modalClose
                  }
                  onClick={closeModal}
                >
                  <X size={19} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className={styles.form}
              >
                <div
                  className={
                    styles.formGrid
                  }
                >
                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      نام مشتری *
                    </label>

                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleChange(
                          'name',
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      شهر
                    </label>

                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleChange(
                          'city',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      محصول
                    </label>

                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) =>
                        handleChange(
                          'product',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      تاریخ
                    </label>

                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) =>
                        handleChange(
                          'date',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      دسته‌بندی
                    </label>

                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleChange(
                          'category',
                          e.target.value
                        )
                      }
                    >
                      <option value="online">
                        خرید آنلاین
                      </option>

                      <option value="inperson">
                        گالری فرشته
                      </option>

                      <option value="custom">
                        سفارش سفارشی
                      </option>
                    </select>
                  </div>

                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      امتیاز
                    </label>

                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        handleChange(
                          'rating',
                          Number(
                            e.target.value
                          )
                        )
                      }
                    >
                      <option value={5}>
                        ۵ ستاره
                      </option>
                      <option value={4}>
                        ۴ ستاره
                      </option>
                      <option value={3}>
                        ۳ ستاره
                      </option>
                      <option value={2}>
                        ۲ ستاره
                      </option>
                      <option value={1}>
                        ۱ ستاره
                      </option>
                    </select>
                  </div>

                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      تعداد لایک
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={formData.likes}
                      onChange={(e) =>
                        handleChange(
                          'likes',
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </div>

                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      ایموجی پروفایل
                    </label>

                    <input
                      type="text"
                      value={
                        formData.avatarEmoji
                      }
                      onChange={(e) =>
                        handleChange(
                          'avatarEmoji',
                          e.target.value
                        )
                      }
                      maxLength={4}
                    />
                  </div>
                </div>

                <div
                  className={
                    styles.formField
                  }
                >
                  <label>
                    عنوان نظر
                  </label>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      handleChange(
                        'title',
                        e.target.value
                      )
                    }
                  />
                </div>

                <div
                  className={
                    styles.formField
                  }
                >
                  <label>
                    متن نظر *
                  </label>

                  <textarea
                    rows={5}
                    value={formData.text}
                    onChange={(e) =>
                      handleChange(
                        'text',
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div
                  className={
                    styles.formField
                  }
                >
                  <label>
                    پاسخ مدیر گالری
                  </label>

                  <textarea
                    rows={3}
                    value={
                      formData.brandReply
                    }
                    onChange={(e) =>
                      handleChange(
                        'brandReply',
                        e.target.value
                      )
                    }
                  />
                </div>

                <div
                  className={
                    styles.switches
                  }
                >
                  <label
                    className={
                      styles.checkboxLabel
                    }
                  >
                    <input
                      type="checkbox"
                      checked={
                        formData.verified
                      }
                      onChange={(e) =>
                        handleChange(
                          'verified',
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      خریدار تأییدشده
                    </span>
                  </label>

                  <label
                    className={
                      styles.checkboxLabel
                    }
                  >
                    <input
                      type="checkbox"
                      checked={
                        formData.hasPhoto
                      }
                      onChange={(e) =>
                        handleChange(
                          'hasPhoto',
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      دارای تصویر
                    </span>
                  </label>
                </div>

                {formData.hasPhoto && (
                  <div
                    className={
                      styles.formField
                    }
                  >
                    <label>
                      آدرس تصویر
                    </label>

                    <input
                      type="text"
                      value={
                        formData.photoUrl || ''
                      }
                      onChange={(e) =>
                        handleChange(
                          'photoUrl',
                          e.target.value
                        )
                      }
                      placeholder="آدرس تصویر را وارد کنید"
                    />
                  </div>
                )}

                <div
                  className={
                    styles.modalFooter
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.cancelButton
                    }
                    onClick={closeModal}
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    className={
                      styles.saveButton
                    }
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

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId !== null && (
          <div
            className={
              styles.confirmBackdrop
            }
            onClick={() =>
              setDeleteId(null)
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className={
                styles.confirmBox
              }
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div
                className={
                  styles.confirmIcon
                }
              >
                <Trash2 size={22} />
              </div>

              <h3>
                حذف نظر مشتری؟
              </h3>

              <p>
                این نظر از لیست نظرات حذف خواهد شد و
                این عملیات قابل بازگشت نیست.
              </p>

              <div
                className={
                  styles.confirmActions
                }
              >
                <button
                  type="button"
                  className={
                    styles.cancelButton
                  }
                  onClick={() =>
                    setDeleteId(null)
                  }
                >
                  انصراف
                </button>

                <button
                  type="button"
                  className={
                    styles.confirmDelete
                  }
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

      {/* Reset Confirmation */}
      <AnimatePresence>
        {showResetConfirm && (
          <div
            className={
              styles.confirmBackdrop
            }
            onClick={() =>
              setShowResetConfirm(false)
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className={
                styles.confirmBox
              }
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div
                className={
                  styles.confirmIcon
                }
              >
                <RotateCcw size={22} />
              </div>

              <h3>
                بازگردانی نظرات؟
              </h3>

              <p>
                تمام تغییرات فعلی نظرات حذف می‌شود و
                لیست به نظرات اولیه بازمی‌گردد.
              </p>

              <div
                className={
                  styles.confirmActions
                }
              >
                <button
                  type="button"
                  className={
                    styles.cancelButton
                  }
                  onClick={() =>
                    setShowResetConfirm(false)
                  }
                >
                  انصراف
                </button>

                <button
                  type="button"
                  className={
                    styles.confirmDelete
                  }
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
    </div>
  );
}