// Normalizes the four hand-written product lists of the storefront into ONE
// editable catalog. The admin panel edits this shape; `adapters.js` turns it
// back into the exact shape each storefront section already renders.
import { FEATURED_SEED } from './featuredSeed';
import { LUXURY_SEED } from './luxurySeed';
import { DISCOUNT_SEED } from './discountSeed';
import { COLLECTION_SEED } from './collectionSeed';
import { parsePrice, calcDiscountPercent } from '../utils/money';

export const CATEGORY_LABELS = {
  ring: 'انگشتر و حلقه',
  earring: 'گوشواره',
  necklace: 'گردنبند و مدال',
  bracelet: 'دستبند',
  set: 'نیم‌ست و ست',
};

export const SECTION_LABELS = {
  featured: 'محبوب‌ترین‌ها (صفحه اصلی)',
  luxury: 'کالکشن لوکس',
  discount: 'تخفیف‌های ویژه',
  collection: 'فروشگاه / کلکسیون‌ها',
};

export const RING_SUBCATEGORIES = {
  solitaire: 'سولیتیر & تک‌نگین',
  gemstone: 'گوهرسنگ‌های قیمتی',
  wedding: 'حلقه ازدواج & ست',
  vintage: 'طراحی آرتیزان & وینتیج',
  mens: 'مردانه & پلاتین',
  earrings: 'گوشواره‌ها',
  necklaces: 'گردنبندها',
};

export const METAL_TYPES = {
  whiteGold: 'طلای سفید ۱۸ عیار',
  yellowGold: 'طلای زرد ۱۸ عیار',
  roseGold: 'رزگلد ایتالیایی',
  platinum: 'پلاتین خالص PT950',
};

export const GEM_CATEGORIES = ['زمرد', 'مروارید', 'یاقوت', 'الماس', 'آمیتیست'];

/** Best-effort category guess from the Persian product name / section label. */
export const inferCategory = (name = '', hint = '', fallback = 'ring') => {
  const text = `${name} ${hint}`;
  if (/نیم[‌ ]?ست|سرویس/.test(text)) return 'set';
  if (/گوشواره|گشواره/.test(text)) return 'earring';
  if (/دستبند|بنگل|النگو/.test(text)) return 'bracelet';
  if (/گردنبند|گردنبد|مدال|آویز|زنجیر|پلاک/.test(text)) return 'necklace';
  if (/انگشتر|حلقه|رینگ/.test(text)) return 'ring';
  return fallback;
};

const now = Date.now();
const DAY = 86400000;
/** Spread seed timestamps over the last months so the dashboard trend has shape. */
const seedDate = (index, spreadDays = 150) => now - ((index * 37) % spreadDays) * DAY;

const base = (raw, index) => ({
  active: true,
  featured: false,
  tag: '',
  oldPrice: null,
  discountPercent: 0,
  rating: 5,
  reviewsCount: 0,
  stock: 3,
  englishName: '',
  description: '',
  details: '',
  createdAt: seedDate(index),
  updatedAt: seedDate(index),
  customImage: false,
  ...raw,
  id: String(raw.id),
  price: parsePrice(raw.price),
});

const fromFeatured = (p, i) => {
  if (!p || !p.id) {
    console.warn('Invalid featured product at index:', i, p);
    return base(
      {
        id: `featured-fallback-${i}`,
        section: 'featured',
        name: 'محصول نامشخص',
        category: 'ring',
        categoryLabel: '',
        price: 0,
        image: '',
        tag: '',
        description: '',
        details: '',
        stock: 1,
        featured: true,
        extra: {},
      },
      i
    );
  }
  return base(
    {
      id: p.id,
      section: 'featured',
      name: p.name || 'بدون نام',
      category: inferCategory(p.name, p.type),
      categoryLabel: '',
      price: p.price || 0,
      image: p.image || '',
      tag: p.tag || '',
      description: p.description || '',
      details: p.details || '',
      stock: p.stock || 4,
      featured: true,
      extra: { 
        type: p.type || '', 
        gemType: p.gemType || '', 
        weightGold: p.weightGold || '', 
        certCode: p.certCode || '' 
      },
    },
    i
  );
};

const fromLuxury = (p, i) => {
  if (!p || !p.id) {
    console.warn('Invalid luxury product at index:', i, p);
    return base(
      {
        id: `luxury-fallback-${i}`,
        section: 'luxury',
        name: 'محصول نامشخص',
        category: 'ring',
        categoryLabel: '',
        price: 0,
        image: '',
        tag: '',
        description: '',
        details: '',
        stock: 1,
        extra: {},
      },
      i
    );
  }
  return base(
    {
      id: p.id,
      section: 'luxury',
      name: p.name || 'بدون نام',
      category: inferCategory(p.name, p.categoryFull),
      categoryLabel: p.categoryFull || '',
      price: p.priceNum || p.price || 0,
      image: p.image || '',
      tag: p.categoryFull || '',
      description: p.description || '',
      details: p.details || '',
      stock: p.stock || 2,
      extra: {
        gemCategory: p.category || '',
        metalImages: p.metalImages || {},
        purity: p.purity || '',
        gemType: p.gemType || '',
        weightGold: p.weightGold || '',
        carat: p.carat || '',
        certCode: p.certCode || '',
      },
    },
    i
  );
};

