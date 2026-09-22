import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Sparkles,
  BarChart3,
  Gem,
  History,
  Hammer,
  Quote,
  Megaphone,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  Layers,
  Award,
} from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import styles from './AdminBrandStoryPage.module.css';

const defaultBrandStory = {
  hero: {
    badge: 'اصالت، هنر و درخشش بیش از ۳ دهه',
    title: 'ما در تلاشیم',
    titleHighlight: 'به خلق شاهکار',
    description:
      'تجربه‌ای متفاوت از هنر اصیل جواهرسازی، طراحی مدرن و انتخاب نایاب‌ترین گوهرها.',
  },

  stats: [
    { number: '۳۵+', label: 'سال تجربه زرگری' },
    { number: '۵۰,۰۰۰+', label: 'مشتری وفادار' },
    { number: '۱۰۰٪', label: 'شناسنامه رسمی GIA' },
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
    description: 'ایستگاه‌های مهم تاریخی ما در قالب پیام‌های کوتاه و آموزنده',
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
      highlights: ['ساخت ۱۰۰٪ دست‌ساز', 'طلاکاری ۱۸ عیار اصیل'],
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
      highlights: ['ثبت طرح‌های اختصاصی', 'ورود سنگ‌های شناسنامه‌دار'],
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
      highlights: ['اتاق مشاوره VIP', 'طراحی اختصاصی با حضور مشتری'],
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
      highlights: ['شناسنامه رسمی GIA', 'آنالیز لیزری گوهرسنگ‌ها'],
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
      highlights: ['شبیه‌سازی سه‌بعدی پیش از ساخت', 'کاهش وزن بدون افت مقاومت'],
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
      highlights: ['پرو مجازی با AR', 'ارسال بیمه‌شده ویژه'],
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

/* ============ Toast (Center Screen) ============ */
function Toast({ toast, onClose }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!toast) {
      setLeaving(false);
      return;
    }

    setLeaving(false);

    // شروع محو شدن بعد از ۲.۵ ثانیه
    const fadeTimer = setTimeout(() => setLeaving(true), 2500);
    // حذف کامل بعد از پایان انیمیشن محو (۰.۵ ثانیه)
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
          <div className={`${styles.sectionIcon} ${styles[`iconTone_${iconTone}`]}`}>
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

export default function AdminBrandStoryPage() {
  const { settings, updateSettings } = useSiteSettings();

  const [data, setData] = useState(settings?.brandStory || defaultBrandStory);
  const [saved, setSaved] = useState(true);
  const [toast, setToast] = useState(null);

  // sync if settings loaded later
  useEffect(() => {
    if (settings?.brandStory && !data) {
      setData(settings.brandStory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // mark dirty on any change
  useEffect(() => {
    setSaved(false);
  }, [data]);

  const update = (path, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let current = next;

      keys.slice(0, -1).forEach((key) => {
        current[key] = current[key] || {};
        current = current[key];
      });

      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const save = () => {
    updateSettings({ brandStory: data });
    setSaved(true);
    setToast({
      type: 'success',
      message: 'اطلاعات داستان برند با موفقیت ذخیره شد.',
    });
  };

  /* ---- helpers for arrays ---- */
  const addStat = () =>
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, { number: '', label: '' }],
    }));

  const removeStat = (index) =>
    setData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));

  const addCoreValue = () =>
    setData((prev) => ({
      ...prev,
      coreValues: [...prev.coreValues, { title: '', desc: '' }],
    }));

  const removeCoreValue = (index) =>
    setData((prev) => ({
      ...prev,
      coreValues: prev.coreValues.filter((_, i) => i !== index),
    }));

  const addTimelineEvent = () =>
    setData((prev) => ({
      ...prev,
      timelineEvents: [
        ...prev.timelineEvents,
        {
          year: '',
          yearEn: '',
          era: '',
          title: '',
          subtitle: '',
          description: '',
          badge: '',
          highlights: [],
        },
      ],
    }));

  const removeTimelineEvent = (index) =>
    setData((prev) => ({
      ...prev,
      timelineEvents: prev.timelineEvents.filter((_, i) => i !== index),
    }));

  const addHighlight = (eventIndex) => {
    setData((prev) => ({
      ...prev,
      timelineEvents: prev.timelineEvents.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              highlights: [...(event.highlights || []), ''],
            }
          : event
      ),
    }));
  };

  const removeHighlight = (eventIndex, hlIndex) => {
    setData((prev) => ({
      ...prev,
      timelineEvents: prev.timelineEvents.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              highlights: event.highlights.filter((_, i) => i !== hlIndex),
            }
          : event
      ),
    }));
  };

  const addCraftStep = () =>
    setData((prev) => ({
      ...prev,
      craftSteps: [...prev.craftSteps, { step: '', title: '', desc: '' }],
    }));

  const removeCraftStep = (index) =>
    setData((prev) => ({
      ...prev,
      craftSteps: prev.craftSteps.filter((_, i) => i !== index),
    }));

  const handleToastClose = useCallback(() => setToast(null), []);

  const progress = useMemo(() => {
    let filled = 0;
    let total = 0;
    const check = (v) => {
      total += 1;
      if (v && String(v).trim()) filled += 1;
    };
    check(data.hero?.badge);
    check(data.hero?.title);
    check(data.hero?.titleHighlight);
    check(data.hero?.description);
    check(data.values?.title);
    check(data.timeline?.title);
    check(data.craft?.title);
    check(data.quote?.text);
    check(data.cta?.title);
    return total ? Math.round((filled / total) * 100) : 0;
  }, [data]);

  return (
    <div dir="rtl" className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerBadge}>
            <Sparkles size={14} />
            <span>پنل مدیریت محتوا</span>
          </div>
          <h1 className={styles.headerTitle}>داستان درباره ما</h1>
          <p className={styles.headerDescription}>
            تمام محتوای صفحه داستان برند را از اینجا مدیریت کنید. تغییرات به‌صورت
            زنده در پیش‌نمایش اعمال می‌شوند.
          </p>

          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressLabel}>{progress}٪ تکمیل شده</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={save}
            className={`${styles.primaryButton} ${
              saved ? styles.primaryButtonSaved : ''
            }`}
          >
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saved ? 'ذخیره شد' : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <SectionCard
        icon={ImageIcon}
        iconTone="indigo"
        title="بخش اصلی صفحه"
        description="عنوان، متن بالای عنوان و توضیحات معرفی برند."
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>متن بالای عنوان</label>
            <input
              className={styles.input}
              value={data.hero.badge}
              onChange={(e) => update('hero.badge', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>عنوان</label>
            <input
              className={styles.input}
              value={data.hero.title}
              onChange={(e) => update('hero.title', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>عنوان طلایی</label>
            <input
              className={styles.input}
              value={data.hero.titleHighlight}
              onChange={(e) => update('hero.titleHighlight', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              className={styles.textarea}
              value={data.hero.description}
              onChange={(e) => update('hero.description', e.target.value)}
            />
          </div>
        </div>
      </SectionCard>

      {/* STATS */}
      <SectionCard
        icon={BarChart3}
        iconTone="emerald"
        title="آمار"
        description="اعداد و عناوین کلیدی که در کنار هم نمایش داده می‌شوند."
        count={data.stats.length}
        action={
          <button type="button" className={styles.addButton} onClick={addStat}>
            <Plus size={16} />
            افزودن آمار
          </button>
        }
      >
        <div className={styles.itemsContainer}>
          {data.stats.length === 0 && (
            <div className={styles.emptyState}>
              <BarChart3 size={28} />
              <p className={styles.emptyStateTitle}>هنوز آماری اضافه نشده</p>
              <p className={styles.emptyStateText}>
                روی دکمه «افزودن آمار» کلیک کنید.
              </p>
            </div>
          )}

          {data.stats.map((item, index) => (
            <div className={styles.itemCard} key={index}>
              <div className={styles.itemCardHeader}>
                <span className={styles.itemNumber}>{index + 1}</span>
                <p className={styles.itemTitle}>آمار {index + 1}</p>
                <DeleteButton onConfirm={() => removeStat(index)} />
              </div>

              <div className={styles.twoColumns}>
                <input
                  className={styles.input}
                  value={item.number}
                  onChange={(e) =>
                    update(`stats.${index}.number`, e.target.value)
                  }
                  placeholder="عدد"
                />

                <input
                  className={styles.input}
                  value={item.label}
                  onChange={(e) =>
                    update(`stats.${index}.label`, e.target.value)
                  }
                  placeholder="عنوان"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* VALUES */}
      <SectionCard
        icon={Award}
        iconTone="amber"
        title="ارزش‌ها و استانداردها"
        description="توضیح کلی و لیست ارزش‌های اصلی برند."
        count={data.coreValues.length}
        action={
          <button type="button" className={styles.addButton} onClick={addCoreValue}>
            <Plus size={16} />
            افزودن ارزش
          </button>
        }
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>برچسب بالا</label>
            <input
              className={styles.input}
              value={data.values.tag}
              onChange={(e) => update('values.tag', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>عنوان</label>
            <input
              className={styles.input}
              value={data.values.title}
              onChange={(e) => update('values.title', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              className={styles.textarea}
              value={data.values.description}
              onChange={(e) => update('values.description', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.itemsContainer} style={{ marginTop: 20 }}>
          {data.coreValues.length === 0 && (
            <div className={styles.emptyState}>
              <Award size={28} />
              <p className={styles.emptyStateTitle}>هنوز ارزشی ثبت نشده</p>
              <p className={styles.emptyStateText}>
                ارزش‌های برند خود را اضافه کنید.
              </p>
            </div>
          )}

          {data.coreValues.map((item, index) => (
            <div className={styles.itemCard} key={index}>
              <div className={styles.itemCardHeader}>
                <span className={styles.itemNumber}>{index + 1}</span>
                <p className={styles.itemTitle}>ارزش {index + 1}</p>
                <DeleteButton onConfirm={() => removeCoreValue(index)} />
              </div>

              <div className={styles.formGroup} style={{ marginBottom: 12 }}>
                <label className={styles.label}>عنوان</label>
                <input
                  className={styles.input}
                  value={item.title}
                  onChange={(e) =>
                    update(`coreValues.${index}.title`, e.target.value)
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>توضیحات</label>
                <textarea
                  className={styles.textarea}
                  value={item.desc}
                  onChange={(e) =>
                    update(`coreValues.${index}.desc`, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* TIMELINE */}
      <SectionCard
        icon={History}
        iconTone="sky"
        title="تاریخچه برند"
        description="رویدادهای مهم در طول سال‌ها."
        count={data.timelineEvents.length}
        action={
          <button
            type="button"
            className={styles.addButton}
            onClick={addTimelineEvent}
          >
            <Plus size={16} />
            افزودن رویداد
          </button>
        }
      >
        <div className={styles.formGrid} style={{ marginBottom: 20 }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>برچسب بالا</label>
            <input
              className={styles.input}
              value={data.timeline.tag}
              onChange={(e) => update('timeline.tag', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>عنوان</label>
            <input
              className={styles.input}
              value={data.timeline.title}
              onChange={(e) => update('timeline.title', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              className={styles.textarea}
              value={data.timeline.description}
              onChange={(e) => update('timeline.description', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.itemsContainer}>
          {data.timelineEvents.length === 0 && (
            <div className={styles.emptyState}>
              <History size={28} />
              <p className={styles.emptyStateTitle}>هنوز رویدادی ثبت نشده</p>
              <p className={styles.emptyStateText}>
                تاریخچه برند خود را مستند کنید.
              </p>
            </div>
          )}

          {data.timelineEvents.map((item, index) => (
            <div className={styles.timelineItem} key={index}>
              <div className={styles.itemCardHeader}>
                <span className={`${styles.itemNumber} ${styles.itemNumberSky}`}>
                  {index + 1}
                </span>
                <p className={styles.itemTitle}>
                  رویداد {index + 1} {item.year ? `— ${item.year}` : ''}
                </p>
                <DeleteButton onConfirm={() => removeTimelineEvent(index)} />
              </div>

              <div className={styles.threeColumns}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>سال</label>
                  <input
                    className={styles.input}
                    value={item.year}
                    onChange={(e) =>
                      update(`timelineEvents.${index}.year`, e.target.value)
                    }
                    placeholder="۱۳۷۰"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>سال میلادی</label>
                  <input
                    className={styles.input}
                    value={item.yearEn}
                    onChange={(e) =>
                      update(`timelineEvents.${index}.yearEn`, e.target.value)
                    }
                    placeholder="1991"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>دوره</label>
                  <input
                    className={styles.input}
                    value={item.era}
                    onChange={(e) =>
                      update(`timelineEvents.${index}.era`, e.target.value)
                    }
                    placeholder="70s / 80s / modern"
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: 12 }}>
                <label className={styles.label}>عنوان</label>
                <input
                  className={styles.input}
                  value={item.title}
                  onChange={(e) =>
                    update(`timelineEvents.${index}.title`, e.target.value)
                  }
                />
              </div>

              <div className={styles.formGroup} style={{ marginTop: 12 }}>
                <label className={styles.label}>زیرعنوان</label>
                <input
                  className={styles.input}
                  value={item.subtitle}
                  onChange={(e) =>
                    update(`timelineEvents.${index}.subtitle`, e.target.value)
                  }
                />
              </div>

              <div className={styles.formGroup} style={{ marginTop: 12 }}>
                <label className={styles.label}>توضیحات</label>
                <textarea
                  className={styles.textarea}
                  value={item.description}
                  onChange={(e) =>
                    update(
                      `timelineEvents.${index}.description`,
                      e.target.value
                    )
                  }
                />
              </div>

              <div className={styles.formGroup} style={{ marginTop: 12 }}>
                <label className={styles.label}>برچسب</label>
                <input
                  className={styles.input}
                  value={item.badge}
                  onChange={(e) =>
                    update(`timelineEvents.${index}.badge`, e.target.value)
                  }
                />
              </div>

              {/* Highlights */}
              <div style={{ marginTop: 16 }}>
                <div className={styles.highlightsHeader}>
                  <label className={styles.label}>نکات برجسته</label>
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => addHighlight(index)}
                  >
                    <Plus size={14} />
                    افزودن
                  </button>
                </div>

                <div className={styles.highlightsContainer}>
                  {(!item.highlights || item.highlights.length === 0) && (
                    <p className={styles.emptyHint}>
                      هنوز نکته‌ای اضافه نشده است.
                    </p>
                  )}

                  {item.highlights?.map((hl, hlIndex) => (
                    <div className={styles.highlightRow} key={hlIndex}>
                      <input
                        className={styles.input}
                        value={hl}
                        onChange={(e) =>
                          update(
                            `timelineEvents.${index}.highlights.${hlIndex}`,
                            e.target.value
                          )
                        }
                        placeholder="مثال: ساخت ۱۰۰٪ دست‌ساز"
                      />
                      <DeleteButton
                        onConfirm={() => removeHighlight(index, hlIndex)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* CRAFT */}
      <SectionCard
        icon={Hammer}
        iconTone="rose"
        title="فرآیند ساخت"
        description="مراحل خلق اثر و توضیح هر مرحله."
        count={data.craftSteps.length}
        action={
          <button type="button" className={styles.addButton} onClick={addCraftStep}>
            <Plus size={16} />
            افزودن مرحله
          </button>
        }
      >
        <div className={styles.formGrid} style={{ marginBottom: 20 }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>برچسب بالا</label>
            <input
              className={styles.input}
              value={data.craft.tag}
              onChange={(e) => update('craft.tag', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>عنوان</label>
            <input
              className={styles.input}
              value={data.craft.title}
              onChange={(e) => update('craft.title', e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              className={styles.textarea}
              value={data.craft.description}
              onChange={(e) => update('craft.description', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.itemsContainer}>
          {data.craftSteps.length === 0 && (
            <div className={styles.emptyState}>
              <Hammer size={28} />
              <p className={styles.emptyStateTitle}>هنوز مرحله‌ای اضافه نشده</p>
              <p className={styles.emptyStateText}>مراحل ساخت را مستند کنید.</p>
            </div>
          )}

          {data.craftSteps.map((item, index) => (
            <div className={styles.stepCard} key={index}>
              <div className={styles.stepNumber}>
                {item.step || `0${index + 1}`}
              </div>

              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <p className={styles.itemTitle}>
                    <Layers size={14} /> مرحله {index + 1}
                  </p>
                  <DeleteButton onConfirm={() => removeCraftStep(index)} />
                </div>

                <div className={styles.twoColumns}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>شماره مرحله</label>
                    <input
                      className={styles.input}
                      value={item.step}
                      onChange={(e) =>
                        update(`craftSteps.${index}.step`, e.target.value)
                      }
                      placeholder="۰۱"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>عنوان</label>
                    <input
                      className={styles.input}
                      value={item.title}
                      onChange={(e) =>
                        update(`craftSteps.${index}.title`, e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: 12 }}>
                  <label className={styles.label}>توضیحات</label>
                  <textarea
                    className={styles.textarea}
                    value={item.desc}
                    onChange={(e) =>
                      update(`craftSteps.${index}.desc`, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* QUOTE */}
      <SectionCard
        icon={Quote}
        iconTone="violet"
        title="نقل قول بنیان‌گذار"
        description="جمله‌ای ماندگار از بنیان‌گذار برند."
      >
        <div className={styles.quoteBox}>
          <div className={styles.formGroup}>
            <label className={styles.label}>متن نقل قول</label>
            <textarea
              className={`${styles.textarea} ${styles.quoteTextarea}`}
              value={data.quote.text}
              onChange={(e) => update('quote.text', e.target.value)}
            />
          </div>

          <div className={styles.quoteAuthorGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>نام</label>
              <input
                className={styles.input}
                value={data.quote.author}
                onChange={(e) => update('quote.author', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>سمت</label>
              <input
                className={styles.input}
                value={data.quote.role}
                onChange={(e) => update('quote.role', e.target.value)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* CTA */}
      <SectionCard
        icon={Megaphone}
        iconTone="cyan"
        title="بخش پایانی صفحه"
        description="متن و دکمه‌های فراخوان به اقدام."
      >
        <div className={styles.ctaBox}>
          <div className={styles.formGroup}>
            <label className={styles.label}>عنوان</label>
            <input
              className={styles.input}
              value={data.cta.title}
              onChange={(e) => update('cta.title', e.target.value)}
            />
          </div>

          <div className={styles.formGroup} style={{ marginTop: 12 }}>
            <label className={styles.label}>توضیحات</label>
            <textarea
              className={styles.textarea}
              value={data.cta.description}
              onChange={(e) => update('cta.description', e.target.value)}
            />
          </div>

          <div className={styles.ctaButtons}>
            <div className={styles.formGroup}>
              <label className={styles.label}>متن دکمه اصلی</label>
              <input
                className={styles.input}
                value={data.cta.primaryText}
                onChange={(e) => update('cta.primaryText', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>متن دکمه دوم</label>
              <input
                className={styles.input}
                value={data.cta.secondaryText}
                onChange={(e) => update('cta.secondaryText', e.target.value)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* SAVE BAR */}
      <div className={styles.saveBar}>
        <div className={styles.saveInfo}>
          {saved ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {saved ? 'همه تغییرات ذخیره شده است.' : 'تغییرات ذخیره‌نشده دارید.'}
        </div>

        <div className={styles.saveActions}>
          <button
            type="button"
            onClick={save}
            className={`${styles.primaryButton} ${
              saved ? styles.primaryButtonSaved : ''
            }`}
          >
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saved ? 'ذخیره شد' : 'ذخیره تمام تغییرات'}
          </button>
        </div>
      </div>

      {/* TOAST */}
      <Toast toast={toast} onClose={handleToastClose} />
    </div>
  );
}