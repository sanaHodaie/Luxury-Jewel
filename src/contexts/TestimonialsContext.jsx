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

import { supabase } from '../lib/supabase';

const TestimonialsContext = createContext(null);

/* =========================================================
   DEFAULT TESTIMONIALS
   فقط برای fallback / reset
========================================================= */

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

/* =========================================================
   تبدیل رکورد Supabase به ساختار فعلی React
========================================================= */

const mapFromDatabase = (row) => ({
  id: row.id,
  name: row.name,
  city: row.city || '',
  date: row.date || '',
  verified: row.verified ?? false,
  category: row.category || 'online',
  product: row.product || '',
  rating: row.rating ?? 5,
  likes: row.likes ?? 0,
  title: row.title || '',
  text: row.text || '',
  avatarEmoji: row.avatar_emoji || '🌟',
  hasPhoto: row.has_photo ?? false,
  photoUrl: row.photo_url || null,
  brandReply: row.brand_reply || '',
});

/* =========================================================
   تبدیل ساختار React به ساختار Supabase
========================================================= */

const mapToDatabase = (review) => ({
  name: review.name,
  city: review.city || '',
  date: review.date || '',
  verified: review.verified ?? false,
  category: review.category || 'online',
  product: review.product || '',
  rating: Number(review.rating) || 5,
  likes: Number(review.likes) || 0,
  title: review.title || '',
  text: review.text || '',
  avatar_emoji: review.avatarEmoji || '🌟',
  has_photo: review.hasPhoto ?? false,
  photo_url: review.photoUrl || null,
  brand_reply: review.brandReply || '',
});

/* =========================================================
   آپلود عکس نظر مشتری
========================================================= */

const uploadTestimonialPhoto = async (file) => {
  try {
    if (!file) {
      return null;
    }

    // فقط تصاویر
    if (!file.type.startsWith('image/')) {
      throw new Error(
        'فایل انتخاب‌شده باید تصویر باشد.'
      );
    }

    // محدودیت حجم: 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        'حجم تصویر نباید بیشتر از ۵ مگابایت باشد.'
      );
    }

    // ساخت نام یکتا برای جلوگیری از تداخل فایل‌ها
    const fileExtension =
      file.name.split('.').pop()?.toLowerCase() ||
      'jpg';

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${fileExtension}`;

    const filePath = `customer-reviews/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from('testimonial-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from('testimonial-images')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  } catch (error) {
    console.error(
      'خطا در آپلود تصویر نظر مشتری:',
      error
    );

    return null;
  }
};
/* =========================================================
   PROVIDER
========================================================= */

export function TestimonialsProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     خواندن نظرات از Supabase
  ======================================================= */

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        setReviews(
          Array.isArray(data)
            ? data.map(mapFromDatabase)
            : []
        );
      } catch (error) {
        console.error(
          'خطا در خواندن نظرات مشتریان از Supabase:',
          error
        );

        /*
         * اگر Supabase خطا داشت، برای اینکه صفحه خالی نماند
         * از داده‌های پیش‌فرض استفاده می‌کنیم.
         */
        setReviews(DEFAULT_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  /* =======================================================
     افزودن نظر
  ======================================================= */

  const addReview = async (review) => {
    try {
      const payload = mapToDatabase(review);

      const { data, error } = await supabase
        .from('testimonials')
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newReview = mapFromDatabase(data);

      setReviews((currentReviews) => [
        newReview,
        ...currentReviews,
      ]);

      return newReview;
    } catch (error) {
      console.error(
        'خطا در افزودن نظر مشتری:',
        error
      );

      return null;
    }
  };

  /* =======================================================
     ویرایش نظر
  ======================================================= */

  const updateReview = async (id, updates) => {
    try {
      const databaseUpdates = mapToDatabase({
        ...reviews.find(
          (review) => review.id === id
        ),
        ...updates,
      });

      const { data, error } = await supabase
        .from('testimonials')
        .update(databaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedReview =
        mapFromDatabase(data);

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === id
            ? updatedReview
            : review
        )
      );

      return updatedReview;
    } catch (error) {
      console.error(
        'خطا در ویرایش نظر مشتری:',
        error
      );

      return null;
    }
  };

  /* =======================================================
     حذف نظر
  ======================================================= */

  const deleteReview = async (id) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review.id !== id
        )
      );

      return true;
    } catch (error) {
      console.error(
        'خطا در حذف نظر مشتری:',
        error
      );

      return false;
    }
  };

  /* =======================================================
     تغییر وضعیت تایید
  ======================================================= */

  const toggleVerified = async (id) => {
    try {
      const currentReview = reviews.find(
        (review) => review.id === id
      );

      if (!currentReview) {
        return;
      }

      const { data, error } = await supabase
        .from('testimonials')
        .update({
          verified: !currentReview.verified,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedReview =
        mapFromDatabase(data);

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === id
            ? updatedReview
            : review
        )
      );
    } catch (error) {
      console.error(
        'خطا در تغییر وضعیت تایید نظر:',
        error
      );
    }
  };

  /* =======================================================
     تغییر تعداد لایک
  ======================================================= */

  const updateLikes = async (id, likes) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          likes: Number(likes) || 0,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedReview =
        mapFromDatabase(data);

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === id
            ? updatedReview
            : review
        )
      );
    } catch (error) {
      console.error(
        'خطا در تغییر تعداد لایک:',
        error
      );
    }
  };

  /* =======================================================
     بازگردانی نظرات اولیه
  ======================================================= */

  const resetReviews = async () => {
    try {
      const { error: deleteError } =
        await supabase
          .from('testimonials')
          .delete()
          .not('id', 'is', null);

      if (deleteError) {
        throw deleteError;
      }

      const databaseReviews =
        DEFAULT_TESTIMONIALS.map((review) => ({
          ...mapToDatabase(review),
          photo_url: null,
        }));

      const { data, error: insertError } =
        await supabase
          .from('testimonials')
          .insert(databaseReviews)
          .select();

      if (insertError) {
        throw insertError;
      }

      setReviews(
        Array.isArray(data)
          ? data.map(mapFromDatabase)
          : []
      );
    } catch (error) {
      console.error(
        'خطا در بازگردانی نظرات اولیه:',
        error
      );
    }
  };

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

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
    uploadTestimonialPhoto,
  }),
  [reviews, loading]
);

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

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