import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import backlet from '../assets/images/Gemini_Generated_Image_lqhb72lqhb72lqhb.webp';
import coupleRing from '../assets/images/Gemini_Generated_Image_nfe8d8nfe8d8nfe8.webp';
import watchandbaclet from '../assets/images/Gemini_Generated_Image_tp7custp7custp7c.webp';
import Ring from '../assets/images/Gemini_Generated_Image_meyj5dmeyj5dmeyj.webp';
import coupleSet from '../assets/images/Gemini_Generated_Image_kezxe9kezxe9kezx.webp';
import amitisitneckles from '../assets/images/Gemini_Generated_Image_3f1r173f1r173f1r.webp';

const TestimonialsContext = createContext(null);

const STORAGE_KEY = 'luxury_jewel_testimonials';

export const DEFAULT_TESTIMONIALS = [
  {
    id: 3,
    name: 'مریم حسینی',
    city: 'شیراز',
    date: '۱ هفته پیش',
    verified: true,
    category: 'online',
    product: 'گردنبند آمیتیست و طلا ۱۸ عیار',
    rating: 5,
    likes: 42,
    title: 'ظرافت خیره‌کننده و ارسال سریع بیمه‌شده',
    text: 'هر بار که این گردنبند رو در مهمانی‌ها می‌پوشم، همه ازم می‌پرسن از کجا خریدم! رنگ سنگ آمیتیست بسیار اصیل و ارغوانی روشنه. ارسال هم با پیک اختصاصی و بیمه باربری انجام شد.',
    avatarEmoji: '👩‍🎨',
    hasPhoto: true,
    photoUrl: amitisitneckles,
    brandReply: 'مبارکتون باشه در شادی ها استفاده بکنید.',
  },

  {
    id: 2,
    name: 'مهندس احمد رضایی',
    city: 'اصفهان',
    date: '۵ روز پیش',
    verified: true,
    category: 'custom',
    product: 'حلقه نامزدی سفارشی با تراش زمرد',
    rating: 5,
    likes: 29,
    title: 'دقت میکرونی در ساخت سفارش سفارشی',
    text: 'من طرح خاصی مد نظرم بود که طبق عکس‌های ارسالی برام شبیه‌سازی ۳بعدی کردن. نتیجه کار فراتر از انتظارم شد. وزن دقیق طلا با ترازو دیجیتال پیش خودم وزن شد و اصالت سنگ ۱۰۰٪ تایید گردید.',
    avatarEmoji: '👨‍💼',
    hasPhoto: true,
    photoUrl: Ring,
    brandReply: 'جناب مهندس رضایی گرامی، اعتماد شما افتخار ماست. پیوندتان فرخنده و پایدار باد!',
  },

  {
    id: 4,
    name: 'دکتر علیرضا کاظمی',
    city: 'تهران، فرشته',
    date: '۲ هفته پیش',
    verified: true,
    category: 'inperson',
    product: 'ساعت و بنگل طلا',
    rating: 5,
    likes: 19,
    title: 'میزبانی باشکوه در گالری فرشته',
    text: 'بازدید حضوری از گالری و مشاوره با استادکاران در محیط خصوصی VIP بسیار لذت‌بخش بود. کیفیت ساخت و پرداخت زرگری کاملاً متمایز از سایر گالری‌هاست.',
    avatarEmoji: '👨‍⚕️',
    hasPhoto: true,
    photoUrl: watchandbaclet,
    brandReply: 'جناب دکتر کاظمی، قدم بر چشم ما گذاشتید. همواره منتظر دیدار مجدد شما در گالری هستیم.',
  },

  {
    id: 5,
    name: 'نیلوفر و بهزاد',
    city: 'مشهد',
    date: '۳ هفته پیش',
    verified: true,
    category: 'custom',
    product: 'ست ستاره شب (حلقه ازدواج جفت)',
    rating: 5,
    likes: 54,
    title: 'بهترین یادگاری برای مهم‌ترین روز زندگی‌مون',
    text: 'ما برای ست حلقه ازدواج خیلی وسواس داشتیم. تیم ژوئل با صبوری تمام ۵ طرح مختلف رو برامون رندر گرفتن تا بالاخره طرح دلخواهمون ساخته شد. حکاکی تاریخ ازدواجمون هم رایگان و بسیار ظریف انجام شد.',
    avatarEmoji: '👩‍❤️‍👨',
    hasPhoto: true,
    photoUrl: coupleRing,
    brandReply: 'عزیزان دلم، خوشبختی شما آرزوی قلبی تمام مجموعه ژوئل است.',
  },

  {
    id: 6,
    name: 'پریناز اکبری',
    city: 'تبریز',
    date: '۱ ماه پیش',
    verified: true,
    category: 'online',
    product: 'دستبند زنجیری طلا طرح سولاریوم',
    rating: 5,
    likes: 15,
    title: 'وزن سبک با نمای فوق‌العاده درخشان',
    text: 'دنبال دستبندی بودم که هم قیمتش مناسب باشه و هم نما داشته باشه. این مدل فوق‌العاده‌ست! قفل بسیار محکمی داره و اصلاً به لباس گیر نمیکنه.',
    avatarEmoji: '👩‍💻',
    hasPhoto: true,
    photoUrl: backlet,
    brandReply: 'خیلی ممنون از شما خانم اکبری که رضایتتون رو با سایر مشتری های ما در میان گذاشتید.',
  },

  {
    id: 7,
    name: 'امیرحسین شایسته',
    city: 'کرج',
    date: '۱ ماه پیش',
    verified: true,
    category: 'inperson',
    product: 'نیم‌ست کارتیر زوجی',
    rating: 5,
    likes: 31,
    title: 'اصالت زمرد و شناسنامه معتبر',
    text: 'یکی از بهترین نیمست های طلای عمرم هست که تونستم برای خانمم و خودم تهیه کنم و خوشحالش کنم',
    avatarEmoji: '👨‍💼',
    hasPhoto: true,
    photoUrl: coupleSet,
    brandReply: 'جناب شایسته عزیز، مبارکتون باشه. نگهداری و درخشش ست کارتیر شما همواره تحت ضمانت ماست.',
  },
];

