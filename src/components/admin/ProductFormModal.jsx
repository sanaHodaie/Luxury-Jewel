// src/components/admin/ProductFormModal.jsx
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Save, ImageOff, Trash2, Loader2, Star, Eye } from 'lucide-react';
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
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="بستن">
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {/* ---------- image ---------- */}
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
                {uploading ? <Loader2 size={16} className={styles.spin} /> : <Upload size={16} />}
                <span>{uploading ? 'در حال پردازش...' : 'بارگذاری تصویر'}</span>
                <input type="file" accept="image/*" onChange={handleUpload} hidden />
              </label>
              {form.image && (
                <button
                  type="button"
                  className={styles.clearImgBtn}
                  onClick={() => setForm((prev) => ({ ...prev, image: '', customImage: true }))}
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
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value, customImage: true }))}
              />
            </div>
          </div>

          {/* ---------- basics ---------- */}
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>نام محصول *</span>
              <input className={styles.input} value={form.name} onChange={set('name')} placeholder="مثلاً: انگشتر تک‌نگین برلیان" />
            </label>

            <label className={styles.field}>
              <span>نام انگلیسی</span>
              <input className={styles.input} value={form.englishName} onChange={set('englishName')} dir="ltr" />
            </label>

            <label className={styles.field}>
              <span>بخش نمایش در سایت</span>
              <select className={styles.input} value={form.section} onChange={set('section')}>
                {Object.entries(SECTION_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>دسته‌بندی</span>
              <select className={styles.input} value={form.category} onChange={set('category')}>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>برچسب / عنوان کالکشن</span>
              <input className={styles.input} value={form.tag} onChange={set('tag')} placeholder="مثلاً: پیشنهاد ویژه" />
            </label>

            <label className={styles.field}>
              <span>عنوان دسته (نمایشی)</span>
              <input className={styles.input} value={form.categoryLabel} onChange={set('categoryLabel')} placeholder="مثلاً: گوهرسنگ‌های قیمتی" />
            </label>

            <label className={styles.field}>
              <span>قیمت (تومان) *</span>
              <input className={styles.input} value={form.price} onChange={set('price')} inputMode="numeric" dir="ltr" />
              <small className={styles.hint}>{formatToman(form.price)} تومان</small>
            </label>

            <label className={styles.field}>
              <span>قیمت قبل از تخفیف</span>
              <input className={styles.input} value={form.oldPrice} onChange={set('oldPrice')} inputMode="numeric" dir="ltr" />
              <small className={styles.hint}>
                {autoPercent > 0 ? `${autoPercent}٪ تخفیف محاسبه شد` : 'خالی بگذارید اگر تخفیف ندارد'}
              </small>
            </label>

            <label className={styles.field}>
              <span>درصد تخفیف</span>
              <input
                className={styles.input}
                value={form.discountPercent}
                onChange={set('discountPercent')}
                inputMode="numeric"
                dir="ltr"
                placeholder={String(autoPercent)}
              />
            </label>

            <label className={styles.field}>
              <span>موجودی انبار</span>
              <input className={styles.input} value={form.stock} onChange={set('stock')} inputMode="numeric" dir="ltr" />
            </label>
          </div>

          {/* ---------- section specific ---------- */}
          {form.section === 'luxury' && (
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>گروه گوهر (فیلتر کالکشن لوکس)</span>
                <select className={styles.input} value={form.gemCategory} onChange={set('gemCategory')}>
                  {GEM_CATEGORIES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>قیراط</span>
                <input className={styles.input} value={form.carat} onChange={set('carat')} placeholder="۳.۸ قیراط" />
              </label>
            </div>
          )}

          {form.section === 'collection' && (
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>نوع فلز (فیلتر فروشگاه)</span>
                <select className={styles.input} value={form.metalType} onChange={set('metalType')}>
                  {Object.entries(METAL_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>شرح فلز</span>
                <input className={styles.input} value={form.metal} onChange={set('metal')} placeholder="طلای سفید ۱۸ عیار (۷۵۰)" />
              </label>
              <label className={styles.field}>
                <span>مشخصات نگین</span>
                <input className={styles.input} value={form.diamondInfo} onChange={set('diamondInfo')} />
              </label>
              <label className={styles.field}>
                <span>برچسب‌ها (با ، جدا کنید)</span>
                <input className={styles.input} value={form.badges} onChange={set('badges')} placeholder="پرفروش‌ترین سال، شناسنامه‌دار GIA" />
              </label>
            </div>
          )}

          {form.section === 'discount' && (
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>موجودی اولیه (برای نوار «تنها N عدد مانده»)</span>
                <input className={styles.input} value={form.totalStock} onChange={set('totalStock')} inputMode="numeric" dir="ltr" />
              </label>
            </div>
          )}

          {/* ---------- specs ---------- */}
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>نوع گوهر / نگین</span>
              <input className={styles.input} value={form.gemType} onChange={set('gemType')} />
            </label>
            <label className={styles.field}>
              <span>وزن طلا</span>
              <input className={styles.input} value={form.weightGold} onChange={set('weightGold')} placeholder="۷.۵ گرم" />
            </label>
            <label className={styles.field}>
              <span>عیار</span>
              <input className={styles.input} value={form.purity} onChange={set('purity')} placeholder="۷۵۰ (۱۸ عیار)" />
            </label>
            <label className={styles.field}>
              <span>کد شناسنامه</span>
              <input className={styles.input} value={form.certCode} onChange={set('certCode')} dir="ltr" />
            </label>
          </div>

          <label className={styles.fieldFull}>
            <span>توضیحات</span>
            <textarea className={styles.textarea} rows={3} value={form.description} onChange={set('description')} />
          </label>

          <label className={styles.fieldFull}>
            <span>جزئیات یک‌خطی (شناسنامه کوتاه)</span>
            <input className={styles.input} value={form.details} onChange={set('details')} placeholder="وزن طلا: ۷.۴ گرم • کد محصول: BR-882" />
          </label>

          {form.section === 'collection' && (
            <label className={styles.fieldFull}>
              <span>ویژگی‌ها (هر خط یک مورد)</span>
              <textarea className={styles.textarea} rows={4} value={form.features} onChange={set('features')} />
            </label>
          )}

          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={form.active} onChange={set('active')} />
              <Eye size={15} />
              <span>نمایش در فروشگاه</span>
            </label>
            <label className={styles.toggle}>
              <input type="checkbox" checked={form.featured} onChange={set('featured')} />
              <Star size={15} />
              <span>محصول ویژه</span>
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            انصراف
          </button>
          <motion.button type="submit" className={styles.saveBtn} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Save size={17} />
            <span>{isEdit ? 'ذخیره تغییرات' : 'افزودن محصول'}</span>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
