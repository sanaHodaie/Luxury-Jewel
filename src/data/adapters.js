// Turns a normalized catalog product back into the exact object shape each
// storefront section already renders, so the UI code stays untouched while the
// data becomes editable from the admin panel.
import { formatToman, toPersianDigits } from '../utils/money';

// اصلاح تابع activeOnly برای ایمنی بیشتر
const activeOnly = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter((p) => {
    if (!p) return false;
    return p.active !== false;
  });
};

/** Fallback sub-category used by the collections page filters. */
const DEFAULT_RING_CATEGORY = {
  ring: 'gemstone',
  earring: 'earrings',
  necklace: 'necklaces',
  bracelet: 'gemstone',
  set: 'wedding',
};

export const toFeaturedShape = (p) => {
  if (!p) return null;
  return {
    id: p.id || '',
    name: p.name || '',
    type: p.extra?.type || p.category || '',
    price: formatToman(p.price || 0),
    priceNum: p.price || 0,
    tag: p.tag || p.categoryLabel || '',
    image: p.image || '',
    description: p.description || '',
    details: p.details || '',
    gemType: p.extra?.gemType || '',
    weightGold: p.extra?.weightGold || '',
    certCode: p.extra?.certCode || '',
  };
};

export const toLuxuryShape = (p) => {
  if (!p) return null;
  return {
    id: p.id || '',
    name: p.name || '',
    category: p.extra?.gemCategory || 'الماس',
    categoryFull: p.categoryLabel || p.tag || 'کالکشن لوکس',
    priceNum: p.price || 0,
    price: formatToman(p.price || 0),
    purity: p.extra?.purity || 'طلا ۱۸ عیار',
    gemType: p.extra?.gemType || '',
    weightGold: p.extra?.weightGold || '',
    carat: p.extra?.carat || '',
    certCode: p.extra?.certCode || '',
    image: p.image || '',
    metalImages: p.extra?.metalImages || {},
    description: p.description || '',
    details: p.details || '',
  };
};

export const toDiscountShape = (p) => {
  if (!p) return null;
  const stockLeft = Number(p.stock) || 0;
  return {
    id: p.id || '',
    name: p.name || '',
    category: p.categoryLabel || p.tag || '',
    discountPercent: `${toPersianDigits(p.discountPercent || 0)}٪`,
    originalPrice: formatToman(p.oldPrice || Math.round((p.price || 0) * 1.25)),
    discountPrice: formatToman(p.price || 0),
    stockLeft,
    totalStock: Number(p.extra?.totalStock) || Math.max(stockLeft * 2, 1),
    image: p.image || '',
    gemType: p.extra?.gemType || '',
    weightGold: p.extra?.weightGold || '',
    certCode: p.extra?.certCode || '',
    description: p.description || '',
  };
};

export const toCollectionShape = (p) => {
  if (!p) return null;
  return {
    id: p.id || '',
    name: p.name || '',
    englishName: p.englishName || '',
    category: p.extra?.ringCategory || DEFAULT_RING_CATEGORY[p.category] || 'gemstone',
    categoryLabel: p.categoryLabel || '',
    price: formatToman(p.price || 0),
    priceNum: p.price || 0,
    oldPrice: p.oldPrice ? formatToman(p.oldPrice) : null,
    oldPriceNum: p.oldPrice || null,
    discountPercent: p.discountPercent || 0,
    image: p.image || '',
    metal: p.extra?.metal || p.extra?.purity || 'طلای ۱۸ عیار',
    metalType: p.extra?.metalType || 'yellowGold',
    diamondInfo: p.extra?.diamondInfo || p.extra?.gemType || '',
    purity: p.extra?.purity || '۷۵۰ (۱۸ عیار)',
    badges: p.extra?.badges?.length ? p.extra.badges : p.tag ? [p.tag] : [],
    stock: Number(p.stock) || 0,
    rating: Number(p.rating) || 5,
    reviewsCount: Number(p.reviewsCount) || 0,
    description: p.description || '',
    features: p.extra?.features || [],
    installmentPrice: formatToman(Math.round((Number(p.price) || 0) / 4)),
  };
};

export const selectFeatured = (products) => {
  if (!Array.isArray(products)) return [];

  const filtered = products.filter((p) => {
    if (!p) return false;
    return p.featured === true;
  });

  const active = activeOnly(filtered);

  return active
    .map(toFeaturedShape)
    .filter(Boolean);
};

export const selectLuxury = (products) => {
  if (!Array.isArray(products)) return [];
  const filtered = products.filter((p) => {
    if (!p) return false;
    return p.section === 'luxury';
  });
  const active = activeOnly(filtered);
  return active.map(toLuxuryShape).filter(Boolean);
};

export const selectDiscount = (products) => {
  if (!Array.isArray(products)) return [];
  const filtered = products.filter((p) => {
    if (!p) return false;
    return p.discounted === true;
  });
  const active = activeOnly(filtered);
  return active.map(toDiscountShape).filter(Boolean);
};

export const selectCollection = (products) => {
  if (!Array.isArray(products)) return [];
  const filtered = products.filter((p) => {
    if (!p) return false;
    return p.section === 'collection';
  });
  const active = activeOnly(filtered);
  return active.map(toCollectionShape).filter(Boolean);
};

// توابع کمکی اضافی برای ایمنی بیشتر
export const selectAllProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return activeOnly(products);
};

export const selectProductById = (products, id) => {
  if (!Array.isArray(products) || !id) return null;
  return products.find((p) => p && String(p.id) === String(id)) || null;
};