export function TestimonialsProvider({ children }) {
  const [reviews, setReviews] = useState(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  // ---------- خواندن نظرات ذخیره‌شده ----------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setReviews(parsed);
        } else {
          setReviews(DEFAULT_TESTIMONIALS);
        }
      } else {
        setReviews(DEFAULT_TESTIMONIALS);
      }
    } catch (error) {
      console.error(
        'خطا در خواندن نظرات مشتریان:',
        error
      );

      setReviews(DEFAULT_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- ذخیره نظرات ----------
  const saveReviews = (nextReviews) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextReviews)
      );

      setReviews(nextReviews);
    } catch (error) {
      console.error(
        'خطا در ذخیره نظرات مشتریان:',
        error
      );
    }
  };

  // ---------- افزودن نظر ----------
  const addReview = (review) => {
    const newReview = {
      ...review,
      id:
        review?.id ||
        Date.now(),
    };

    saveReviews([
      newReview,
      ...reviews,
    ]);

    return newReview;
  };

  // ---------- ویرایش نظر ----------
  const updateReview = (id, updates) => {
    const nextReviews = reviews.map((review) =>
      review.id === id
        ? {
            ...review,
            ...updates,
          }
        : review
    );

    saveReviews(nextReviews);
  };

  // ---------- حذف نظر ----------
  const deleteReview = (id) => {
    const nextReviews = reviews.filter(
      (review) => review.id !== id
    );

    saveReviews(nextReviews);
  };

  // ---------- تغییر وضعیت تایید ----------
  const toggleVerified = (id) => {
    const nextReviews = reviews.map((review) =>
      review.id === id
        ? {
            ...review,
            verified: !review.verified,
          }
        : review
    );

    saveReviews(nextReviews);
  };

  // ---------- تغییر تعداد لایک ----------
  const updateLikes = (id, likes) => {
    const nextReviews = reviews.map((review) =>
      review.id === id
        ? {
            ...review,
            likes,
          }
        : review
    );

    saveReviews(nextReviews);
  };

  // ---------- بازگردانی نظرات اولیه ----------
  const resetReviews = () => {
    localStorage.removeItem(STORAGE_KEY);
    setReviews(DEFAULT_TESTIMONIALS);
  };

  const value = useMemo(
    () => ({
      reviews,
      loading,
      addReview,
      updateReview,
      deleteReview,
      toggleVerified,
      updateLikes,
      resetReviews,
    }),
    [reviews, loading]
  );

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const context = useContext(
    TestimonialsContext
  );

  if (!context) {
    throw new Error(
      'useTestimonials باید داخل TestimonialsProvider استفاده شود.'
    );
  }

  return context;
}