import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const SiteSettingsContext = createContext(null);

const STORAGE_KEY = 'luxury_jewel_site_settings';

/* =========================================================
   DEFAULT BRAND STORY
========================================================= */

export const DEFAULT_BRAND_STORY = {
  hero: {
    badge: 'اصالت، هنر و درخشش بیش از ۳ دهه',
    title: 'ما در تلاشیم',
    titleHighlight: 'به خلق شاهکار',
    description:
      'تجربه‌ای متفاوت از هنر اصیل جواهرسازی، طراحی مدرن و انتخاب نایاب‌ترین گوهرها.',
  },

  stats: [
    {
      number: '۳۵+',
      label: 'سال تجربه زرگری',
    },
    {
      number: '۵۰,۰۰۰+',
      label: 'مشتری وفادار',
    },
    {
      number: '۱۰۰٪',
      label: 'شناسنامه رسمی GIA',
    },
  ],

  values: {
    tag: 'ارزش‌ها و استانداردهای ژوئل',
    title: 'چرا گالری ژوئل نماد اعتماد و فاخری است؟',
    description:
      'ما زیورآلات را نه به عنوان یک دارایی معمولی، بلکه به عنوان یک میراث خانوادگی ارزشمند و اثر هنری منحصربه‌فرد می‌سازیم.',
  },

  coreValues: [
    {
      title: 'گوهرهای شناسنامه‌دار GIA',
      desc: 'تمامی الماس‌ها و سنگ‌های قیمتی همراه با شناسنامه معتبر بین‌المللی و کد حک شده لیزری عرضه می‌شوند.',
    },
    {
      title: 'هنر دست استادکاران',
      desc: 'بیش از ۱۵۰ ساعت ظریف‌کاری و مرصع‌کاری دست‌ساز روی هر قطعه فاخر توسط باسابقه‌ترین زرگران.',
    },
    {
      title: 'طلاکاری اخلاقی',
      desc: 'استفاده از طلای ۱۸ عیار استاندارد و سنگ‌های قیمتی استخراج شده با رعایت کامل اصول محیط زیستی.',
    },
    {
      title: 'ضمانت بازخرید دائمی',
      desc: 'ارائه فاکتور رسمی، ضمانت اصالت همیشگی و خدمات تمیزکاری رایگان سالانه برای کلیه خریداران.',
    },
  ],

  timeline: {
    tag: 'گاه‌شمار پیام‌های تاریخی برند',
    title: 'تایم‌لاین رویدادهای کلیدی گالری ژوئل',
    description:
      'ایستگاه‌های مهم تاریخی ما در قالب پیام‌های کوتاه و آموزنده',
  },

  timelineEvents: [
    {
      year: '۱۳۷۰',
      yearEn: '1991',
      era: '70s',
      title: 'تاسیس نخستین کارگاه زرگری ژوئل',
      subtitle: 'آغاز گام‌های اولیه در بازار کهن تهران',
      description:
        'استاد عباس ژوئل با بیش از دو دهه شاگردی در محضر برترین استادکاران سنتی، نخستین کارگاه مستقل خود را با تمرکز بر ساخت دست‌ساز حلقه‌های نامزدی راه‌اندازی نمود.',
      badge: 'سرآغاز اصالت',
      highlights: [
        'ساخت ۱۰۰٪ دست‌ساز',
        'طلاکاری ۱۸ عیار اصیل',
      ],
    },
    {
      year: '۱۳۸۲',
      yearEn: '2003',
      era: '80s',
      title: 'خلق کالکشن خورشیدی و نوآوری در تراش برلیان',
      subtitle: 'ترکیب مدرنیته با هنر زرگری ایران',
      description:
        'با ورود نسل دوم طراحان ژوئل، تکنیک‌های نوین مرصع‌کاری سفارشی اضافه شد و نخستین مجموعه زیورآلات فاخر آراسته به برلیان پاک و یاقوت سرخ رونمایی گردید.',
      badge: 'تحول در طراحی',
      highlights: [
        'ثبت طرح‌های اختصاصی',
        'ورود سنگ‌های شناسنامه‌دار',
      ],
    },
    {
      year: '۱۳۹۰',
      yearEn: '2011',
      era: '90s',
      title: 'افتتاح گالری مرکزی در برج فرشته تهران',
      subtitle: 'ایجاد تجربه خرید VIP برای عاشقان جواهرات',
      description:
        'گالری اختصاصی Luxury Jewel در منطقه فرشته افتتاح شد تا محیطی باشکوه، امن و خصوصی برای مشاوره اختصاصی طراحی و سفارشات کلکسیونی فراهم کند.',
      badge: 'توسعه گالری VIP',
      highlights: [
        'اتاق مشاوره VIP',
        'طراحی اختصاصی با حضور مشتری',
      ],
    },
    {
      year: '۱۳۹۷',
      yearEn: '2018',
      era: '90s',
      title: 'تجهیز آزمایشگاه گوهرشناسی و اخذ استانداردهای GIA',
      subtitle: 'تضمین اصالت با استانداردهای جهانی',
      description:
        'ژوئل به عنوان نخستین گالری دارنده سیستم صدور شناسنامه دیجیتال GIA و شناسنامه‌سنجی میکروسکوپی الماس، اصالت تمامی سنگ‌های قیمتی را ۱۰۰٪ تضمین نمود.',
      badge: 'استاندارد بین‌المللی',
      highlights: [
        'شناسنامه رسمی GIA',
        'آنالیز لیزری گوهرسنگ‌ها',
      ],
    },
    {
      year: '۱۴۰۱',
      yearEn: '2022',
      era: 'modern',
      title: 'ادغام طراحی سه‌بعدی CAD و طلاپردازی نانو',
      subtitle: 'دقت میکرونی در ساخت پیچیده‌ترین شاهکارها',
      description:
        'استفاده از پرینترهای رزینی سه‌بعدی و نرم‌افزارهای پیشرفته طراحی به استادکاران امکان داد تا ظریف‌ترین جزئیات غیرممکن را با دقت ۰.۰۱ میلی‌متر خلق کنند.',
      badge: 'فناوری و دقت',
      highlights: [
        'شبیه‌سازی سه‌بعدی پیش از ساخت',
        'کاهش وزن بدون افت مقاومت',
      ],
    },
    {
      year: '۱۴۰۵',
      yearEn: '2026',
      era: 'modern',
      title: 'گالری آنلاین هوشمند و ارسال امنیتی سراسری',
      subtitle: 'درخشش بی‌مرز در تمام ایران و خاورمیانه',
      description:
        'با راه‌اندازی بستر آنلاین پیشرفته، هم‌اکنون مشتریان در سراسر کشور می‌توانند زیورآلات مورد علاقه خود را سفارش داده و با محموله بیمه‌شده تحویل بگیرند.',
      badge: 'عصر دیجیتال',
      highlights: [
        'پرو مجازی با AR',
        'ارسال بیمه‌شده ویژه',
      ],
    },
  ],

  craft: {
    tag: 'فرآیند خلق اثر',
    title: 'چگونه یک شاهکار طلا و گوهر متولد می‌شود؟',
    description:
      'مراحل دقیق و وسواس‌گونه خلق زیورآلات سفارشی از طرح اولیه تا تحویل در جعبه مخمل فاخر',
  },

  craftSteps: [
    {
      step: '۰۱',
      title: 'الهام و طراحی اولیه سه‌بعدی',
      desc: 'مدل‌سازی دقیق نرم‌افزاری و محاسبه زوایای انعکاس نور برلیان.',
    },
    {
      step: '۰۲',
      title: 'انتخاب و درجه‌بندی گوهر',
      desc: 'ارزیابی رنگ، پاکی و تراش تحت نظارت کارشناس رسمی GIA.',
    },
    {
      step: '۰۳',
      title: 'ریخته‌گری و مرصع‌کاری',
      desc: 'نشاندن دقیق سنگ‌ها زیر میکروسکوپ صنعتی جهت استحکام کامل.',
    },
    {
      step: '۰۴',
      title: 'پرداخت و صدور فاکتور',
      desc: 'آبکاری با رودیوم یا پلاتین و صدور سند رسمی ضمانت اصالت.',
    },
  ],

  quote: {
    text: 'ما طلا را نمی‌فروشیم؛ ما لبخندهای ماندگار، احساسات عمیق و نمادهای جاودانه‌ی عشق را مجسم می‌کنیم.',
    author: 'استاد عباس ژوئل',
    role: 'بنیان‌گذار و استادکار ارشد گالری ژوئل',
  },

  cta: {
    title: 'آماده‌اید شاهکار اختصاصی خود را پیدا کنید؟',
    description:
      'کالکشن‌های فاخر طلا، برلیان و گوهرسنگ‌های نایاب ما را مشاهده کنید یا همین امروز وقت مشاوره اختصاصی رزرو نمایید.',
    primaryText: 'مشاهده کالکشن‌های جواهرات',
    secondaryText: 'بازدید از گالری فرشته',
  },
};

