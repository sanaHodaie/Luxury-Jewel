import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Gem,
  Hammer,
  Feather,
  History,
  ArrowRight,
  Compass,
  Star,
  ChevronLeft,
  CheckCircle2,
  Crown,
  Layers,
  MapPin,
  MessageSquareQuote,
  CheckCheck
} from 'lucide-react';
import styles from './BrandStoryPage.module.css';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const BrandStoryPage = () => {
  const { settings } = useSiteSettings();
  const [activeEra, setActiveEra] = useState('all');

  const timelineEvents = [
    {
      id: 1,
      year: '۱۳۷۰',
      yearEn: '1991',
      era: '70s',
      title: 'تاسیس نخستین کارگاه زرگری ژوئل',
      subtitle: 'آغاز گام‌های اولیه در بازار کهن تهران',
      description:
        'استاد عباس ژوئل با بیش از دو دهه شاگردی در محضر برترین استادکاران سنتی، نخستین کارگاه مستقل خود را با تمرکز بر ساخت دست‌ساز حلقه‌های نامزدی راه‌اندازی نمود.',
      badge: 'سرآغاز اصالت',
      icon: <Hammer size={18} />,
      highlights: ['ساخت ۱۰۰٪ دست‌ساز', 'طلاکاری ۱۸ عیار اصیل'],
    },
    {
      id: 2,
      year: '۱۳۸۲',
      yearEn: '2003',
      era: '80s',
      title: 'خلق کالکشن خورشیدی و نوآوری در تراش برلیان',
      subtitle: 'ترکیب مدرنیته با هنر زرگری ایران',
      description:
        'با ورود نسل دوم طراحان ژوئل، تکنیک‌های نوین مرصع‌کاری سفارشی اضافه شد و نخستین مجموعه زیورآلات فاخر آراسته به برلیان پاک و یاقوت سرخ رونمایی گردید.',
      badge: 'تحول در طراحی',
      icon: <Crown size={18} />,
      highlights: ['ثبت طرح‌های اختصاصی', 'ورود سنگ‌های شناسنامه‌دار'],
    },
    {
      id: 3,
      year: '۱۳۹۰',
      yearEn: '2011',
      era: '90s',
      title: 'افتتاح گالری مرکزی در برج فرشته تهران',
      subtitle: 'ایجاد تجربه خرید VIP برای عاشقان جواهرات',
      description:
        'گالری اختصاصی Luxury Jewel در منطقه فرشته افتتاح شد تا محیطی باشکوه، امن و خصوصی برای مشاوره اختصاصی طراحی و سفارشات کلکسیونی فراهم کند.',
      badge: 'توسعه گالری VIP',
      icon: <Star size={18} />,
      highlights: ['اتاق مشاوره VIP', 'طراحی اختصاصی با حضور مشتری'],
    },
    {
      id: 4,
      year: '۱۳۹۷',
      yearEn: '2018',
      era: '90s',
      title: 'تجهیز آزمایشگاه گوهرشناسی و اخذ استانداردهای GIA',
      subtitle: 'تضمین اصالت با استانداردهای جهانی',
      description:
        'ژوئل به عنوان نخستین گالری دارنده سیستم صدور شناسنامه دیجیتال GIA و شناسنامه‌سنجی میکروسکوپی الماس، اصالت تمامی سنگ‌های قیمتی را ۱۰۰٪ تضمین نمود.',
      badge: 'استاندارد بین‌المللی',
      icon: <ShieldCheck size={18} />,
      highlights: ['شناسنامه رسمی GIA', 'آنالیز لیزری گوهرسنگ‌ها'],
    },
    {
      id: 5,
      year: '۱۴۰۱',
      yearEn: '2022',
      era: 'modern',
      title: 'ادغام طراحی سه‌بعدی CAD و طلاپردازی نانو',
      subtitle: 'دقت میکرونی در ساخت پیچیده‌ترین شاهکارها',
      description:
        'استفاده از پرینترهای رزینی سه‌بعدی و نرم‌افزارهای پیشرفته طراحی به استادکاران امکان داد تا ظریف‌ترین جزئیات غیرممکن را با دقت ۰.۰۱ میلی‌متر خلق کنند.',
      badge: 'فناوری و دقت',
      icon: <Layers size={18} />,
      highlights: ['شبیه‌سازی سه‌بعدی پیش از ساخت', 'کاهش وزن بدون افت مقاومت'],
    },
    {
      id: 6,
      year: '۱۴۰۵',
      yearEn: '2026',
      era: 'modern',
      title: 'گالری آنلاین هوشمند و ارسال امنیتی سراسری',
      subtitle: 'درخشش بی‌مرز در تمام ایران و خاورمیانه',
      description:
        'با راه‌اندازی بستر آنلاین پیشرفته، هم‌اکنون مشتریان در سراسر کشور می‌توانند زیورآلات مورد علاقه خود را سفارش داده و با محموله بیمه‌شده تحویل بگیرند.',
      badge: 'عصر دیجیتال',
      icon: <Compass size={18} />,
      highlights: ['پرو مجازی با AR', 'ارسال بیمه‌شده ویژه'],
    },
  ];

  const filteredEvents =
    activeEra === 'all'
      ? timelineEvents
      : timelineEvents.filter((ev) => ev.era === activeEra);

  const eraTabs = [
    { id: 'all', label: 'همه پیام‌های تاریخچه' },
    { id: '70s', label: 'دهه ۷۰ (سرآغاز)' },
    { id: '80s', label: 'دهه ۸۰ (شکوفایی)' },
    { id: '90s', label: 'دهه ۹۰ (GIA و فرشته)' },
    { id: 'modern', label: '۱۴۰۰ تا امروز (عصر مدرن)' },
  ];

  const coreValues = [
    {
      icon: <Gem size={26} />,
      title: 'گوهرهای شناسنامه‌دار GIA',
      desc: 'تمامی الماس‌ها و سنگ‌های قیمتی همراه با شناسنامه معتبر بین‌المللی و کد حک شده لیزری عرضه می‌شوند.',
    },
    {
      icon: <Hammer size={26} />,
      title: 'هنر دست استادکاران',
      desc: 'بیش از ۱۵۰ ساعت ظریف‌کاری و مرصع‌کاری دست‌ساز روی هر قطعه فاخر توسط باسابقت‌ترین زرگران.',
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'طلاکاری اخلاقی',
      desc: 'استفاده از طلای ۱۸ عیار استاندارد و سنگ‌های قیمتی استخراج شده با رعایت کامل اصول محیط زیستی.',
    },
    {
      icon: <Award size={26} />,
      title: 'ضمانت بازخرید دائمی',
      desc: 'ارائه فاکتور رسمی، ضمانت اصالت همیشگی و خدمات تمیزکاری رایگان سالانه برای کلیه خریداران.',
    },
  ];

  const craftSteps = [
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
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Header Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlowOverlay} />

        <div className={styles.container}>
          {/* Breadcrumb Navigation */}
          <nav className={styles.breadcrumb} aria-label="مسیریابی">
            <Link to="/" className={styles.breadcrumbLink}>
              خانه
            </Link>
            <ChevronLeft size={14} className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbActive}>داستان برند ما</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={styles.heroContent}
          >
            <div className={styles.badgeGroup}>
              <Sparkles size={16} className={styles.sparkleIcon} />
              <span>اصالت، هنر و درخشش بیش از ۳ دهه</span>
            </div>

            <h1 className={styles.heroTitle}>
              {settings.aboutTitle} <span className={styles.goldGlowText}>به خلق شاهکار</span>
            </h1>

            <p className={styles.heroSubtitle}>
              {settings.aboutDescription}
            </p>

            <div className={styles.heroStatsRow}>
              <div className={styles.heroStatCard}>
                <span className={styles.statNum}>۳۵+</span>
                <span className={styles.statLabel}>سال تجربه زرگری</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStatCard}>
                <span className={styles.statNum}>۵۰,۰۰۰+</span>
                <span className={styles.statLabel}>مشتری وفادار</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStatCard}>
                <span className={styles.statNum}>۱۰۰٪</span>
                <span className={styles.statLabel}>شناسنامه رسمی GIA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy & Brand Core Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.subTag}>ارزش‌ها و استانداردهای ژوئل</span>
            <h2 className={styles.sectionTitle}>
              چرا گالری ژوئل <span className={styles.goldText}>نماد اعتماد و فاخری</span> است؟
            </h2>
            <p className={styles.sectionDesc}>
              ما زیورآلات را نه به عنوان یک دارایی معمولی، بلکه به عنوان یک میراث خانوادگی ارزشمند و اثر هنری منحصربه‌فرد می‌سازیم.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {coreValues.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className={styles.valueCard}
              >
                <div className={styles.valueIconFrame}>{val.icon}</div>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p className={styles.valueDesc}>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Message-Style Timeline Section */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badgeGroupCenter}>
              <MessageSquareQuote size={16} />
              <span>گاه‌شمار پیام‌های تاریخی برند</span>
            </div>
            <h2 className={styles.sectionTitle}>
              تایم‌لاین رویدادهای کلیدی <span className={styles.goldGlowText}>گالری ژوئل</span>
            </h2>
            <p className={styles.sectionDesc}>
              ایستگاه‌های مهم تاریخی ما در قالب پیام‌های کوتاه و آموزنده
            </p>

            {/* Timeline Filter Tabs */}
            <div className={styles.eraFilterBar}>
              {eraTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.eraTabBtn} ${activeEra === tab.id ? styles.eraTabActive : ''}`}
                  onClick={() => setActiveEra(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Message-Bubble Timeline Container */}
          <div className={styles.chatTimelineWrapper}>
            <div className={styles.chatTimelineLine} />

            <AnimatePresence mode="wait">
              <motion.div key={activeEra} className={styles.chatMessageList}>
                {filteredEvents.map((item, index) => {
                  const isRight = index % 2 === 0;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 25, x: isRight ? 20 : -20 }}
                      whileInView={{ opacity: 1, y: 0, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className={`${styles.chatMessageRow} ${isRight ? styles.msgRight : styles.msgLeft}`}
                    >
                      {/* Timeline Central Node Icon */}
                      <div className={styles.msgAvatarNode}>
                        <div className={styles.avatarIconInner}>{item.icon}</div>
                      </div>

                      {/* Chat Message Bubble Card */}
                      <div className={styles.chatBubbleCard}>
                        {/* Bubble Tail Accent */}
                        <div className={styles.bubbleTail} />

                        {/* Top Header Row of Message */}
                        <div className={styles.msgHeader}>
                          <div className={styles.yearTagGroup}>
                            <span className={styles.msgYear}>{item.year}</span>
                            <span className={styles.msgYearEn}>• {item.yearEn}</span>
                          </div>
                          <span className={styles.msgBadge}>{item.badge}</span>
                        </div>

                        {/* Message Main Title & Subtitle */}
                        <h3 className={styles.msgTitle}>{item.title}</h3>
                        <div className={styles.msgSubTitle}>{item.subtitle}</div>

                        {/* Message Body Content */}
                        <p className={styles.msgBodyText}>{item.description}</p>

                        {/* Message Highlights / Tags */}
                        <div className={styles.msgFooterTags}>
                          {item.highlights.map((h, hIdx) => (
                            <span key={hIdx} className={styles.tagPill}>
                              <CheckCircle2 size={12} className={styles.pillIcon} />
                              {h}
                            </span>
                          ))}
                          <div className={styles.seenCheck}>
                            <CheckCheck size={14} className={styles.doubleCheckIcon} />
                            <span>ثبت شده</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Craftsmanship & Process Section */}
      <section className={styles.craftSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.subTag}>فرآیند خلق اثر</span>
            <h2 className={styles.sectionTitle}>
              چگونه یک <span className={styles.goldText}>شاهکار طلا و گوهر</span> متولد می‌شود؟
            </h2>
            <p className={styles.sectionDesc}>
              مراحل دقیق و وسواس‌گونه خلق زیورآلات سفارشی از طرح اولیه تا تحویل در جعبه مخمل فاخر
            </p>
          </div>

          <div className={styles.craftStepsGrid}>
            {craftSteps.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={styles.craftStepCard}
              >
                <div className={styles.stepNumBadge}>{s.step}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Quote & Moral Statement */}
      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.quoteBox}
          >
            <Feather size={36} className={styles.featherIcon} />

            <blockquote className={styles.quoteText}>
              «ما طلا را نمی‌فروشیم؛ ما لبخندهای ماندگار، احساسات عمیق و نمادهای جاودانه‌ی عشق را مجسم می‌کنیم.
              هر زمان که قطعه‌ای از ژوئل بر دست یا گردن شما می‌نشیند، افتخار زرگری اصیل ایرانی با شما همراه است.»
            </blockquote>

            <div className={styles.authorMeta}>
              <div className={styles.authorName}>استاد عباس ژوئل</div>
              <div className={styles.authorRole}>بنیان‌گذار و استادکار ارشد گالری ژوئل</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <div className={styles.ctaHeader}>
              <Sparkles size={22} style={{ color: 'var(--accent)' }} />
              <h2>آماده‌اید شاهکار اختصاصی خود را پیدا کنید؟</h2>
              <p>
                کالکشن‌های فاخر طلا، برلیان و گوهرسنگ‌های نایاب ما را مشاهده کنید یا همین امروز وقت مشاوره اختصاصی رزرو نمایید.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link to="/" className={styles.primaryCtaBtn}>
                <span>مشاهده کالکشن‌های جواهرات</span>
                <ArrowRight size={18} />
              </Link>

              <a href="#newsletter" className={styles.secondaryCtaBtn}>
                <MapPin size={18} />
                <span>بازدید از گالری فرشته</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandStoryPage;
