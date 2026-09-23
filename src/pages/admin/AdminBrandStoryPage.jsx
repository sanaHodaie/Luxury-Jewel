
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  Save,
  Plus,
  Trash2,
  Sparkles,
  BarChart3,
  History,
  Hammer,
  Quote,
  Megaphone,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Award,
} from 'lucide-react';

import {
  useSiteSettings,
  DEFAULT_BRAND_STORY,
} from '../../contexts/SiteSettingsContext';

import styles from './AdminBrandStoryPage.module.css';

/* =========================================================
   HELPERS
========================================================= */

const clone = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

const createDefaultBrandStory = () => clone(DEFAULT_BRAND_STORY);

/* =========================================================
   TOAST
========================================================= */

function Toast({ toast, onClose }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!toast) {
      setLeaving(false);
      return;
    }

    setLeaving(false);

    const fadeTimer = setTimeout(() => {
      setLeaving(true);
    }, 2500);

    const removeTimer = setTimeout(() => {
      onClose();
    }, 3000);

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
        {isError ? (
          <AlertCircle size={20} />
        ) : (
          <CheckCircle2 size={20} />
        )}

        <span>{toast.message}</span>

        <button
          type="button"
          onClick={onClose}
          className={styles.toastClose}
          aria-label="بستن"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   DELETE BUTTON
========================================================= */

function DeleteButton({ onConfirm, title = 'حذف' }) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;

    const timer = setTimeout(() => {
      setConfirming(false);
    }, 3000);

    return () => clearTimeout(timer);
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
      title={
        confirming
          ? 'برای تأیید دوباره کلیک کنید'
          : title
      }
    >
      {confirming ? (
        <CheckCircle2 size={16} />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}

/* =========================================================
   SECTION CARD
========================================================= */

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
            className={`${styles.sectionIcon} ${
              styles[`iconTone_${iconTone}`]
            }`}
          >
            <Icon size={20} />
          </div>

          <div className={styles.sectionHeaderContent}>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>
                {title}
              </h2>

              {typeof count === 'number' && (
                <span className={styles.sectionCount}>
                  {count.toLocaleString('fa-IR')}
                </span>
              )}
            </div>

            {description && (
              <p className={styles.sectionDescription}>
                {description}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminBrandStoryPage() {
  const {
    settings,
    updateSettings,
  } = useSiteSettings();

  /*
   * -------------------------------------------------------
   * INITIAL DATA
   * -------------------------------------------------------
   *
   * مستقیماً از DEFAULT_BRAND_STORY خود Context استفاده می‌کنیم.
   * بنابراین Admin و BrandStoryPage دقیقاً یک schema دارند.
   */

  const [data, setData] = useState(() =>
    clone(settings?.brandStory || DEFAULT_BRAND_STORY)
  );

  const [saved, setSaved] = useState(true);
  const [toast, setToast] = useState(null);

  /*
   * -------------------------------------------------------
   * SYNC WITH CONTEXT
   * -------------------------------------------------------
   *
   * وقتی Context از localStorage اطلاعات را می‌خواند،
   * data داخلی Admin نیز با آن هماهنگ می‌شود.
   *
   * اما بعد از شروع ویرایش کاربر، تغییرات تایپ‌شده
   * با هر تغییر settings جایگزین نمی‌شوند.
   */

  useEffect(() => {
    if (!settings?.brandStory) return;

    setData(clone(settings.brandStory));
    setSaved(true);
  }, [settings?.brandStory]);

  /*
   * -------------------------------------------------------
   * UPDATE HELPER
   * -------------------------------------------------------
   */

  const update = useCallback((path, value) => {
    setData((prev) => {
      const next = clone(prev);

      const keys = path.split('.');
      let current = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        const key = keys[i];

        if (
          current[key] === undefined ||
          current[key] === null
        ) {
          current[key] = {};
        }

        current = current[key];
      }

      current[keys[keys.length - 1]] = value;

      return next;
    });

    setSaved(false);
  }, []);

  /*
   * -------------------------------------------------------
   * SAVE
   * -------------------------------------------------------
   */

  const save = useCallback(() => {
    try {
      updateSettings({
        brandStory: clone(data),
      });

      setSaved(true);

      setToast({
        type: 'success',
        message:
          'اطلاعات داستان برند با موفقیت ذخیره شد.',
      });
    } catch (error) {
      console.error(
        'خطا در ذخیره داستان برند:',
        error
      );

      setToast({
        type: 'error',
        message:
          'ذخیره اطلاعات داستان برند انجام نشد.',
      });
    }
  }, [data, updateSettings]);

  /*
   * -------------------------------------------------------
   * ARRAY HELPERS
   * -------------------------------------------------------
   */

  const addStat = useCallback(() => {
    setData((prev) => ({
      ...prev,
      stats: [
        ...(Array.isArray(prev.stats)
          ? prev.stats
          : []),
        {
          value: '',
          label: '',
        },
      ],
    }));

    setSaved(false);
  }, []);

  const removeStat = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      stats: (prev.stats || []).filter(
        (_, i) => i !== index
      ),
    }));

    setSaved(false);
  }, []);

  const addCoreValue = useCallback(() => {
    setData((prev) => ({
      ...prev,
      coreValues: [
        ...(Array.isArray(prev.coreValues)
          ? prev.coreValues
          : []),
        {
          title: '',
          desc: '',
        },
      ],
    }));

    setSaved(false);
  }, []);

  const removeCoreValue = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      coreValues: (prev.coreValues || []).filter(
        (_, i) => i !== index
      ),
    }));

    setSaved(false);
  }, []);

  const addTimelineEvent = useCallback(() => {
    setData((prev) => ({
      ...prev,
      timelineEvents: [
        ...(Array.isArray(prev.timelineEvents)
          ? prev.timelineEvents
          : []),
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

    setSaved(false);
  }, []);

  const removeTimelineEvent = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      timelineEvents: (
        prev.timelineEvents || []
      ).filter((_, i) => i !== index),
    }));

    setSaved(false);
  }, []);

  const addHighlight = useCallback((eventIndex) => {
    setData((prev) => ({
      ...prev,
      timelineEvents: (
        prev.timelineEvents || []
      ).map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              highlights: [
                ...(event.highlights || []),
                '',
              ],
            }
          : event
      ),
    }));

    setSaved(false);
  }, []);

  const removeHighlight = useCallback(
    (eventIndex, highlightIndex) => {
      setData((prev) => ({
        ...prev,
        timelineEvents: (
          prev.timelineEvents || []
        ).map((event, index) =>
          index === eventIndex
            ? {
                ...event,
                highlights: (
                  event.highlights || []
                ).filter(
                  (_, i) => i !== highlightIndex
                ),
              }
            : event
        ),
      }));

      setSaved(false);
    },
    []
  );

  const addCraftStep = useCallback(() => {
    setData((prev) => ({
      ...prev,
      craftSteps: [
        ...(Array.isArray(prev.craftSteps)
          ? prev.craftSteps
          : []),
        {
          step: '',
          title: '',
          desc: '',
        },
      ],
    }));

    setSaved(false);
  }, []);

  const removeCraftStep = useCallback((index) => {
    setData((prev) => ({
      ...prev,
      craftSteps: (prev.craftSteps || []).filter(
        (_, i) => i !== index
      ),
    }));

    setSaved(false);
  }, []);

  const handleToastClose = useCallback(() => {
    setToast(null);
  }, []);

  /*
   * -------------------------------------------------------
   * PROGRESS
   * -------------------------------------------------------
   */

  const progress = useMemo(() => {
    let filled = 0;
    let total = 0;

    const check = (value) => {
      total += 1;

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim()
      ) {
        filled += 1;
      }
    };

    check(data.hero?.badge);
    check(data.hero?.title);
    check(data.hero?.titleHighlight);
    check(data.hero?.description);

    check(data.values?.tag);
    check(data.values?.title);
    check(data.values?.description);

    check(data.timeline?.tag);
    check(data.timeline?.title);
    check(data.timeline?.description);

    check(data.craft?.tag);
    check(data.craft?.title);
    check(data.craft?.description);

    check(data.quote?.text);
    check(data.quote?.author);
    check(data.quote?.role);

    check(data.cta?.title);
    check(data.cta?.description);

    return total
      ? Math.round((filled / total) * 100)
      : 0;
  }, [data]);

  /*
   * -------------------------------------------------------
   * SAFE ARRAY VALUES
   * -------------------------------------------------------
   */

  const stats = Array.isArray(data.stats)
    ? data.stats
    : [];

  const coreValues = Array.isArray(data.coreValues)
    ? data.coreValues
    : [];

  const timelineEvents = Array.isArray(
    data.timelineEvents
  )
    ? data.timelineEvents
    : [];

  const craftSteps = Array.isArray(data.craftSteps)
    ? data.craftSteps
    : [];

  /*
   * -------------------------------------------------------
   * RENDER
   * -------------------------------------------------------
   */

  return (
    <div dir="rtl" className={styles.page}>
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerBadge}>
            <Sparkles size={14} />
            <span>پنل مدیریت محتوا</span>
          </div>

          <h1 className={styles.headerTitle}>
            داستان درباره ما
          </h1>

          <p className={styles.headerDescription}>
            تمام محتوای صفحه داستان برند را از اینجا
            مدیریت کنید. تغییرات پس از ذخیره، در صفحه
            عمومی داستان برند نمایش داده می‌شوند.
          </p>

          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <span className={styles.progressLabel}>
              {progress}٪ تکمیل شده
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={save}
            className={`${styles.primaryButton} ${
              saved
                ? styles.primaryButtonSaved
                : ''
            }`}
          >
            {saved ? (
              <CheckCircle2 size={18} />
            ) : (
              <Save size={18} />
            )}

            {saved
              ? 'ذخیره شد'
              : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>

      {/* ===================================================
          HERO
      =================================================== */}

      <SectionCard
        icon={ImageIcon}
        iconTone="indigo"
        title="بخش اصلی صفحه"
        description="عنوان، متن بالای عنوان و توضیحات معرفی برند."
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              متن بالای عنوان
            </label>

            <input
              className={styles.input}
              value={data.hero?.badge || ''}
              onChange={(e) =>
                update(
                  'hero.badge',
                  e.target.value
                )
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              عنوان
            </label>

            <input
              className={styles.input}
              value={data.hero?.title || ''}
              onChange={(e) =>
                update(
                  'hero.title',
                  e.target.value
                )
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              عنوان طلایی
            </label>

            <input
              className={styles.input}
              value={
                data.hero?.titleHighlight || ''
              }
              onChange={(e) =>
                update(
                  'hero.titleHighlight',
                  e.target.value
                )
              }
            />
          </div>

          <div
            className={`${styles.formGroup} ${styles.formGroupFull}`}
          >
            <label className={styles.label}>
              توضیحات
            </label>

            <textarea
              className={styles.textarea}
              value={
                data.hero?.description || ''
              }
              onChange={(e) =>
                update(
                  'hero.description',
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </SectionCard>

      {/* ===================================================
          STATS
      =================================================== */}

      <SectionCard
        icon={BarChart3}
        iconTone="emerald"
        title="آمار"
        description="اعداد و عناوین کلیدی که در بخش اصلی صفحه نمایش داده می‌شوند."
        count={stats.length}
        action={
          <button
            type="button"
            className={styles.addButton}
            onClick={addStat}
          >
            <Plus size={16} />
            افزودن آمار
          </button>
        }
      >
        <div className={styles.itemsContainer}>
          {stats.length === 0 && (
            <div className={styles.emptyState}>
              <BarChart3 size={28} />

              <p
                className={
                  styles.emptyStateTitle
                }
              >
                هنوز آماری اضافه نشده
              </p>

              <p
                className={
                  styles.emptyStateText
                }
              >
                روی دکمه «افزودن آمار» کلیک کنید.
              </p>
            </div>
          )}

          {stats.map((item, index) => (
            <div
              className={styles.itemCard}
              key={item.id || index}
            >
              <div
                className={
                  styles.itemCardHeader
                }
              >
                <span
                  className={
                    styles.itemNumber
                  }
                >
                  {index + 1}
                </span>

                <p
                  className={
                    styles.itemTitle
                  }
                >
                  آمار {index + 1}
                </p>

                <DeleteButton
                  onConfirm={() =>
                    removeStat(index)
                  }
                />
              </div>

              <div className={styles.twoColumns}>
                <input
                  className={styles.input}
                  value={
                    item.value ??
                    item.number ??
                    ''
                  }
                  onChange={(e) =>
                    update(
                      `stats.${index}.value`,
                      e.target.value
                    )
                  }
                  placeholder="مثال: ۳۵+"
                />

                <input
                  className={styles.input}
                  value={item.label || ''}
                  onChange={(e) =>
                    update(
                      `stats.${index}.label`,
                      e.target.value
                    )
                  }
                  placeholder="عنوان"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ===================================================
          VALUES
      =================================================== */}

      <SectionCard
        icon={Award}
        iconTone="amber"
        title="ارزش‌ها و استانداردها"
        description="توضیح کلی و لیست ارزش‌های اصلی برند."
        count={coreValues.length}
        action={
          <button
            type="button"
            className={styles.addButton}
            onClick={addCoreValue}
          >
            <Plus size={16} />
            افزودن ارزش
          </button>
        }
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              برچسب بالا
            </label>

            <input
              className={styles.input}
              value={data.values?.tag || ''}
              onChange={(e) =>
                update(
                  'values.tag',
                  e.target.value
                )
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              عنوان
            </label>

            <input
              className={styles.input}
              value={data.values?.title || ''}
              onChange={(e) =>
                update(
                  'values.title',
                  e.target.value
                )
              }
            />
          </div>

          <div
            className={`${styles.formGroup} ${styles.formGroupFull}`}
          >
            <label className={styles.label}>
              توضیحات
            </label>

            <textarea
              className={styles.textarea}
              value={
                data.values?.description || ''
              }
              onChange={(e) =>
                update(
                  'values.description',
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div
          className={styles.itemsContainer}
          style={{ marginTop: 20 }}
        >
          {coreValues.length === 0 && (
            <div className={styles.emptyState}>
              <Award size={28} />

              <p
                className={
                  styles.emptyStateTitle
                }
              >
                هنوز ارزشی ثبت نشده
              </p>

              <p
                className={
                  styles.emptyStateText
                }
              >
                ارزش‌های برند خود را اضافه کنید.
              </p>
            </div>
          )}

          {coreValues.map((item, index) => (
            <div
              className={styles.itemCard}
              key={item.id || index}
            >
              <div
                className={
                  styles.itemCardHeader
                }
              >
                <span
                  className={
                    styles.itemNumber
                  }
                >
                  {index + 1}
                </span>

                <p
                  className={
                    styles.itemTitle
                  }
                >
                  ارزش {index + 1}
                </p>

                <DeleteButton
                  onConfirm={() =>
                    removeCoreValue(index)
                  }
                />
              </div>

              <div
                className={styles.formGroup}
                style={{ marginBottom: 12 }}
              >
                <label className={styles.label}>
                  عنوان
                </label>

                <input
                  className={styles.input}
                  value={item.title || ''}
                  onChange={(e) =>
                    update(
                      `coreValues.${index}.title`,
                      e.target.value
                    )
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  توضیحات
                </label>

                <textarea
                  className={styles.textarea}
                  value={
                    item.desc ??
                    item.description ??
                    ''
                  }
                  onChange={(e) =>
                    update(
                      `coreValues.${index}.desc`,
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ===================================================
          TIMELINE
      =================================================== */}

      <SectionCard
        icon={History}
        iconTone="sky"
        title="تاریخچه برند"
        description="رویدادهای مهم در طول سال‌ها."
        count={timelineEvents.length}
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
        <div
          className={styles.formGrid}
          style={{ marginBottom: 20 }}
        >
          <div className={styles.formGroup}>
            <label className={styles.label}>
              برچسب بالا
            </label>

            <input
              className={styles.input}
              value={data.timeline?.tag || ''}
              onChange={(e) =>
                update(
                  'timeline.tag',
                  e.target.value
                )
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              عنوان
            </label>

            <input
              className={styles.input}
              value={
                data.timeline?.title || ''
              }
              onChange={(e) =>
                update(
                  'timeline.title',
                  e.target.value
                )
              }
            />
          </div>

          <div
            className={`${styles.formGroup} ${styles.formGroupFull}`}
          >
            <label className={styles.label}>
              توضیحات
            </label>

            <textarea
              className={styles.textarea}
              value={
                data.timeline?.description ||
                ''
              }
              onChange={(e) =>
                update(
                  'timeline.description',
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div className={styles.itemsContainer}>
          {timelineEvents.length === 0 && (
            <div className={styles.emptyState}>
              <History size={28} />

              <p
                className={
                  styles.emptyStateTitle
                }
              >
                هنوز رویدادی ثبت نشده
              </p>

              <p
                className={
                  styles.emptyStateText
                }
              >
                تاریخچه برند خود را مستند کنید.
              </p>
            </div>
          )}

          {timelineEvents.map((item, index) => (
            <div
              className={styles.timelineItem}
              key={item.id || index}
            >
              <div
                className={
                  styles.itemCardHeader
                }
              >
                <span
                  className={`${styles.itemNumber} ${styles.itemNumberSky}`}
                >
                  {index + 1}
                </span>

                <p
                  className={
                    styles.itemTitle
                  }
                >
                  رویداد {index + 1}
                  {item.year
                    ? ` — ${item.year}`
                    : ''}
                </p>

                <DeleteButton
                  onConfirm={() =>
                    removeTimelineEvent(index)
                  }
                />
              </div>

              <div className={styles.threeColumns}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    سال
                  </label>

                  <input
                    className={styles.input}
                    value={item.year || ''}
                    onChange={(e) =>
                      update(
                        `timelineEvents.${index}.year`,
                        e.target.value
                      )
                    }
                    placeholder="۱۳۷۰"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    سال میلادی
                  </label>

                  <input
                    className={styles.input}
                    value={item.yearEn || ''}
                    onChange={(e) =>
                      update(
                        `timelineEvents.${index}.yearEn`,
                        e.target.value
                      )
                    }
                    placeholder="1991"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    دوره
                  </label>

                  <input
                    className={styles.input}
                    value={item.era || ''}
                    onChange={(e) =>
                      update(
                        `timelineEvents.${index}.era`,
                        e.target.value
                      )
                    }
                    placeholder="70s / 80s / 90s / modern"
                  />
                </div>
              </div>

              <div
                className={styles.formGroup}
                style={{ marginTop: 12 }}
              >
                <label className={styles.label}>
                  عنوان
                </label>

                <input
                  className={styles.input}
                  value={item.title || ''}
                  onChange={(e) =>
                    update(
                      `timelineEvents.${index}.title`,
                      e.target.value
                    )
                  }
                />
              </div>

              <div
                className={styles.formGroup}
                style={{ marginTop: 12 }}
              >
                <label className={styles.label}>
                  زیرعنوان
                </label>

                <input
                  className={styles.input}
                  value={item.subtitle || ''}
                  onChange={(e) =>
                    update(
                      `timelineEvents.${index}.subtitle`,
                      e.target.value
                    )
                  }
                />
              </div>

              <div
                className={styles.formGroup}
                style={{ marginTop: 12 }}
              >
                <label className={styles.label}>
                  توضیحات
                </label>

                <textarea
                  className={styles.textarea}
                  value={
                    item.description || ''
                  }
                  onChange={(e) =>
                    update(
                      `timelineEvents.${index}.description`,
                      e.target.value
                    )
                  }
                />
              </div>

              <div
                className={styles.formGroup}
                style={{ marginTop: 12 }}
              >
                <label className={styles.label}>
                  برچسب
                </label>

                <input
                  className={styles.input}
                  value={item.badge || ''}
                  onChange={(e) =>
                    update(
                      `timelineEvents.${index}.badge`,
                      e.target.value
                    )
                  }
                />
              </div>

              {/* HIGHLIGHTS */}

              <div style={{ marginTop: 16 }}>
                <div
                  className={
                    styles.highlightsHeader
                  }
                >
                  <label className={styles.label}>
                    نکات برجسته
                  </label>

                  <button
                    type="button"
                    className={
                      styles.addButton
                    }
                    onClick={() =>
                      addHighlight(index)
                    }
                  >
                    <Plus size={14} />
                    افزودن
                  </button>
                </div>

                <div
                  className={
                    styles.highlightsContainer
                  }
                >
                  {(!item.highlights ||
                    item.highlights.length ===
                      0) && (
                    <p
                      className={
                        styles.emptyHint
                      }
                    >
                      هنوز نکته‌ای اضافه نشده
                      است.
                    </p>
                  )}

                  {item.highlights?.map(
                    (highlight, highlightIndex) => (
                      <div
                        className={
                          styles.highlightRow
                        }
                        key={highlightIndex}
                      >
                        <input
                          className={
                            styles.input
                          }
                          value={
                            highlight || ''
                          }
                          onChange={(e) =>
                            update(
                              `timelineEvents.${index}.highlights.${highlightIndex}`,
                              e.target.value
                            )
                          }
                          placeholder="مثال: ساخت ۱۰۰٪ دست‌ساز"
                        />

                        <DeleteButton
                          onConfirm={() =>
                            removeHighlight(
                              index,
                              highlightIndex
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ===================================================
          CRAFT
      =================================================== */}

      <SectionCard
        icon={Hammer}
        iconTone="rose"
        title="فرآیند ساخت"
        description="مراحل خلق اثر و توضیح هر مرحله."
        count={craftSteps.length}
        action={
          <button
            type="button"
            className={styles.addButton}
            onClick={addCraftStep}
          >
            <Plus size={16} />
            افزودن مرحله
          </button>
        }
      >
        <div
          className={styles.formGrid}
          style={{ marginBottom: 20 }}
        >
          <div className={styles.formGroup}>
            <label className={styles.label}>
              برچسب بالا
            </label>

            <input
              className={styles.input}
              value={data.craft?.tag || ''}
              onChange={(e) =>
                update(
                  'craft.tag',
                  e.target.value
                )
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              عنوان
            </label>

            <input
              className={styles.input}
              value={data.craft?.title || ''}
              onChange={(e) =>
                update(
                  'craft.title',
                  e.target.value
                )
              }
            />
          </div>

          <div
            className={`${styles.formGroup} ${styles.formGroupFull}`}
          >
            <label className={styles.label}>
              توضیحات
            </label>

            <textarea
              className={styles.textarea}
              value={
                data.craft?.description || ''
              }
              onChange={(e) =>
                update(
                  'craft.description',
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div className={styles.itemsContainer}>
          {craftSteps.length === 0 && (
            <div className={styles.emptyState}>
              <Hammer size={28} />

              <p
                className={
                  styles.emptyStateTitle
                }
              >
                هنوز مرحله‌ای اضافه نشده
              </p>

              <p
                className={
                  styles.emptyStateText
                }
              >
                مراحل ساخت را مستند کنید.
              </p>
            </div>
          )}

          {craftSteps.map((item, index) => (
            <div
              className={styles.stepCard}
              key={item.id || index}
            >
              <div className={styles.stepNumber}>
                {item.step ||
                  String(index + 1).padStart(
                    2,
                    '0'
                  )}
              </div>

              <div className={styles.stepContent}>
                <div
                  className={
                    styles.stepHeader
                  }
                >
                  <p
                    className={
                      styles.itemTitle
                    }
                  >
                    <Layers size={14} />
                    مرحله {index + 1}
                  </p>

                  <DeleteButton
                    onConfirm={() =>
                      removeCraftStep(index)
                    }
                  />
                </div>

                <div className={styles.twoColumns}>
                  <div
                    className={
                      styles.formGroup
                    }
                  >
                    <label
                      className={styles.label}
                    >
                      شماره مرحله
                    </label>

                    <input
                      className={
                        styles.input
                      }
                      value={item.step || ''}
                      onChange={(e) =>
                        update(
                          `craftSteps.${index}.step`,
                          e.target.value
                        )
                      }
                      placeholder="۰۱"
                    />
                  </div>

                  <div
                    className={
                      styles.formGroup
                    }
                  >
                    <label
                      className={styles.label}
                    >
                      عنوان
                    </label>

                    <input
                      className={
                        styles.input
                      }
                      value={item.title || ''}
                      onChange={(e) =>
                        update(
                          `craftSteps.${index}.title`,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div
                  className={styles.formGroup}
                  style={{ marginTop: 12 }}
                >
                  <label className={styles.label}>
                    توضیحات
                  </label>

                  <textarea
                    className={styles.textarea}
                    value={
                      item.desc ??
                      item.description ??
                      ''
                    }
                    onChange={(e) =>
                      update(
                        `craftSteps.${index}.desc`,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ===================================================
          QUOTE
      =================================================== */}

      <SectionCard
        icon={Quote}
        iconTone="violet"
        title="نقل قول بنیان‌گذار"
        description="جمله‌ای ماندگار از بنیان‌گذار برند."
      >
        <div className={styles.quoteBox}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              متن نقل قول
            </label>

            <textarea
              className={`${styles.textarea} ${styles.quoteTextarea}`}
              value={data.quote?.text || ''}
              onChange={(e) =>
                update(
                  'quote.text',
                  e.target.value
                )
              }
            />
          </div>

          <div
            className={
              styles.quoteAuthorGrid
            }
          >
            <div className={styles.formGroup}>
              <label className={styles.label}>
                نام
              </label>

              <input
                className={styles.input}
                value={
                  data.quote?.author || ''
                }
                onChange={(e) =>
                  update(
                    'quote.author',
                    e.target.value
                  )
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                سمت
              </label>

              <input
                className={styles.input}
                value={
                  data.quote?.role || ''
                }
                onChange={(e) =>
                  update(
                    'quote.role',
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ===================================================
          CTA
      =================================================== */}

      <SectionCard
        icon={Megaphone}
        iconTone="cyan"
        title="بخش پایانی صفحه"
        description="متن و دکمه‌های فراخوان به اقدام."
      >
        <div className={styles.ctaBox}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              عنوان
            </label>

            <input
              className={styles.input}
              value={data.cta?.title || ''}
              onChange={(e) =>
                update(
                  'cta.title',
                  e.target.value
                )
              }
            />
          </div>

          <div
            className={styles.formGroup}
            style={{ marginTop: 12 }}
          >
            <label className={styles.label}>
              توضیحات
            </label>

            <textarea
              className={styles.textarea}
              value={
                data.cta?.description || ''
              }
              onChange={(e) =>
                update(
                  'cta.description',
                  e.target.value
                )
              }
            />
          </div>

          <div className={styles.ctaButtons}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                متن دکمه اصلی
              </label>

              <input
                className={styles.input}
                value={
                  data.cta?.primaryText || ''
                }
                onChange={(e) =>
                  update(
                    'cta.primaryText',
                    e.target.value
                  )
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                متن دکمه دوم
              </label>

              <input
                className={styles.input}
                value={
                  data.cta?.secondaryText || ''
                }
                onChange={(e) =>
                  update(
                    'cta.secondaryText',
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ===================================================
          SAVE BAR
      =================================================== */}

      <div className={styles.saveBar}>
        <div className={styles.saveInfo}>
          {saved ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}

          {saved
            ? 'همه تغییرات ذخیره شده است.'
            : 'تغییرات ذخیره‌نشده دارید.'}
        </div>

        <div className={styles.saveActions}>
          <button
            type="button"
            onClick={save}
            className={`${styles.primaryButton} ${
              saved
                ? styles.primaryButtonSaved
                : ''
            }`}
          >
            {saved ? (
              <CheckCircle2 size={18} />
            ) : (
              <Save size={18} />
            )}

            {saved
              ? 'ذخیره شد'
              : 'ذخیره تمام تغییرات'}
          </button>
        </div>
      </div>

      {/* ===================================================
          TOAST
      =================================================== */}

      <Toast
        toast={toast}
        onClose={handleToastClose}
      />
    </div>
  );
}