const fromDiscount = (p, i) => {
  if (!p || !p.id) {
    console.warn('Invalid discount product at index:', i, p);
    return base(
      {
        id: `discount-fallback-${i}`,
        section: 'discount',
        name: 'محصول نامشخص',
        category: 'ring',
        categoryLabel: '',
        price: 0,
        oldPrice: null,
        discountPercent: 0,
        image: '',
        tag: '',
        description: '',
        stock: 1,
        extra: {},
      },
      i
    );
  }
  return base(
    {
      id: p.id,
      section: 'discount',
      name: p.name || 'بدون نام',
      category: inferCategory(p.name, p.category),
      categoryLabel: p.category || '',
      price: p.discountPrice || 0,
      oldPrice: parsePrice(p.originalPrice),
      discountPercent: calcDiscountPercent(p.originalPrice, p.discountPrice),
      image: p.image || '',
      tag: p.category || '',
      description: p.description || '',
      stock: p.stockLeft || p.stock || 1,
      extra: {
        totalStock: p.totalStock || p.stock || 1,
        gemType: p.gemType || '',
        weightGold: p.weightGold || '',
        certCode: p.certCode || '',
      },
    },
    i
  );
};

const fromCollection = (p, i) => {
  if (!p || !p.id) {
    console.warn('Invalid collection product at index:', i, p);
    return base(
      {
        id: `collection-fallback-${i}`,
        section: 'collection',
        name: 'محصول نامشخص',
        englishName: '',
        category: 'ring',
        categoryLabel: '',
        price: 0,
        oldPrice: null,
        discountPercent: 0,
        image: '',
        tag: '',
        description: '',
        stock: 1,
        rating: 5,
        reviewsCount: 0,
        featured: false,
        extra: {},
      },
      i
    );
  }
  return base(
    {
      id: p.id,
      section: 'collection',
      name: p.name || 'بدون نام',
      englishName: p.englishName || '',
      category: inferCategory(p.name, p.categoryLabel),
      categoryLabel: p.categoryLabel || '',
      price: p.priceNum || p.price || 0,
      oldPrice: p.oldPriceNum || null,
      discountPercent: p.discountPercent || 0,
      image: p.image || '',
      tag: p.badges?.[0] || '',
      description: p.description || '',
      stock: p.stock || 1,
      rating: p.rating || 5,
      reviewsCount: p.reviewsCount || 0,
      featured: Boolean(p.badges?.some((b) => b.includes('پرفروش'))),
      extra: {
        ringCategory: p.category || '',
        metal: p.metal || '',
        metalType: p.metalType || '',
        diamondInfo: p.diamondInfo || '',
        purity: p.purity || '',
        badges: p.badges || [],
        features: p.features || [],
      },
    },
    i
  );
};

const safeMap = (data, mapper) => {
  if (!Array.isArray(data)) {
    console.warn('Invalid seed data received:', data);
    return [];
  }
  return data.map(mapper);
};

/** The full storefront catalog, normalized. */
export const SEED_PRODUCTS = [
  ...safeMap(FEATURED_SEED, fromFeatured),
  ...safeMap(LUXURY_SEED, fromLuxury),
  ...safeMap(DISCOUNT_SEED, fromDiscount),
  ...safeMap(COLLECTION_SEED, fromCollection),
];

/** Empty product used by the "add product" form. */
export const blankProduct = (section = 'collection') => ({
  id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  section,
  name: '',
  englishName: '',
  category: 'ring',
  categoryLabel: '',
  price: 0,
  oldPrice: null,
  discountPercent: 0,
  stock: 1,
  image: '',
  tag: '',
  description: '',
  details: '',
  active: true,
  featured: false,
  rating: 5,
  reviewsCount: 0,
  customImage: true,
  extra: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// همچنین برای اطمینان از اینکه SEED_PRODUCTS همیشه یک آرایه است
export const getSeedProducts = () => {
  if (!Array.isArray(SEED_PRODUCTS) || SEED_PRODUCTS.length === 0) {
    console.warn('SEED_PRODUCTS is empty or invalid, returning fallback data');
    return [
      {
        id: 'fallback-1',
        section: 'collection',
        name: 'محصول نمونه',
        englishName: 'Sample Product',
        category: 'ring',
        categoryLabel: 'انگشتر',
        price: 1000000,
        oldPrice: null,
        discountPercent: 0,
        stock: 5,
        image: '/images/fallback.jpg',
        tag: 'جدید',
        description: 'توضیحات محصول نمونه',
        details: 'جزئیات بیشتر',
        active: true,
        featured: true,
        rating: 5,
        reviewsCount: 0,
        customImage: false,
        extra: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];
  }
  return SEED_PRODUCTS;
};