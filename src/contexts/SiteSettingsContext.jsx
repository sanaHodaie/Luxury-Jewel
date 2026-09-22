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
   DEFAULT CONTACT PAGE
========================================================= */

export const DEFAULT_CONTACT_PAGE = {
  hero: {
    badge: 'ارتباط با گالری لوکس ژوئل • پاسخگویی ۲۴ ساعته',
    title: 'ارتباط با کارشناسان Luxury Jewel',
    subtitle:
      'برای دریافت مشاوره تخصصی، استعلام قیمت، سفارش ساخت اختصاصی یا رزرو وقت VIP، با کارشناسان ما در ارتباط باشید.',
    primaryButtonText: 'رزرو وقت VIP',
    secondaryButtonText: 'مشاهده موقعیت گالری',
    phoneButtonText: 'تماس مستقیم',
  },

  gallery: {
    badge: 'گالری ژوئل',
    title: 'تجربه‌ای متفاوت از خرید جواهرات',
    description:
      'در فضایی خصوصی و لوکس، مجموعه‌ای از فاخرترین طلا و جواهرات را مشاهده کنید.',
  },

  quickCards: {
    address: {
      tagText: 'موقعیت گالری',
      title: 'آدرس گالری',
      detail: '',
      subText: 'گالری مرکزی Luxury Jewel',
      actionText: 'مسیریابی روی نقشه',
    },

    hours: {
      liveText: 'اکنون باز است',
      title: 'ساعات کاری',
      description:
        'برای مشاوره اختصاصی و بازدید از کالکشن‌ها در ساعات زیر منتظر شما هستیم.',
      rows: [
        {
          label: 'شنبه تا چهارشنبه',
          value: '۱۰:۰۰ تا ۲۰:۰۰',
        },
        {
          label: 'پنجشنبه',
          value: '۱۰:۰۰ تا ۱۸:۰۰',
        },
        {
          label: 'جمعه',
          value: 'با هماهنگی قبلی',
        },
      ],
      noteText: 'پنجشنبه‌ها تا ۲۰:۰۰ و جمعه‌ها با وقت قبلی',
    },

    phone: {
      responseText: 'پاسخگویی سریع',
      title: 'تماس تلفنی',
      description:
        'کارشناسان ما آماده پاسخگویی و مشاوره تخصصی جواهرات هستند.',
      officeLabel: 'دفتر مرکزی',
      vipLabel: 'مشاوره VIP',
      trustText: 'تماس امن و محرمانه',
    },

    whatsapp: {
      liveText: 'آنلاین ۲۴/۷',
      title: 'واتساپ',
      description: 'پاسخگویی سریع کارشناسان',
      previewText: 'سلام، در خدمت شما هستیم 💎',
      buttonText: 'شروع گفتگو',
    },
  },

  mainForm: {
    badge: 'در تماس باشید',
    title: 'چطور می‌توانیم کمکتان کنیم؟',
    subtitle:
      'فرم زیر را تکمیل کنید تا کارشناسان ما در کوتاه‌ترین زمان با شما تماس بگیرند.',

    fields: {
      fullNameLabel: 'نام و نام خانوادگی',
      fullNamePlaceholder: 'نام خود را وارد کنید',

      phoneLabel: 'شماره تماس',
      phonePlaceholder: '۰۹۱۲۱۲۳۴۵۶۷',

      emailLabel: 'ایمیل',
      emailPlaceholder: 'example@email.com',

      subjectLabel: 'موضوع درخواست',

      preferredChannelLabel: 'روش ترجیحی ارتباط',

      messageLabel: 'پیام شما',
      messagePlaceholder:
        'توضیحات یا درخواست خود را برای ما بنویسید...',

      submitButtonText: 'ارسال درخواست',
    },

    subjects: [
      {
        value: 'consultation',
        label: 'مشاوره تخصصی طلا و برلیان',
      },
      {
        value: 'custom_order',
        label: 'سفارش ساخت طرح اختصاصی',
      },
      {
        value: 'order_tracking',
        label: 'پیگیری سفارش و فاکتور',
      },
      {
        value: 'vip_appointment',
        label: 'رزرو وقت مشاوره حضوری',
      },
      {
        value: 'feedback',
        label: 'پیشنهادات و انتقادات',
      },
    ],

    channels: [
      {
        value: 'phone',
        label: 'تماس تلفنی',
      },
      {
        value: 'whatsapp',
        label: 'واتساپ',
      },
      {
        value: 'email',
        label: 'ایمیل',
      },
    ],

    messages: {
      successTitle: 'پیام شما با موفقیت دریافت شد!',
      successDescription:
        'از ارتباط شما با گالری ژوئل سپاسگزاریم. کارشناسان ما به زودی جهت پاسخگویی و مشاوره تخصصی با شما تماس می‌گیرند.',
      validationError:
        'لطفاً تمامی فیلدهای ضروری (نام، شماره تماس و متن پیام) را تکمیل نمایید.',
    },
  },

  vip: {
    badge: 'مشاوره اختصاصی VIP',

    title: 'وقت اختصاصی خود را رزرو کنید',

    subtitle:
      'برای مشاهده مجموعه‌های خاص، مشاوره تخصصی یا طراحی سفارش اختصاصی، زمان مناسب خود را انتخاب کنید.',

    fields: {
      nameLabel: 'نام و نام خانوادگی',
      namePlaceholder: 'نام شما',

      phoneLabel: 'شماره تماس',
      phonePlaceholder: 'شماره موبایل',

      dateLabel: 'تاریخ مراجعه',

      timeLabel: 'ساعت مراجعه',

      interestLabel: 'زمینه مورد علاقه',

      submitButtonText: 'رزرو وقت VIP',
    },

    defaultDate: '۲۹ اردیبهشت ۱۴۰۶',

    timeSlots: [
      {
        value: '10-12',
        label: '۱۰ تا ۱۲',
      },
      {
        value: '12-14',
        label: '۱۲ تا ۱۴',
      },
      {
        value: '14-16',
        label: '۱۴ تا ۱۶',
      },
      {
        value: '16-18',
        label: '۱۶ تا ۱۸',
      },
      {
        value: '18-20',
        label: '۱۸ تا ۲۰',
      },
    ],

    interests: [
      {
        value: 'bridal',
        label: 'سرویس عروس و جواهرات برلیان',
      },
      {
        value: 'engagement',
        label: 'حلقه نامزدی و تک‌نگین',
      },
      {
        value: 'custom',
        label: 'سفارشات دست‌ساز اختصاصی',
      },
      {
        value: 'daily_gold',
        label: 'طلا و زیورآلات مدرن روزمره',
      },
    ],

    successMessage: {
      title: 'درخواست وقت VIP شما ثبت شد!',
      description:
        'تیم تشریفات گالری ژوئل جهت تایید نهایی وقت ملاقات با شما تماس خواهند گرفت.',
    },

    trustNote:
      'اطلاعات شما کاملاً محرمانه خواهد بود و صرفاً برای هماهنگی مشاوره استفاده می‌شود.',
  },

  location: {
    tag: 'موقعیت گالری',

    title: 'درخشش را از نزدیک تجربه کنید',

    description:
      'در گالری ژوئل می‌توانید مجموعه‌های منتخب ما را از نزدیک مشاهده کرده و با کارشناسان جواهرات مشاوره اختصاصی داشته باشید.',

    showroomBadge: 'نمایشگاه و گالری مرکزی',

    accessFeatures: [
      'پارکینگ اختصاصی',
      'ورود و امنیت کنترل‌شده',
      'مشاوره تخصصی گوهرشناسی',
    ],

    mapTitle: 'گالری Luxury Jewel',

    mapAddress: '',

    mapButtonText: 'مسیریابی در Google Maps',

    mapsUrl: '',
  },

  social: {
    badge: 'همراه ما باشید',

    title: 'دنیای ژوئل را دنبال کنید',

    description:
      'برای مشاهده جدیدترین کالکشن‌ها، پشت صحنه طراحی و اخبار گالری با ما همراه باشید.',

    benefits: [
      'معرفی جدیدترین کالکشن‌ها',
      'پشت صحنه طراحی و ساخت',
      'اعلام رویدادها و پیشنهادهای ویژه',
    ],

    instagramLabel: 'اینستاگرام ژوئل',

    instagramUrl: '',

    whatsappLabel: 'واتساپ ژوئل',

    whatsappUrl: '',

    liveBadge: 'پاسخگویی آنلاین',
  },

  faq: {
    tag: 'سؤالات متداول',

    title: 'پاسخ پرسش‌های شما',

    description:
      'اگر سؤال شما در این بخش نیست، می‌توانید مستقیماً با کارشناسان ما تماس بگیرید.',

    items: [
      {
        question: 'آیا امکان رزرو وقت مشاوره حضوری وجود دارد؟',
        answer:
          'بله، می‌توانید از طریق بخش رزرو وقت VIP زمان مورد نظر خود را انتخاب کنید.',
      },

      {
        question:
          'آیا امکان سفارش ساخت جواهرات اختصاصی وجود دارد؟',
        answer:
          'بله، طراحی و ساخت سفارشی یکی از خدمات گالری ژوئل است و پس از مشاوره اولیه مراحل طراحی آغاز می‌شود.',
      },

      {
        question: 'چطور می‌توانم سفارش خود را پیگیری کنم؟',
        answer:
          'برای پیگیری سفارش می‌توانید از طریق تماس تلفنی یا واتساپ با کارشناسان گالری در ارتباط باشید.',
      },

      {
        question:
          'آیا ارسال سفارش به شهرهای دیگر انجام می‌شود؟',
        answer:
          'بله، سفارش‌ها با بسته‌بندی و شرایط امنیتی مناسب به شهرهای مختلف ارسال می‌شوند.',
      },
    ],
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

  contactPage: DEFAULT_CONTACT_PAGE,
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

    /* =====================================================
       BRAND STORY
    ===================================================== */

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

    /* =====================================================
       CONTACT PAGE
    ===================================================== */

    contactPage: {
      ...DEFAULT_CONTACT_PAGE,
      ...(saved.contactPage || {}),

      hero: {
        ...DEFAULT_CONTACT_PAGE.hero,
        ...(saved.contactPage?.hero || {}),
      },

      gallery: {
        ...DEFAULT_CONTACT_PAGE.gallery,
        ...(saved.contactPage?.gallery || {}),
      },

      quickCards: {
        ...DEFAULT_CONTACT_PAGE.quickCards,
        ...(saved.contactPage?.quickCards || {}),

        address: {
          ...DEFAULT_CONTACT_PAGE.quickCards.address,
          ...(saved.contactPage?.quickCards?.address || {}),
        },

        hours: {
          ...DEFAULT_CONTACT_PAGE.quickCards.hours,
          ...(saved.contactPage?.quickCards?.hours || {}),

          rows: Array.isArray(
            saved.contactPage?.quickCards?.hours?.rows
          )
            ? saved.contactPage.quickCards.hours.rows
            : DEFAULT_CONTACT_PAGE.quickCards.hours.rows,
        },

        phone: {
          ...DEFAULT_CONTACT_PAGE.quickCards.phone,
          ...(saved.contactPage?.quickCards?.phone || {}),
        },

        whatsapp: {
          ...DEFAULT_CONTACT_PAGE.quickCards.whatsapp,
          ...(saved.contactPage?.quickCards?.whatsapp || {}),
        },
      },

      mainForm: {
        ...DEFAULT_CONTACT_PAGE.mainForm,
        ...(saved.contactPage?.mainForm || {}),

        fields: {
          ...DEFAULT_CONTACT_PAGE.mainForm.fields,
          ...(saved.contactPage?.mainForm?.fields || {}),
        },

        subjects: Array.isArray(saved.contactPage?.mainForm?.subjects)
          ? saved.contactPage.mainForm.subjects
          : DEFAULT_CONTACT_PAGE.mainForm.subjects,

        channels: Array.isArray(saved.contactPage?.mainForm?.channels)
          ? saved.contactPage.mainForm.channels
          : DEFAULT_CONTACT_PAGE.mainForm.channels,
      },

      vip: {
        ...DEFAULT_CONTACT_PAGE.vip,
        ...(saved.contactPage?.vip || {}),

        fields: {
          ...DEFAULT_CONTACT_PAGE.vip.fields,
          ...(saved.contactPage?.vip?.fields || {}),
        },

        timeSlots: Array.isArray(saved.contactPage?.vip?.timeSlots)
          ? saved.contactPage.vip.timeSlots
          : DEFAULT_CONTACT_PAGE.vip.timeSlots,

        interests: Array.isArray(saved.contactPage?.vip?.interests)
          ? saved.contactPage.vip.interests
          : DEFAULT_CONTACT_PAGE.vip.interests,
      },

      location: {
        ...DEFAULT_CONTACT_PAGE.location,
        ...(saved.contactPage?.location || {}),

        accessFeatures: Array.isArray(
          saved.contactPage?.location?.accessFeatures
        )
          ? saved.contactPage.location.accessFeatures
          : DEFAULT_CONTACT_PAGE.location.accessFeatures,
      },

      social: {
        ...DEFAULT_CONTACT_PAGE.social,
        ...(saved.contactPage?.social || {}),

        benefits: Array.isArray(saved.contactPage?.social?.benefits)
          ? saved.contactPage.social.benefits
          : DEFAULT_CONTACT_PAGE.social.benefits,
      },

      faq: {
        ...DEFAULT_CONTACT_PAGE.faq,
        ...(saved.contactPage?.faq || {}),

        items: Array.isArray(saved.contactPage?.faq?.items)
          ? saved.contactPage.faq.items
          : DEFAULT_CONTACT_PAGE.faq.items,
      },
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