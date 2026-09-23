// src/components/admin/ProductFormModal.jsx
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Upload,
  Save,
  ImageOff,
  Trash2,
  Loader2,
  Star,
  Eye,
  Sparkles,
  Package,
  Layers,
  Award,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import {
  CATEGORY_LABELS,
  SECTION_LABELS,
  METAL_TYPES,
  GEM_CATEGORIES,
} from '../../data/catalog';
import { calcDiscountPercent, formatToman, parsePrice, toEnglishDigits } from '../../utils/money';
import styles from './ProductFormModal.module.css';

const num = (value) => Number(toEnglishDigits(value).replace(/[^0-9.-]/g, '')) || 0;

const toForm = (p) => ({
  section: p?.section || 'collection',
  name: p?.name || '',
  englishName: p?.englishName || '',
  category: p?.category || 'ring',
  categoryLabel: p?.categoryLabel || '',
  price: p?.price ? String(p.price) : '',
  oldPrice: p?.oldPrice ? String(p.oldPrice) : '',
  discountPercent: p?.discountPercent ? String(p.discountPercent) : '',
  stock: p?.stock !== undefined ? String(p.stock) : '1',
  tag: p?.tag || '',
  image: p?.image || '',
  description: p?.description || '',
  details: p?.details || '',
  active: p?.active !== false,
  featured: Boolean(p?.featured),
  discounted: Boolean(p?.discounted),
  customImage: Boolean(p?.customImage),
  gemType: p?.extra?.gemType || '',
  weightGold: p?.extra?.weightGold || '',
  purity: p?.extra?.purity || '',
  certCode: p?.extra?.certCode || '',
  carat: p?.extra?.carat || '',
  gemCategory: p?.extra?.gemCategory || GEM_CATEGORIES[0],
  metal: p?.extra?.metal || '',
  metalType: p?.extra?.metalType || 'yellowGold',
  diamondInfo: p?.extra?.diamondInfo || '',
  totalStock: p?.extra?.totalStock ? String(p.extra.totalStock) : '',
  badges: (p?.extra?.badges || []).join('، '),
  features: (p?.extra?.features || []).join('\n'),
});