/* =========================================================
   DEFAULT SITE SETTINGS
========================================================= */

export const DEFAULT_SITE_SETTINGS = {
  brandName: 'Luxury Jewel',
  brandTagline: 'زیبایی جاودانه',
  footerText:
    'گالری ژوئل؛ تلفیقی از هنر اصیل، طراحی مدرن و جواهرات فاخر.',

  aboutTitle: 'درباره ما',
  aboutDescription:
    'گالری ژوئل با تکیه بر هنر اصیل جواهرسازی و طراحی مدرن فعالیت می‌کند.',

  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  workingHours: '',
  whatsapp: '',
  instagram: '',

  brandStory: DEFAULT_BRAND_STORY,
};

/* =========================================================
   MERGE HELPER
========================================================= */

function mergeSettings(saved) {
  if (!saved || typeof saved !== 'object') {
    return DEFAULT_SITE_SETTINGS;
  }

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...saved,

    brandStory: {
      ...DEFAULT_BRAND_STORY,
      ...(saved.brandStory || {}),

      hero: {
        ...DEFAULT_BRAND_STORY.hero,
        ...(saved.brandStory?.hero || {}),
      },

      values: {
        ...DEFAULT_BRAND_STORY.values,
        ...(saved.brandStory?.values || {}),
      },

      timeline: {
        ...DEFAULT_BRAND_STORY.timeline,
        ...(saved.brandStory?.timeline || {}),
      },

      craft: {
        ...DEFAULT_BRAND_STORY.craft,
        ...(saved.brandStory?.craft || {}),
      },

      quote: {
        ...DEFAULT_BRAND_STORY.quote,
        ...(saved.brandStory?.quote || {}),
      },

      cta: {
        ...DEFAULT_BRAND_STORY.cta,
        ...(saved.brandStory?.cta || {}),
      },

      stats: Array.isArray(saved.brandStory?.stats)
        ? saved.brandStory.stats
        : DEFAULT_BRAND_STORY.stats,

      coreValues: Array.isArray(saved.brandStory?.coreValues)
        ? saved.brandStory.coreValues
        : DEFAULT_BRAND_STORY.coreValues,

      timelineEvents: Array.isArray(saved.brandStory?.timelineEvents)
        ? saved.brandStory.timelineEvents
        : DEFAULT_BRAND_STORY.timelineEvents,

      craftSteps: Array.isArray(saved.brandStory?.craftSteps)
        ? saved.brandStory.craftSteps
        : DEFAULT_BRAND_STORY.craftSteps,
    },
  };
}

/* =========================================================
   PROVIDER
========================================================= */

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(mergeSettings(parsed));
      } else {
        setSettings(DEFAULT_SITE_SETTINGS);
      }
    } catch (error) {
      console.error('خطا در خواندن تنظیمات سایت:', error);
      setSettings(DEFAULT_SITE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = (updates) => {
    setSettings((prev) => {
      const next = mergeSettings({
        ...prev,
        ...updates,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  };

  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULT_SITE_SETTINGS);
  };

  const value = useMemo(
    () => ({
      settings,
      loading,
      updateSettings,
      resetSettings,
    }),
    [settings, loading]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error(
      'useSiteSettings باید داخل SiteSettingsProvider استفاده شود.'
    );
  }

  return context;
}