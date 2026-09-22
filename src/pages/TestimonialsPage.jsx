import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Search,
  PlusCircle,
  Filter,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  X,
  Heart,
  Share2,
  Camera,
  Award,
  MessageCircle,
  CheckCheck,
  UserCheck,
  Send,
  MapPin,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react';

import { useTestimonials } from '../contexts/TestimonialsContext';

import styles from './TestimonialsPage.module.css';

export const TestimonialsPage = () => {
  // اتصال به نظرات مشترک سایت و پنل مدیریت
  const {
    reviews,
    addReview,
    updateLikes,
  } = useTestimonials();

  // State for search and filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);

  // Modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  // New review form state
  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    product: '',
    rating: 5,
    title: '',
    text: '',
    city: 'تهران',
  });

  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // State for tracking which reviews are liked by the current user
  const [likedReviews, setLikedReviews] = useState({});

  // Handle like button toggle
  const handleLikeToggle = (id) => {
    const isCurrentlyLiked = likedReviews[id];

    setLikedReviews((prev) => ({
      ...prev,
      [id]: !isCurrentlyLiked,
    }));

    const currentReview = reviews.find(
      (item) => item.id === id
    );

    if (!currentReview) return;

    updateLikes(
      id,
      isCurrentlyLiked
        ? Math.max(0, currentReview.likes - 1)
        : currentReview.likes + 1
    );
  };

  // Handle new review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.text) return;

    const createdReview = {
      id: Date.now(),
      name: newReview.name,
      city: newReview.city || 'تهران',
      date: 'همین الان',
      verified: true,
      category: 'online',
      product: newReview.product || 'محصول سفارشی طلا',
      rating: Number(newReview.rating),
      likes: 1,
      title: newReview.title || 'تجربه خرید زیورآلات فاخر',
      text: newReview.text,
      avatarEmoji: '🌟',
      hasPhoto: false,
      photoUrl: null,
      brandReply:
        'با تشکر از ثبت دیدگاه ارزشمندتان! نظر شما پس از بررسی به اشتراک گذاشته شد.',
    };

    // ذخیره در TestimonialsContext
    // و در نتیجه localStorage
    addReview(createdReview);

    setReviewSubmitted(true);

    setTimeout(() => {
      setReviewSubmitted(false);
      setIsSubmitModalOpen(false);

      setNewReview({
        name: '',
        role: '',
        product: '',
        rating: 5,
        title: '',
        text: '',
        city: 'تهران',
      });
    }, 1800);
  };

  // =====================================================
  // ✅ Filter logic — فقط نظرات تأییدشده نمایش داده می‌شن
  // =====================================================
  const filteredReviews = reviews
    .filter((rev) => {
      // ✅ فقط نظرات تأییدشده
      if (!rev.verified) return false;

      if (
        selectedCategory === 'online' &&
        rev.category !== 'online'
      ) {
        return false;
      }

      if (
        selectedCategory === 'inperson' &&
        rev.category !== 'inperson'
      ) {
        return false;
      }

      if (
        selectedCategory === 'custom' &&
        rev.category !== 'custom'
      ) {
        return false;
      }

      if (
        selectedCategory === 'photo' &&
        !rev.hasPhoto
      ) {
        return false;
      }

      if (
        onlyWithPhotos &&
        !rev.hasPhoto
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();

        const matchesName =
          rev.name?.toLowerCase().includes(query);

        const matchesText =
          rev.text?.toLowerCase().includes(query);

        const matchesProduct =
          rev.product?.toLowerCase().includes(query);

        const matchesTitle =
          rev.title?.toLowerCase().includes(query);

        return (
          matchesName ||
          matchesText ||
          matchesProduct ||
          matchesTitle
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }

      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }

      return b.id - a.id;
    });

  // تعداد نظرات تأییدشده برای نمایش در تب "همه نظرات"
  const verifiedReviewsCount = reviews.filter(
    (r) => r.verified
  ).length;

  const categories = [
    {
      id: 'all',
      label: `همه نظرات (${verifiedReviewsCount})`,
    },
    {
      id: 'photo',
      label: 'عکس‌دار 🖼️',
    },
    {
      id: 'online',
      label: 'خرید آنلاین 🛒',
    },
    {
      id: 'inperson',
      label: 'گالری فرشته 🏢',
    },
    {
      id: 'custom',
      label: 'سفارش سفارشی 💎',
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Header Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlowOverlay} />

        <div className={styles.container}>
          {/* Breadcrumb Navigation */}
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

            <span className={styles.breadcrumbActive}>
              نظرات و تجربیات مشتریان
            </span>
          </nav>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className={styles.heroContent}
          >
            <div className={styles.badgeGroup}>
              <Sparkles
                size={16}
                className={styles.sparkleIcon}
              />

              <span>
                صدای همراهان وفادار • رضایت ۹۹.۴٪
              </span>
            </div>

            <h1 className={styles.heroTitle}>
              تجربه درخشان خریداران{' '}
              <span className={styles.goldGlowText}>
                Luxury Jewel
              </span>
            </h1>

            <p className={styles.heroSubtitle}>
              مجموعه کامل نظرات، تجربیات واقعی و تصاویر
              ارسالی خریداران محترم جواهرات فاخر ما.
              اعتماد و درخشش رضایت شما، ارزشمندترین سرمایه
              ۳۵ سال فعالیت هنری ماست.
            </p>

            {/* Quick Action Button */}
            <button
              type="button"
              className={styles.heroSubmitBtn}
              onClick={() =>
                setIsSubmitModalOpen(true)
              }
            >
              <PlusCircle size={18} />

              <span>
                ثبت تجربه و نظر شما
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Overview Statistics & Rating Summary Bar */}
      <section className={styles.summarySection}>
        <div className={styles.container}>
          <div className={styles.summaryCard}>
            {/* Overall Rating Score Box */}
            <div className={styles.ratingScoreBox}>
              <div className={styles.scoreBig}>
                ۴.۹
              </div>

              <div className={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    fill="var(--accent)"
                    stroke="none"
                  />
                ))}
              </div>

              <div className={styles.scoreText}>
                از مجموع ۱,۴۸۰+ نظر ثبت‌شده
              </div>

              <div className={styles.recommendBadge}>
                <CheckCheck size={16} />

                <span>
                  ۹۸٪ پیشنهاد به دوستان
                </span>
              </div>
            </div>

            <div className={styles.summaryDivider} />

            {/* Star Distribution Progress Bars */}
            <div className={styles.barsContainer}>
              <div className={styles.barItem}>
                <span className={styles.barLabel}>
                  ۵ ستاره
                </span>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: '94%' }}
                  />
                </div>

                <span className={styles.barPercent}>
                  ۹۴٪
                </span>
              </div>

              <div className={styles.barItem}>
                <span className={styles.barLabel}>
                  ۴ ستاره
                </span>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: '5%' }}
                  />
                </div>

                <span className={styles.barPercent}>
                  ۵٪
                </span>
              </div>

              <div className={styles.barItem}>
                <span className={styles.barLabel}>
                  ۳ ستاره
                </span>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: '1%' }}
                  />
                </div>

                <span className={styles.barPercent}>
                  ۱٪
                </span>
              </div>

              <div className={styles.barItem}>
                <span className={styles.barLabel}>
                  ۲ و ۱ ستاره
                </span>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: '0%' }}
                  />
                </div>

                <span className={styles.barPercent}>
                  ۰٪
                </span>
              </div>
            </div>

            <div className={styles.summaryDivider} />

            {/* Key Trust Guarantees */}
            <div className={styles.trustGroup}>
              <div className={styles.trustItem}>
                <UserCheck
                  size={20}
                  className={styles.trustIcon}
                />

                <div>
                  <strong>
                    ۱۰۰٪ خریدار واقعی
                  </strong>

                  <p>
                    تایید هویت از روی فاکتور رسمی
                  </p>
                </div>
              </div>

              <div className={styles.trustItem}>
                <ShieldCheck
                  size={20}
                  className={styles.trustIcon}
                />

                <div>
                  <strong>
                    ضمانت اصالت GIA
                  </strong>

                  <p>
                    شناسنامه دیجیتال و معتبر
                  </p>
                </div>
              </div>

              <div className={styles.trustItem}>
                <Award
                  size={20}
                  className={styles.trustIcon}
                />

                <div>
                  <strong>
                    پشتیبانی VIP
                  </strong>

                  <p>
                    پاسخگویی سریع کمتر از ۲ ساعت
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter, Search & Reviews Grid Section */}
      <section className={styles.mainReviewsSection}>
        <div className={styles.container}>
          {/* Controls Bar */}
          <div className={styles.controlsBar}>
            {/* Category Tabs */}
            <div className={styles.categoryTabs}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.catTabBtn} ${
                    selectedCategory === cat.id
                      ? styles.catTabActive
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedCategory(cat.id)
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input & Sort Selector */}
            <div className={styles.filterActionsRow}>
              {/* Search Box */}
              <div className={styles.searchBox}>
                <Search
                  size={16}
                  className={styles.searchIcon}
                />

                <input
                  type="text"
                  placeholder="جستجو در متن یا اسم خریدار..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className={styles.searchInput}
                />

                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() =>
                      setSearchQuery('')
                    }
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className={styles.sortBox}>
                <SlidersHorizontal
                  size={15}
                  className={styles.sortIcon}
                />

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className={styles.sortSelect}
                >
                  <option value="newest">
                    جدیدترین نظرات
                  </option>

                  <option value="popular">
                    محبوب‌ترین (بیشترین لایک)
                  </option>

                  <option value="highest">
                    بیشترین امتیاز (۵ ستاره)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count & Active Filters Summary */}
          <div className={styles.resultsInfoRow}>
            <span>
              نمایش{' '}
              <strong>
                {filteredReviews.length}
              </strong>{' '}
              نظر تاییدشده
            </span>

            <button
              type="button"
              className={styles.addReviewTriggerBtn}
              onClick={() =>
                setIsSubmitModalOpen(true)
              }
            >
              <PlusCircle size={15} />

              <span>
                افزودن دیدگاه شما
              </span>
            </button>
          </div>

          {/* Reviews Grid */}
          <div className={styles.reviewsGrid}>
            <AnimatePresence mode="popLayout">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.94,
                      y: -15,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className={styles.reviewCard}
                  >
                    {/* Header Row */}
                    <div className={styles.cardTopHeader}>
                      <div className={styles.userInfoGroup}>
                        <div
                          className={styles.avatarCircle}
                        >
                          <span>
                            {item.avatarEmoji}
                          </span>
                        </div>

                        <div className={styles.userMeta}>
                          <div
                            className={
                              styles.userNameRow
                            }
                          >
                            <span
                              className={
                                styles.userName
                              }
                            >
                              {item.name}
                            </span>

                            {item.verified && (
                              <span
                                className={
                                  styles.verifiedBadge
                                }
                                title="خریدار تایید شده"
                              >
                                <CheckCircle2 size={13} />

                                <span>
                                  خریدار تاییدشده
                                </span>
                              </span>
                            )}
                          </div>

                          <div
                            className={
                              styles.userSubDetails
                            }
                          >
                            <span>
                              <MapPin size={11} />
                              {item.city}
                            </span>

                            <span>•</span>

                            <span>
                              <Calendar size={11} />
                              {item.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stars Rating */}
                      <div className={styles.cardStars}>
                        {[...Array(item.rating)].map(
                          (_, idx) => (
                            <Star
                              key={idx}
                              size={16}
                              fill="var(--accent)"
                              stroke="none"
                            />
                          )
                        )}
                      </div>
                    </div>

                    {/* Product Name Badge */}
                    <div
                      className={
                        styles.productBadgeRow
                      }
                    >
                      <span
                        className={
                          styles.productTag
                        }
                      >
                        <Sparkles
                          size={12}
                          className={
                            styles.productTagIcon
                          }
                        />

                        خرید: {item.product}
                      </span>
                    </div>

                    {/* Review Title & Text */}
                    <h3
                      className={styles.reviewTitle}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={styles.reviewText}
                    >
                      {item.text}
                    </p>

                    {/* Customer Photo Attachment */}
                    {item.hasPhoto &&
                      item.photoUrl && (
                        <div
                          className={
                            styles.photoContainer
                          }
                          onClick={() =>
                            setSelectedImageModal(
                              item.photoUrl
                            )
                          }
                        >
                          <img
                            src={item.photoUrl}
                            alt={item.product}
                            className={
                              styles.photoImg
                            }
                          />

                          <div
                            className={
                              styles.photoOverlay
                            }
                          >
                            <Camera size={18} />

                            <span>
                              مشاهده تصویر بزرگ‌تر
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Official Brand Reply */}
                    {item.brandReply && (
                      <div
                        className={
                          styles.brandReplyBox
                        }
                      >
                        <div
                          className={
                            styles.replyHeader
                          }
                        >
                          <MessageCircle
                            size={14}
                            className={
                              styles.replyIcon
                            }
                          />

                          <span>
                            پاسخ مدیر گالری ژوئل
                          </span>
                        </div>

                        <p
                          className={
                            styles.replyText
                          }
                        >
                          {item.brandReply}
                        </p>
                      </div>
                    )}

                    {/* Card Footer Interaction Row */}
                    <div
                      className={styles.cardFooter}
                    >
                      <button
                        type="button"
                        className={`${
                          styles.likeBtn
                        } ${
                          likedReviews[item.id]
                            ? styles.likedActive
                            : ''
                        }`}
                        onClick={() =>
                          handleLikeToggle(item.id)
                        }
                      >
                        <ThumbsUp size={15} />

                        <span>
                          مفید بود ({item.likes})
                        </span>
                      </button>

                      <div
                        className={
                          styles.footerShareGroup
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.iconActionBtn
                          }
                          title="اشتراک‌گذاری"
                          onClick={() => {
                            if (
                              navigator.share
                            ) {
                              navigator
                                .share({
                                  title:
                                    item.title,
                                  text:
                                    item.text,
                                  url:
                                    window.location
                                      .href,
                                })
                                .catch(() => {});
                            }
                          }}
                        >
                          <Share2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Search
                    size={40}
                    className={styles.emptyIcon}
                  />

                  <h3>
                    هیچ نظری با این مشخصات یافت نشد
                  </h3>

                  <p>
                    لطفاً کلمه کلیدی دیگری را جستجو
                    کنید یا فیلترها را تغییر دهید.
                  </p>

                  <button
                    type="button"
                    className={
                      styles.resetFilterBtn
                    }
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setOnlyWithPhotos(false);
                    }}
                  >
                    پاکسازی فیلترها
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Customer Gallery Photo Showcase */}
      <section
        className={styles.galleryShowcaseSection}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.subTag}>
              گالری عکس‌های مشتریان
            </span>

            <h2 className={styles.sectionTitle}>
              درخشش واقعی جواهرات{' '}
              <span className={styles.goldText}>
                در دستان شما
              </span>
            </h2>

            <p className={styles.sectionDesc}>
              تصاویری که همراهان باذوق ژوئل پس از
              تحویل سفارش برای ما ارسال کرده‌اند.
            </p>
          </div>

          <div className={styles.photoGrid}>
            {reviews
              .filter((r) => r.hasPhoto && r.verified)
              .map((r) => (
                <div
                  key={r.id}
                  className={styles.galleryCard}
                  onClick={() =>
                    setSelectedImageModal(
                      r.photoUrl
                    )
                  }
                >
                  <img
                    src={r.photoUrl}
                    alt={r.product}
                  />

                  <div
                    className={
                      styles.galleryMetaOverlay
                    }
                  >
                    <span
                      className={
                        styles.galleryUser
                      }
                    >
                      {r.name}
                    </span>

                    <span
                      className={
                        styles.galleryProd
                      }
                    >
                      {r.product}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Submit Review Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={() =>
              setIsSubmitModalOpen(false)
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              className={styles.modalCard}
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() =>
                  setIsSubmitModalOpen(false)
                }
              >
                <X size={18} />
              </button>

              <div className={styles.modalHeader}>
                <div
                  className={styles.modalBadge}
                >
                  <Sparkles size={14} />

                  <span>
                    ثبت تجربیات ارزشمند
                  </span>
                </div>

                <h2>
                  ثبت نظر و تجربه خرید شما
                </h2>

                <p>
                  بازخورد شما چراغ راه ما برای ارتقای
                  خدمات گالری ژوئل است.
                </p>
              </div>

              <div className={styles.modalBody}>
                {reviewSubmitted ? (
                  <div
                    className={
                      styles.successMessage
                    }
                  >
                    <CheckCircle2
                      size={50}
                      className={
                        styles.successIcon
                      }
                    />

                    <h3>
                      دیدگاه شما با موفقیت ثبت شد!
                    </h3>

                    <p>
                      از این که تجربه خود را با
                      سایر همراهان ژوئل به اشتراک
                      گذاشتید بسیار سپاسگزاریم.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleReviewSubmit}
                    className={
                      styles.reviewForm
                    }
                  >
                    <div
                      className={
                        styles.formGroupRow
                      }
                    >
                      <div
                        className={
                          styles.formField
                        }
                      >
                        <label>
                          نام و نام خانوادگی *
                        </label>

                        <input
                          type="text"
                          required
                          placeholder="مثلاً: مریم احمدی"
                          value={newReview.name}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div
                        className={
                          styles.formField
                        }
                      >
                        <label>
                          شهر محل سکونت
                        </label>

                        <input
                          type="text"
                          placeholder="مثلاً: تهران"
                          value={newReview.city}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div
                      className={styles.formField}
                    >
                      <label>
                        نام محصول خریداری‌شده
                      </label>

                      <input
                        type="text"
                        placeholder="مثلاً: انگشتر برلیان طرح فلورانس"
                        value={newReview.product}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            product:
                              e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Rating Selector */}
                    <div
                      className={styles.formField}
                    >
                      <label>
                        امتیاز شما به خرید
                      </label>

                      <div
                        className={
                          styles.starPickerRow
                        }
                      >
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              className={
                                styles.starPickerBtn
                              }
                              onClick={() =>
                                setNewReview({
                                  ...newReview,
                                  rating: star,
                                })
                              }
                            >
                              <Star
                                size={24}
                                fill={
                                  star <=
                                  newReview.rating
                                    ? 'var(--accent)'
                                    : 'none'
                                }
                                stroke={
                                  star <=
                                  newReview.rating
                                    ? 'var(--accent)'
                                    : 'var(--text-secondary)'
                                }
                              />
                            </button>
                          )
                        )}

                        <span
                          className={
                            styles.starRatingLabel
                          }
                        >
                          {newReview.rating} از ۵
                          ستاره
                        </span>
                      </div>
                    </div>

                    <div
                      className={styles.formField}
                    >
                      <label>
                        عنوان اصلی تجربه شما
                      </label>

                      <input
                        type="text"
                        placeholder="مثلاً: بسته بندی عالی و کیفیت بی‌نظیر"
                        value={newReview.title}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div
                      className={styles.formField}
                    >
                      <label>
                        متن کامل نظر و تجربه شما *
                      </label>

                      <textarea
                        required
                        rows={4}
                        placeholder="جزئیات تجربه خود درباره کیفیت طلا، برخورد پشتیبانی، بسته بندی و..."
                        value={newReview.text}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            text: e.target.value,
                          })
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      className={
                        styles.submitFormBtn
                      }
                    >
                      <Send size={16} />

                      <span>
                        ارسال دیدگاه
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Preview Zoom Modal */}
      <AnimatePresence>
        {selectedImageModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() =>
              setSelectedImageModal(null)
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              className={styles.imageZoomCard}
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() =>
                  setSelectedImageModal(null)
                }
              >
                <X size={20} />
              </button>

              <img
                src={selectedImageModal}
                alt="بزرگنمایی تصویر نظر"
                className={styles.zoomImg}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsPage;