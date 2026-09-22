import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Phone,
  MapPin,
  MessageCircle,
  FileText,
  CalendarDays,
  HelpCircle,
  Share2,
  Sparkles,
  Image as ImageIcon,
  Store,
  Layers,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
} from 'lucide-react';

import {
  useSiteSettings,
  DEFAULT_CONTACT_PAGE,
} from '../../contexts/SiteSettingsContext';

import styles from './AdminContactPage.module.css';

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

/* ============ Field ============ */
function Field({ label, value, onChange, placeholder = '' }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        className={styles.input}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ============ TextArea ============ */
function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={styles.textarea}
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function AdminContactPage() {
  const { settings, updateSettings } = useSiteSettings();

  const [data, setData] = useState(
    structuredClone(settings?.contactPage || DEFAULT_CONTACT_PAGE)
  );

  const [contactInfo, setContactInfo] = useState({
    contactPhone: settings?.contactPhone || '',
    contactAddress: settings?.contactAddress || '',
    whatsapp: settings?.whatsapp || '',
    instagram: settings?.instagram || '',
  });

  const [saved, setSaved] = useState(true);
  const [toast, setToast] = useState(null);

  // sync if settings loaded later
  useEffect(() => {
    if (settings?.contactPage && !data) {
      setData(settings.contactPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // mark dirty on any change
  useEffect(() => {
    setSaved(false);
  }, [data, contactInfo]);

  /* =========================================================
     GENERIC UPDATE
  ========================================================= */

  const update = (path, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');

      let current = next;

      for (let i = 0; i < keys.length - 1; i++) {
        if (
          current[keys[i]] === undefined ||
          current[keys[i]] === null
        ) {
          current[keys[i]] = {};
        }

        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return next;
    });
  };

  /* =========================================================
     ARRAY HELPERS
  ========================================================= */

  const addItem = (path, item) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');

      let current = next;

      for (let i = 0; i < keys.length - 1; i++) {
        if (
          current[keys[i]] === undefined ||
          current[keys[i]] === null
        ) {
          current[keys[i]] = {};
        }

        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      current[lastKey] = [
        ...(current[lastKey] || []),
        structuredClone(item),
      ];

      return next;
    });
  };

  const removeItem = (path, index) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');

      let current = next;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (!Array.isArray(current[lastKey])) {
        return next;
      }

      current[lastKey] = current[lastKey].filter((_, i) => i !== index);

      return next;
    });
  };

  const updateArrayItem = (path, index, field, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');

      let current = next;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (
        !Array.isArray(current[lastKey]) ||
        !current[lastKey][index]
      ) {
        return next;
      }

      current[lastKey][index][field] = value;

      return next;
    });
  };

  const updateArrayPrimitive = (path, index, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');

      let current = next;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (!Array.isArray(current[lastKey])) {
        return next;
      }

      current[lastKey][index] = value;

      return next;
    });
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const save = () => {
    updateSettings({
      contactPhone: contactInfo.contactPhone,
      contactAddress: contactInfo.contactAddress,
      whatsapp: contactInfo.whatsapp,
      instagram: contactInfo.instagram,

      contactPage: data,
    });

    setSaved(true);
    setToast({
      type: 'success',
      message: 'اطلاعات تماس با ما با موفقیت ذخیره شد.',
    });
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetPage = () => {
    if (
      !window.confirm(
        'آیا مطمئن هستید که اطلاعات تماس به مقادیر پیش‌فرض برگردد؟'
      )
    ) {
      return;
    }

    setData(structuredClone(DEFAULT_CONTACT_PAGE));

    setContactInfo({
      contactPhone: '',
      contactAddress: '',
      whatsapp: '',
      instagram: '',
    });

    setToast({
      type: 'success',
      message: 'اطلاعات به مقادیر پیش‌فرض بازگشت.',
    });
  };

  const handleToastClose = useCallback(() => setToast(null), []);

  /* =========================================================
     PROGRESS
  ========================================================= */

  const progress = useMemo(() => {
    let filled = 0;
    let total = 0;
    const check = (v) => {
      total += 1;
      if (v && String(v).trim()) filled += 1;
    };
    check(data.hero?.badge);
    check(data.hero?.title);
    check(data.hero?.subtitle);
    check(data.gallery?.title);
    check(data.quickCards?.address?.title);
    check(data.quickCards?.hours?.title);
    check(data.quickCards?.phone?.title);
    check(data.quickCards?.whatsapp?.title);
    check(data.mainForm?.title);
    check(data.vip?.title);
    check(data.location?.title);
    check(data.social?.title);
    check(data.faq?.title);
    return total ? Math.round((filled / total) * 100) : 0;
  }, [data]);

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
          <h1 className={styles.headerTitle}>مدیریت تماس با ما</h1>
          <p className={styles.headerDescription}>
            اطلاعات صفحه تماس، فرم ارتباط، مشاوره VIP، موقعیت گالری،
            شبکه‌های اجتماعی و سؤالات متداول را مدیریت کنید. تغییرات
            به‌صورت زنده در پیش‌نمایش اعمال می‌شوند.
          </p>

          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
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
            className={styles.resetButton}
            onClick={resetPage}
          >
            <RotateCcw size={17} />
            بازنشانی
          </button>

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

      {/* =====================================================
          GENERAL CONTACT INFO
      ===================================================== */}

      <SectionCard
        icon={Phone}
        iconTone="indigo"
        title="اطلاعات اصلی تماس"
        description="اطلاعاتی که در بخش‌های مختلف سایت برای تماس استفاده می‌شوند."
      >
        <div className={styles.formGrid}>
          <Field
            label="شماره تماس اصلی"
            value={contactInfo.contactPhone}
            onChange={(value) =>
              setContactInfo({ ...contactInfo, contactPhone: value })
            }
            placeholder="مثلاً 02122003344"
          />

          <Field
            label="شماره واتساپ"
            value={contactInfo.whatsapp}
            onChange={(value) =>
              setContactInfo({ ...contactInfo, whatsapp: value })
            }
            placeholder="مثلاً 09123456789"
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="آدرس اصلی گالری"
              value={contactInfo.contactAddress}
              onChange={(value) =>
                setContactInfo({ ...contactInfo, contactAddress: value })
              }
              rows={3}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <Field
              label="لینک اینستاگرام"
              value={contactInfo.instagram}
              onChange={(value) =>
                setContactInfo({ ...contactInfo, instagram: value })
              }
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </SectionCard>

      {/* =====================================================
          HERO
      ===================================================== */}

      <SectionCard
        icon={FileText}
        iconTone="violet"
        title="بخش Hero"
        description="عنوان و دکمه‌های بالای صفحه تماس با ما"
      >
        <div className={styles.formGrid}>
          <Field
            label="Badge"
            value={data.hero.badge}
            onChange={(value) => update('hero.badge', value)}
          />

          <Field
            label="عنوان"
            value={data.hero.title}
            onChange={(value) => update('hero.title', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="توضیحات"
              value={data.hero.subtitle}
              onChange={(value) => update('hero.subtitle', value)}
              rows={4}
            />
          </div>

          <Field
            label="متن دکمه رزرو VIP"
            value={data.hero.primaryButtonText}
            onChange={(value) => update('hero.primaryButtonText', value)}
          />

          <Field
            label="متن دکمه موقعیت"
            value={data.hero.secondaryButtonText}
            onChange={(value) => update('hero.secondaryButtonText', value)}
          />

          <Field
            label="متن دکمه تماس"
            value={data.hero.phoneButtonText}
            onChange={(value) => update('hero.phoneButtonText', value)}
          />
        </div>
      </SectionCard>

      {/* =====================================================
          GALLERY
      ===================================================== */}

      <SectionCard
        icon={ImageIcon}
        iconTone="amber"
        title="معرفی گالری"
        description="متن بخش معرفی شو روم"
      >
        <div className={styles.formGrid}>
          <Field
            label="Badge"
            value={data.gallery.badge}
            onChange={(value) => update('gallery.badge', value)}
          />

          <Field
            label="عنوان"
            value={data.gallery.title}
            onChange={(value) => update('gallery.title', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="توضیحات"
              value={data.gallery.description}
              onChange={(value) => update('gallery.description', value)}
              rows={3}
            />
          </div>
        </div>
      </SectionCard>

      {/* =====================================================
          QUICK CARDS
      ===================================================== */}

      <SectionCard
        icon={Layers}
        iconTone="sky"
        title="کارت‌های اطلاعات تماس"
        description="چهار کارت اطلاعاتی بالای فرم تماس"
      >
        {/* ================= ADDRESS ================= */}

        <div className={styles.cardEditor}>
          <div className={styles.cardEditorHeader}>
            <div className={styles.cardEditorHeaderIcon}>
              <MapPin size={16} />
            </div>
            <h3>آدرس گالری</h3>
          </div>

          <div className={styles.formGrid}>
            <Field
              label="برچسب کارت"
              value={data.quickCards.address.tagText}
              onChange={(value) =>
                update('quickCards.address.tagText', value)
              }
            />

            <Field
              label="عنوان"
              value={data.quickCards.address.title}
              onChange={(value) =>
                update('quickCards.address.title', value)
              }
            />

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <TextArea
                label="آدرس"
                value={data.quickCards.address.detail}
                onChange={(value) =>
                  update('quickCards.address.detail', value)
                }
                rows={3}
              />
            </div>

            <Field
              label="متن زیر کارت"
              value={data.quickCards.address.subText}
              onChange={(value) =>
                update('quickCards.address.subText', value)
              }
            />

            <Field
              label="متن دکمه مسیریابی"
              value={data.quickCards.address.actionText}
              onChange={(value) =>
                update('quickCards.address.actionText', value)
              }
            />
          </div>
        </div>

        {/* ================= HOURS ================= */}

        <div className={styles.cardEditor}>
          <div className={styles.cardEditorHeader}>
            <div className={styles.cardEditorHeaderIcon}>
              <CalendarDays size={16} />
            </div>
            <h3>ساعات کاری</h3>
          </div>

          <div className={styles.formGrid}>
            <Field
              label="برچسب وضعیت"
              value={data.quickCards.hours.liveText}
              onChange={(value) =>
                update('quickCards.hours.liveText', value)
              }
            />

            <Field
              label="عنوان"
              value={data.quickCards.hours.title}
              onChange={(value) =>
                update('quickCards.hours.title', value)
              }
            />

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <TextArea
                label="توضیحات"
                value={data.quickCards.hours.description}
                onChange={(value) =>
                  update('quickCards.hours.description', value)
                }
                rows={3}
              />
            </div>
          </div>

          <div className={styles.subSection}>
            <h3>ردیف‌های ساعات کاری</h3>

            <div className={styles.itemsContainer}>
              {data.quickCards.hours.rows.length === 0 && (
                <div className={styles.emptyState}>
                  <CalendarDays size={28} />
                  <p className={styles.emptyStateTitle}>
                    هنوز ساعت کاری اضافه نشده
                  </p>
                  <p className={styles.emptyStateText}>
                    روی دکمه «افزودن ساعت کاری» کلیک کنید.
                  </p>
                </div>
              )}

              {data.quickCards.hours.rows.map((row, index) => (
                <div className={styles.itemCard} key={index}>
                  <div className={styles.itemCardHeader}>
                    <span className={styles.itemNumber}>{index + 1}</span>
                    <p className={styles.itemTitle}>
                      ساعت کاری {index + 1}
                    </p>
                    <DeleteButton
                      onConfirm={() =>
                        removeItem('quickCards.hours.rows', index)
                      }
                    />
                  </div>

                  <div className={styles.twoColumns}>
                    <Field
                      label="روز"
                      value={row.label}
                      onChange={(value) =>
                        updateArrayItem(
                          'quickCards.hours.rows',
                          index,
                          'label',
                          value
                        )
                      }
                    />

                    <Field
                      label="ساعت"
                      value={row.value}
                      onChange={(value) =>
                        updateArrayItem(
                          'quickCards.hours.rows',
                          index,
                          'value',
                          value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                addItem('quickCards.hours.rows', {
                  label: '',
                  value: '',
                })
              }
            >
              <Plus size={16} />
              افزودن ساعت کاری
            </button>
          </div>

          <div className={styles.subSection}>
            <TextArea
              label="متن یادداشت پایین کارت"
              value={data.quickCards.hours.noteText}
              onChange={(value) =>
                update('quickCards.hours.noteText', value)
              }
              rows={2}
            />
          </div>
        </div>

        {/* ================= PHONE ================= */}

        <div className={styles.cardEditor}>
          <div className={styles.cardEditorHeader}>
            <div className={styles.cardEditorHeaderIcon}>
              <Phone size={16} />
            </div>
            <h3>تماس تلفنی</h3>
          </div>

          <div className={styles.formGrid}>
            <Field
              label="برچسب پاسخگویی"
              value={data.quickCards.phone.responseText}
              onChange={(value) =>
                update('quickCards.phone.responseText', value)
              }
            />

            <Field
              label="عنوان"
              value={data.quickCards.phone.title}
              onChange={(value) =>
                update('quickCards.phone.title', value)
              }
            />

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <TextArea
                label="توضیحات"
                value={data.quickCards.phone.description}
                onChange={(value) =>
                  update('quickCards.phone.description', value)
                }
                rows={3}
              />
            </div>

            <Field
              label="برچسب تلفن دفتر"
              value={data.quickCards.phone.officeLabel}
              onChange={(value) =>
                update('quickCards.phone.officeLabel', value)
              }
            />

            <Field
              label="برچسب مشاوره VIP"
              value={data.quickCards.phone.vipLabel}
              onChange={(value) =>
                update('quickCards.phone.vipLabel', value)
              }
            />

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <Field
                label="متن پایین کارت"
                value={data.quickCards.phone.trustText}
                onChange={(value) =>
                  update('quickCards.phone.trustText', value)
                }
              />
            </div>
          </div>
        </div>

        {/* ================= WHATSAPP ================= */}

        <div className={styles.cardEditor}>
          <div className={styles.cardEditorHeader}>
            <div className={styles.cardEditorHeaderIcon}>
              <MessageCircle size={16} />
            </div>
            <h3>واتساپ</h3>
          </div>

          <div className={styles.formGrid}>
            <Field
              label="برچسب وضعیت"
              value={data.quickCards.whatsapp.liveText}
              onChange={(value) =>
                update('quickCards.whatsapp.liveText', value)
              }
            />

            <Field
              label="عنوان"
              value={data.quickCards.whatsapp.title}
              onChange={(value) =>
                update('quickCards.whatsapp.title', value)
              }
            />

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <TextArea
                label="توضیحات"
                value={data.quickCards.whatsapp.description}
                onChange={(value) =>
                  update('quickCards.whatsapp.description', value)
                }
                rows={3}
              />
            </div>

            <Field
              label="متن پیش‌نمایش پیام"
              value={data.quickCards.whatsapp.previewText}
              onChange={(value) =>
                update('quickCards.whatsapp.previewText', value)
              }
            />

            <Field
              label="متن دکمه"
              value={data.quickCards.whatsapp.buttonText}
              onChange={(value) =>
                update('quickCards.whatsapp.buttonText', value)
              }
            />
          </div>
        </div>
      </SectionCard>

      {/* =====================================================
          MAIN FORM
      ===================================================== */}

      <SectionCard
        icon={Mail}
        iconTone="rose"
        title="فرم تماس"
        description="متن‌ها، فیلدها، موضوعات و روش‌های ارتباط"
      >
        <div className={styles.formGrid}>
          <Field
            label="Badge"
            value={data.mainForm.badge}
            onChange={(value) => update('mainForm.badge', value)}
          />

          <Field
            label="عنوان فرم"
            value={data.mainForm.title}
            onChange={(value) => update('mainForm.title', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="توضیحات فرم"
              value={data.mainForm.subtitle}
              onChange={(value) => update('mainForm.subtitle', value)}
              rows={3}
            />
          </div>
        </div>

        {/* ================= FORM FIELDS ================= */}

        <div className={styles.subSection}>
          <h3>فیلدهای فرم</h3>

          <div className={styles.formGrid}>
            {Object.entries(data.mainForm.fields).map(([key, value]) => (
              <Field
                key={key}
                label={key}
                value={value}
                onChange={(newValue) =>
                  update(`mainForm.fields.${key}`, newValue)
                }
              />
            ))}
          </div>
        </div>

        {/* ================= SUBJECTS ================= */}

        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <h3>موضوعات درخواست</h3>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                addItem('mainForm.subjects', {
                  value: '',
                  label: '',
                })
              }
            >
              <Plus size={16} />
              افزودن موضوع
            </button>
          </div>

          <div className={styles.itemsContainer}>
            {data.mainForm.subjects.length === 0 && (
              <div className={styles.emptyState}>
                <MessageCircle size={28} />
                <p className={styles.emptyStateTitle}>هنوز موضوعی اضافه نشده</p>
                <p className={styles.emptyStateText}>
                  روی دکمه «افزودن موضوع» کلیک کنید.
                </p>
              </div>
            )}

            {data.mainForm.subjects.map((item, index) => (
              <div className={styles.itemCard} key={index}>
                <div className={styles.itemCardHeader}>
                  <span className={styles.itemNumber}>{index + 1}</span>
                  <p className={styles.itemTitle}>موضوع {index + 1}</p>
                  <DeleteButton
                    onConfirm={() =>
                      removeItem('mainForm.subjects', index)
                    }
                  />
                </div>

                <div className={styles.twoColumns}>
                  <Field
                    label="Value"
                    value={item.value}
                    onChange={(value) =>
                      updateArrayItem(
                        'mainForm.subjects',
                        index,
                        'value',
                        value
                      )
                    }
                  />

                  <Field
                    label="عنوان"
                    value={item.label}
                    onChange={(value) =>
                      updateArrayItem(
                        'mainForm.subjects',
                        index,
                        'label',
                        value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CHANNELS ================= */}

        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <h3>روش‌های ارتباط</h3>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                addItem('mainForm.channels', {
                  value: '',
                  label: '',
                })
              }
            >
              <Plus size={16} />
              افزودن روش ارتباط
            </button>
          </div>

          <div className={styles.itemsContainer}>
            {data.mainForm.channels.length === 0 && (
              <div className={styles.emptyState}>
                <Phone size={28} />
                <p className={styles.emptyStateTitle}>
                  هنوز روش ارتباطی اضافه نشده
                </p>
                <p className={styles.emptyStateText}>
                  روی دکمه «افزودن روش ارتباط» کلیک کنید.
                </p>
              </div>
            )}

            {data.mainForm.channels.map((item, index) => (
              <div className={styles.itemCard} key={index}>
                <div className={styles.itemCardHeader}>
                  <span className={styles.itemNumber}>{index + 1}</span>
                  <p className={styles.itemTitle}>روش {index + 1}</p>
                  <DeleteButton
                    onConfirm={() =>
                      removeItem('mainForm.channels', index)
                    }
                  />
                </div>

                <div className={styles.twoColumns}>
                  <Field
                    label="Value"
                    value={item.value}
                    onChange={(value) =>
                      updateArrayItem(
                        'mainForm.channels',
                        index,
                        'value',
                        value
                      )
                    }
                  />

                  <Field
                    label="عنوان"
                    value={item.label}
                    onChange={(value) =>
                      updateArrayItem(
                        'mainForm.channels',
                        index,
                        'label',
                        value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FORM MESSAGES ================= */}

        <div className={styles.subSection}>
          <h3>پیام‌های فرم</h3>

          <div className={styles.formGrid}>
            <Field
              label="عنوان پیام موفقیت"
              value={data.mainForm.messages.successTitle}
              onChange={(value) =>
                update('mainForm.messages.successTitle', value)
              }
            />

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <TextArea
                label="توضیحات پیام موفقیت"
                value={data.mainForm.messages.successDescription}
                onChange={(value) =>
                  update('mainForm.messages.successDescription', value)
                }
                rows={4}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <TextArea
                label="پیام خطای تکمیل فرم"
                value={data.mainForm.messages.validationError}
                onChange={(value) =>
                  update('mainForm.messages.validationError', value)
                }
                rows={3}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* =====================================================
          VIP
      ===================================================== */}

      <SectionCard
        icon={CalendarDays}
        iconTone="violet"
        title="رزرو وقت VIP"
        description="مدیریت محتوای بخش مشاوره اختصاصی"
      >
        <div className={styles.formGrid}>
          <Field
            label="Badge"
            value={data.vip.badge}
            onChange={(value) => update('vip.badge', value)}
          />

          <Field
            label="عنوان"
            value={data.vip.title}
            onChange={(value) => update('vip.title', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="توضیحات"
              value={data.vip.subtitle}
              onChange={(value) => update('vip.subtitle', value)}
              rows={3}
            />
          </div>

          <Field
            label="تاریخ پیش‌فرض"
            value={data.vip.defaultDate}
            onChange={(value) => update('vip.defaultDate', value)}
          />
        </div>

        {/* ================= VIP FIELDS ================= */}

        <div className={styles.subSection}>
          <h3>فیلدهای VIP</h3>

          <div className={styles.formGrid}>
            {Object.entries(data.vip.fields).map(([key, value]) => (
              <Field
                key={key}
                label={key}
                value={value}
                onChange={(newValue) =>
                  update(`vip.fields.${key}`, newValue)
                }
              />
            ))}
          </div>
        </div>

        {/* ================= TIME SLOTS ================= */}

        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <h3>سانس‌های زمانی</h3>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                addItem('vip.timeSlots', { value: '', label: '' })
              }
            >
              <Plus size={16} />
              افزودن سانس
            </button>
          </div>

          <div className={styles.itemsContainer}>
            {data.vip.timeSlots.map((item, index) => (
              <div className={styles.itemCard} key={index}>
                <div className={styles.itemCardHeader}>
                  <span className={`${styles.itemNumber} ${styles.itemNumberViolet}`}>
                    {index + 1}
                  </span>
                  <p className={styles.itemTitle}>سانس {index + 1}</p>
                  <DeleteButton
                    onConfirm={() => removeItem('vip.timeSlots', index)}
                  />
                </div>

                <div className={styles.twoColumns}>
                  <Field
                    label="Value"
                    value={item.value}
                    onChange={(value) =>
                      updateArrayItem(
                        'vip.timeSlots',
                        index,
                        'value',
                        value
                      )
                    }
                  />

                  <Field
                    label="عنوان"
                    value={item.label}
                    onChange={(value) =>
                      updateArrayItem(
                        'vip.timeSlots',
                        index,
                        'label',
                        value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= INTERESTS ================= */}

        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <h3>دسته‌بندی‌های مورد علاقه</h3>
            <button
              type="button"
              className={styles.addButton}
              onClick={() =>
                addItem('vip.interests', { value: '', label: '' })
              }
            >
              <Plus size={16} />
              افزودن دسته‌بندی
            </button>
          </div>

          <div className={styles.itemsContainer}>
            {data.vip.interests.map((item, index) => (
              <div className={styles.itemCard} key={index}>
                <div className={styles.itemCardHeader}>
                  <span className={`${styles.itemNumber} ${styles.itemNumberViolet}`}>
                    {index + 1}
                  </span>
                  <p className={styles.itemTitle}>دسته {index + 1}</p>
                  <DeleteButton
                    onConfirm={() => removeItem('vip.interests', index)}
                  />
                </div>

                <div className={styles.twoColumns}>
                  <Field
                    label="Value"
                    value={item.value}
                    onChange={(value) =>
                      updateArrayItem(
                        'vip.interests',
                        index,
                        'value',
                        value
                      )
                    }
                  />

                  <Field
                    label="عنوان"
                    value={item.label}
                    onChange={(value) =>
                      updateArrayItem(
                        'vip.interests',
                        index,
                        'label',
                        value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= VIP SUCCESS ================= */}

        <div className={styles.subSection}>
          <h3>پیام ثبت موفق وقت VIP</h3>

          <div className={styles.formGrid}>
            <Field
              label="عنوان پیام"
              value={data.vip.successMessage.title}
              onChange={(value) =>
                update('vip.successMessage.title', value)
              }
            />

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <TextArea
                label="توضیحات پیام"
                value={data.vip.successMessage.description}
                onChange={(value) =>
                  update('vip.successMessage.description', value)
                }
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* ================= TRUST ================= */}

        <div className={styles.subSection}>
          <TextArea
            label="متن اعتماد"
            value={data.vip.trustNote}
            onChange={(value) => update('vip.trustNote', value)}
            rows={3}
          />
        </div>
      </SectionCard>

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <SectionCard
        icon={MapPin}
        iconTone="cyan"
        title="موقعیت گالری"
        description="متن‌ها و امکانات بخش موقعیت"
      >
        <div className={styles.formGrid}>
          <Field
            label="برچسب بخش"
            value={data.location.tag}
            onChange={(value) => update('location.tag', value)}
          />

          <Field
            label="عنوان"
            value={data.location.title}
            onChange={(value) => update('location.title', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="توضیحات"
              value={data.location.description}
              onChange={(value) =>
                update('location.description', value)
              }
              rows={4}
            />
          </div>

          <Field
            label="برچسب نمایشگاه"
            value={data.location.showroomBadge}
            onChange={(value) =>
              update('location.showroomBadge', value)
            }
          />

          <Field
            label="عنوان روی نقشه"
            value={data.location.mapTitle}
            onChange={(value) => update('location.mapTitle', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="آدرس روی نقشه"
              value={data.location.mapAddress}
              onChange={(value) =>
                update('location.mapAddress', value)
              }
              rows={3}
            />
          </div>

          <Field
            label="متن دکمه نقشه"
            value={data.location.mapButtonText}
            onChange={(value) =>
              update('location.mapButtonText', value)
            }
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <Field
              label="Google Maps URL"
              value={data.location.mapsUrl}
              onChange={(value) => update('location.mapsUrl', value)}
            />
          </div>
        </div>

        {/* ================= ACCESS FEATURES ================= */}

        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <h3>امکانات دسترسی</h3>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addItem('location.accessFeatures', '')}
            >
              <Plus size={16} />
              افزودن ویژگی
            </button>
          </div>

          <div className={styles.itemsContainer}>
            {data.location.accessFeatures.map((item, index) => (
              <div className={styles.highlightRow} key={index}>
                <input
                  className={styles.input}
                  value={item}
                  onChange={(e) =>
                    updateArrayPrimitive(
                      'location.accessFeatures',
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`ویژگی ${index + 1}`}
                />
                <DeleteButton
                  onConfirm={() =>
                    removeItem('location.accessFeatures', index)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* =====================================================
          SOCIAL
      ===================================================== */}

      <SectionCard
        icon={Share2}
        iconTone="emerald"
        title="شبکه‌های اجتماعی"
        description="اطلاعات اینستاگرام و واتساپ"
      >
        <div className={styles.formGrid}>
          <Field
            label="Badge"
            value={data.social.badge}
            onChange={(value) => update('social.badge', value)}
          />

          <Field
            label="عنوان"
            value={data.social.title}
            onChange={(value) => update('social.title', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="توضیحات"
              value={data.social.description}
              onChange={(value) => update('social.description', value)}
              rows={3}
            />
          </div>

          <Field
            label="متن اینستاگرام"
            value={data.social.instagramLabel}
            onChange={(value) =>
              update('social.instagramLabel', value)
            }
          />

          <Field
            label="لینک اینستاگرام"
            value={data.social.instagramUrl}
            onChange={(value) => update('social.instagramUrl', value)}
          />

          <Field
            label="متن واتساپ"
            value={data.social.whatsappLabel}
            onChange={(value) =>
              update('social.whatsappLabel', value)
            }
          />

          <Field
            label="لینک واتساپ"
            value={data.social.whatsappUrl}
            onChange={(value) => update('social.whatsappUrl', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <Field
              label="متن پاسخگویی آنلاین"
              value={data.social.liveBadge}
              onChange={(value) => update('social.liveBadge', value)}
            />
          </div>
        </div>

        {/* ================= BENEFITS ================= */}

        <div className={styles.subSection}>
          <div className={styles.subSectionHeader}>
            <h3>مزایای عضویت</h3>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addItem('social.benefits', '')}
            >
              <Plus size={16} />
              افزودن مزیت
            </button>
          </div>

          <div className={styles.itemsContainer}>
            {data.social.benefits.map((item, index) => (
              <div className={styles.highlightRow} key={index}>
                <input
                  className={styles.input}
                  value={item}
                  onChange={(e) =>
                    updateArrayPrimitive(
                      'social.benefits',
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`مزیت ${index + 1}`}
                />
                <DeleteButton
                  onConfirm={() =>
                    removeItem('social.benefits', index)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <SectionCard
        icon={HelpCircle}
        iconTone="amber"
        title="سؤالات متداول"
        description="مدیریت سوالات و پاسخ‌های صفحه تماس"
        count={data.faq.items.length}
        action={
          <button
            type="button"
            className={styles.addButton}
            onClick={() =>
              addItem('faq.items', { question: '', answer: '' })
            }
          >
            <Plus size={16} />
            افزودن سؤال
          </button>
        }
      >
        <div className={styles.formGrid}>
          <Field
            label="Tag"
            value={data.faq.tag}
            onChange={(value) => update('faq.tag', value)}
          />

          <Field
            label="عنوان"
            value={data.faq.title}
            onChange={(value) => update('faq.title', value)}
          />

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <TextArea
              label="توضیحات"
              value={data.faq.description}
              onChange={(value) => update('faq.description', value)}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.subSection}>
          <div className={styles.itemsContainer}>
            {data.faq.items.length === 0 && (
              <div className={styles.emptyState}>
                <HelpCircle size={28} />
                <p className={styles.emptyStateTitle}>
                  هنوز سؤالی اضافه نشده
                </p>
                <p className={styles.emptyStateText}>
                  روی دکمه «افزودن سؤال» کلیک کنید.
                </p>
              </div>
            )}

            {data.faq.items.map((item, index) => (
              <div className={styles.timelineItem} key={index}>
                <div className={styles.itemCardHeader}>
                  <span className={styles.itemNumber}>{index + 1}</span>
                  <p className={styles.itemTitle}>سؤال {index + 1}</p>
                  <DeleteButton
                    onConfirm={() => removeItem('faq.items', index)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>سؤال</label>
                  <textarea
                    className={styles.textarea}
                    rows={2}
                    value={item.question}
                    onChange={(e) =>
                      updateArrayItem(
                        'faq.items',
                        index,
                        'question',
                        e.target.value
                      )
                    }
                  />
                </div>

                <div
                  className={styles.formGroup}
                  style={{ marginTop: 12 }}
                >
                  <label className={styles.label}>پاسخ</label>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    value={item.answer}
                    onChange={(e) =>
                      updateArrayItem(
                        'faq.items',
                        index,
                        'answer',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* =====================================================
          SAVE BAR
      ===================================================== */}

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