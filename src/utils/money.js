// Shared numeric/currency helpers (Persian digits ⇄ numbers).

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** 1500 → '۱۵۰۰' */
export const toPersianDigits = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
};

/** '۱۵۰۰' → '1500' */
export const toEnglishDigits = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

/** '۱۹,۵۰۰,۰۰۰' | 19500000 → 19500000 */
export const parsePrice = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const digits = toEnglishDigits(value).replace(/[^0-9]/g, '');
  return parseInt(digits, 10) || 0;
};

/** 19500000 → '۱۹,۵۰۰,۰۰۰' (same shape the site already uses) */
export const formatToman = (num) => {
  const n = parsePrice(num);
  if (!n) return '۰';
  return toPersianDigits(Math.round(n).toLocaleString('en-US'));
};

/** Percentage off, derived from an old/new price pair. */
export const calcDiscountPercent = (oldPrice, price) => {
  const o = parsePrice(oldPrice);
  const p = parsePrice(price);
  if (!o || !p || o <= p) return 0;
  return Math.round(((o - p) / o) * 100);
};