/** Downscale an uploaded picture so localStorage doesn't blow up. */
const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('خواندن فایل تصویر ممکن نشد.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('این فایل یک تصویر معتبر نیست.'));
      img.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/webp', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export default function ProductFormModal({ product, onClose }) {
  const { addProduct, updateProduct } = useProducts();
  const isEdit = Boolean(product);
  const [form, setForm] = useState(() => toForm(product));
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const set = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const autoPercent = useMemo(
    () => calcDiscountPercent(form.oldPrice, form.price),
    [form.oldPrice, form.price]
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, image: dataUrl, customImage: true }));
    } catch (err) {
      setError(err.message || 'بارگذاری تصویر با خطا مواجه شد.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('نام محصول را وارد کنید.');
      return;
    }
    if (parsePrice(form.price) <= 0) {
      setError('قیمت محصول باید بزرگ‌تر از صفر باشد.');
      return;
    }

    const payload = {
      section: form.section,
      name: form.name.trim(),
      englishName: form.englishName.trim(),
      category: form.category,
      categoryLabel: form.categoryLabel.trim(),
      price: parsePrice(form.price),
      oldPrice: parsePrice(form.oldPrice) || null,
      discountPercent: form.discountPercent === '' ? autoPercent : num(form.discountPercent),
      stock: num(form.stock),
      tag: form.tag.trim(),
      image: form.image,
      description: form.description.trim(),
      details: form.details.trim(),
      active: form.active,
      featured: form.featured,
      discounted: form.discounted,
      customImage: form.customImage,
      extra: {
        ...(product?.extra || {}),
        type: form.category,
        gemType: form.gemType.trim(),
        weightGold: form.weightGold.trim(),
        purity: form.purity.trim(),
        certCode: form.certCode.trim(),
        carat: form.carat.trim(),
        gemCategory: form.gemCategory,
        metal: form.metal.trim(),
        metalType: form.metalType,
        diamondInfo: form.diamondInfo.trim(),
        totalStock: num(form.totalStock) || num(form.stock),
        badges: form.badges
          .split(/[،,]/)
          .map((s) => s.trim())
          .filter(Boolean),
        features: form.features
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    if (isEdit) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        dir="rtl"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerBadge}>
              <Sparkles size={14} />
              <span>{isEdit ? 'ویرایش اطلاعات' : 'محصول جدید'}</span>
            </div>
            <h2 className={styles.headerTitle}>
              {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
            </h2>
            <p className={styles.headerDescription}>
              {isEdit
                ? 'اطلاعات محصول را ویرایش کنید. تغییرات به‌صورت زنده در فروشگاه اعمال می‌شوند.'
                : 'اطلاعات محصول جدید را وارد کنید تا به فروشگاه اضافه شود.'}
            </p>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {/* =====================================================
              IMAGE SECTION
          ===================================================== */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <div className={`${styles.sectionIcon} ${styles.iconTone_indigo}`}>
                  <ImageIcon size={20} />
                </div>
                <div className={styles.sectionHeaderContent}>
                  <h3 className={styles.sectionTitle}>تصویر محصول</h3>
                  <p className={styles.sectionDescription}>
                    تصویر اصلی محصول را بارگذاری کنید یا آدرس تصویر را وارد کنید.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.imageBlock}>
              <div className={styles.preview}>
                {form.image ? (
                  <img src={form.image} alt={form.name || 'پیش‌نمایش محصول'} />
                ) : (
                  <div className={styles.previewEmpty}>
                    <ImageOff size={22} />
                    <span>بدون تصویر</span>
                  </div>
                )}
              </div>

              <div className={styles.imageActions}>
                <label className={styles.uploadBtn}>
                  {uploading ? (
                    <Loader2 size={16} className={styles.spin} />
                  ) : (
                    <Upload size={16} />
                  )}
                  <span>{uploading ? 'در حال پردازش...' : 'بارگذاری تصویر'}</span>
                  <input type="file" accept="image/*" onChange={handleUpload} hidden />
                </label>

                {form.image && (
                  <button
                    type="button"
                    className={styles.clearImgBtn}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, image: '', customImage: true }))
                    }
                  >
                    <Trash2 size={15} />
                    <span>حذف تصویر</span>
                  </button>
                )}

                <input
                  type="text"
                  className={styles.input}
                  placeholder="یا آدرس تصویر (URL) را بچسبانید"
                  value={form.customImage ? form.image : ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      image: e.target.value,
                      customImage: true,
                    }))
                  }
                  dir="ltr"
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              BASIC INFO
          ===================================================== */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <div className={`${styles.sectionIcon} ${styles.iconTone_violet}`}>
                  <Package size={20} />
                </div>
                <div className={styles.sectionHeaderContent}>
                  <h3 className={styles.sectionTitle}>اطلاعات اصلی</h3>
                  <p className={styles.sectionDescription}>
                    نام، بخش نمایش، دسته‌بندی و قیمت محصول.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>نام محصول *</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={set('name')}
                  placeholder="مثلاً: انگشتر تک‌نگین برلیان"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>نام انگلیسی</label>
                <input
                  className={styles.input}
                  value={form.englishName}
                  onChange={set('englishName')}
                  dir="ltr"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>بخش نمایش در سایت</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={form.section}
                    onChange={set('section')}
                  >
                    {Object.entries(SECTION_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>دسته‌بندی</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={form.category}
                    onChange={set('category')}
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>برچسب / عنوان کالکشن</label>
                <input
                  className={styles.input}
                  value={form.tag}
                  onChange={set('tag')}
                  placeholder="مثلاً: پیشنهاد ویژه"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>عنوان دسته (نمایشی)</label>
                <input
                  className={styles.input}
                  value={form.categoryLabel}
                  onChange={set('categoryLabel')}
                  placeholder="مثلاً: گوهرسنگ‌های قیمتی"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>قیمت (تومان) *</label>
                <input
                  className={`${styles.input} ${styles.inputLtr}`}
                  value={form.price}
                  onChange={set('price')}
                  inputMode="numeric"
                  dir="ltr"
                />
                <small className={styles.hint}>{formatToman(form.price)} تومان</small>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>قیمت قبل از تخفیف</label>
                <input
                  className={`${styles.input} ${styles.inputLtr}`}
                  value={form.oldPrice}
                  onChange={set('oldPrice')}
                  inputMode="numeric"
                  dir="ltr"
                />
                <small className={styles.hint}>
                  {autoPercent > 0
                    ? `${autoPercent}٪ تخفیف محاسبه شد`
                    : 'خالی بگذارید اگر تخفیف ندارد'}
                </small>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>درصد تخفیف</label>
                <input
                  className={`${styles.input} ${styles.inputLtr}`}
                  value={form.discountPercent}
                  onChange={set('discountPercent')}
                  inputMode="numeric"
                  dir="ltr"
                  placeholder={String(autoPercent)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>موجودی انبار</label>
                <input
                  className={`${styles.input} ${styles.inputLtr}`}
                  value={form.stock}
                  onChange={set('stock')}
                  inputMode="numeric"
                  dir="ltr"
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              SECTION SPECIFIC
          ===================================================== */}
          {form.section === 'luxury' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <div className={`${styles.sectionIcon} ${styles.iconTone_sky}`}>
                    <Award size={20} />
                  </div>
                  <div className={styles.sectionHeaderContent}>
                    <h3 className={styles.sectionTitle}>مشخصات کالکشن لوکس</h3>
                    <p className={styles.sectionDescription}>
                      گروه گوهر و قیراط برای فیلتر کالکشن لوکس.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>گروه گوهر (فیلتر کالکشن لوکس)</label>
                  <div className={styles.selectWrapper}>
                    <select
                      className={styles.select}
                      value={form.gemCategory}
                      onChange={set('gemCategory')}
                    >
                      {GEM_CATEGORIES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>قیراط</label>
                  <input
                    className={styles.input}
                    value={form.carat}
                    onChange={set('carat')}
                    placeholder="۳.۸ قیراط"
                  />
                </div>
              </div>
            </section>
          )}

          {form.section === 'collection' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <div className={`${styles.sectionIcon} ${styles.iconTone_amber}`}>
                    <Layers size={20} />
                  </div>
                  <div className={styles.sectionHeaderContent}>
                    <h3 className={styles.sectionTitle}>مشخصات فروشگاه</h3>
                    <p className={styles.sectionDescription}>
                      نوع فلز، مشخصات نگین و برچسب‌های ویژه.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>نوع فلز (فیلتر فروشگاه)</label>
                  <div className={styles.selectWrapper}>
                    <select
                      className={styles.select}
                      value={form.metalType}
                      onChange={set('metalType')}
                    >
                      {Object.entries(METAL_TYPES).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>شرح فلز</label>
                  <input
                    className={styles.input}
                    value={form.metal}
                    onChange={set('metal')}
                    placeholder="طلای سفید ۱۸ عیار (۷۵۰)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>مشخصات نگین</label>
                  <input
                    className={styles.input}
                    value={form.diamondInfo}
                    onChange={set('diamondInfo')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>برچسب‌ها (با ، جدا کنید)</label>
                  <input
                    className={styles.input}
                    value={form.badges}
                    onChange={set('badges')}
                    placeholder="پرفروش‌ترین سال، شناسنامه‌دار GIA"
                  />
                </div>
              </div>
            </section>
          )}

          {form.section === 'discount' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <div className={`${styles.sectionIcon} ${styles.iconTone_rose}`}>
                    <Award size={20} />
                  </div>
                  <div className={styles.sectionHeaderContent}>
                    <h3 className={styles.sectionTitle}>مشخصات تخفیف</h3>
                    <p className={styles.sectionDescription}>
                      موجودی اولیه برای نمایش نوار «تنها N عدد مانده».
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    موجودی اولیه (برای نوار «تنها N عدد مانده»)
                  </label>
                  <input
                    className={`${styles.input} ${styles.inputLtr}`}
                    value={form.totalStock}
                    onChange={set('totalStock')}
                    inputMode="numeric"
                    dir="ltr"
                  />
                </div>
              </div>
            </section>
          )}

          {/* =====================================================
              SPECS
          ===================================================== */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <div className={`${styles.sectionIcon} ${styles.iconTone_emerald}`}>
                  <Award size={20} />
                </div>
                <div className={styles.sectionHeaderContent}>
                  <h3 className={styles.sectionTitle}>مشخصات فنی</h3>
                  <p className={styles.sectionDescription}>
                    گوهر، وزن طلا، عیار و کد شناسنامه بین‌المللی.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>نوع گوهر / نگین</label>
                <input
                  className={styles.input}
                  value={form.gemType}
                  onChange={set('gemType')}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>وزن طلا</label>
                <input
                  className={styles.input}
                  value={form.weightGold}
                  onChange={set('weightGold')}
                  placeholder="۷.۵ گرم"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>عیار</label>
                <input
                  className={styles.input}
                  value={form.purity}
                  onChange={set('purity')}
                  placeholder="۷۵۰ (۱۸ عیار)"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>کد شناسنامه</label>
                <input
                  className={`${styles.input} ${styles.inputLtr}`}
                  value={form.certCode}
                  onChange={set('certCode')}
                  dir="ltr"
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              DESCRIPTION
          ===================================================== */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <div className={`${styles.sectionIcon} ${styles.iconTone_cyan}`}>
                  <FileText size={20} />
                </div>
                <div className={styles.sectionHeaderContent}>
                  <h3 className={styles.sectionTitle}>توضیحات</h3>
                  <p className={styles.sectionDescription}>
                    متن توضیحات و جزئیات محصول.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>توضیحات</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={form.description}
                  onChange={set('description')}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>
                  جزئیات یک‌خطی (شناسنامه کوتاه)
                </label>
                <input
                  className={styles.input}
                  value={form.details}
                  onChange={set('details')}
                  placeholder="وزن طلا: ۷.۴ گرم • کد محصول: BR-882"
                />
              </div>

              {form.section === 'collection' && (
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>ویژگی‌ها (هر خط یک مورد)</label>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    value={form.features}
                    onChange={set('features')}
                  />
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              TOGGLES
          ===================================================== */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderLeft}>
                <div className={`${styles.sectionIcon} ${styles.iconTone_violet}`}>
                  <Eye size={20} />
                </div>
                <div className={styles.sectionHeaderContent}>
                  <h3 className={styles.sectionTitle}>وضعیت نمایش</h3>
                  <p className={styles.sectionDescription}>
                    وضعیت فعال بودن و ویژه بودن محصول.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={set('active')}
                />
                <Eye size={15} />
                <span>نمایش در فروشگاه</span>
              </label>

              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={set('featured')}
                />
                <Star size={15} />
                <span>محصول ویژه</span>
              </label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={form.discounted}
              onChange={set('discounted')}
            />
            <Sparkles size={15} />
            <span>نمایش در تخفیف‌های ویژه</span>
          </label>
            </div>
          </section>

          {/* =====================================================
              ERROR
          ===================================================== */}
          {error && (
            <div className={styles.errorBanner}>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            انصراف
          </button>

          <motion.button
            type="submit"
            className={styles.saveBtn}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Save size={17} />
            <span>{isEdit ? 'ذخیره تغییرات' : 'افزودن محصول'}</span>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}