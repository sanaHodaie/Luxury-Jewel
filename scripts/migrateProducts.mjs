import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL پیدا نشد.');
}

if (!SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY پیدا نشد.');
}

const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY
);

const jsonPath = './luxury-jewel-products.json';

if (!fs.existsSync(jsonPath)) {
  throw new Error(
    `فایل ${jsonPath} پیدا نشد.`
  );
}

const products = JSON.parse(
  fs.readFileSync(jsonPath, 'utf8')
);

if (!Array.isArray(products)) {
  throw new Error(
    'محتوای فایل JSON باید یک آرایه از محصولات باشد.'
  );
}

console.log(`تعداد محصولات خوانده‌شده: ${products.length}`);

products.forEach((product, index) => {
  if (!product) {
    console.error(
      `❌ محصول شماره ${index + 1} در JSON برابر null است.`
    );
  }
});

const rows = products.map((product, index) => {
  if (!product) {
    throw new Error(
      `محصول شماره ${index + 1} در فایل JSON برابر null است.`
    );
  }

  return {
    id: String(product.id),

    section: product.section,
    name: product.name,
    english_name: product.englishName || null,

    category: product.category || null,
    category_label: product.categoryLabel || null,

    price: Number(product.price) || 0,
    old_price:
      product.oldPrice == null
        ? null
        : Number(product.oldPrice),

    discount_percent:
      Number(product.discountPercent) || 0,

    stock:
      Number(product.stock) || 0,

    image: product.image || null,
    tag: product.tag || null,

    description: product.description || null,
    details: product.details || null,

    active: product.active !== false,
    featured: Boolean(product.featured),

    rating:
      product.rating == null
        ? 5
        : Number(product.rating),

    reviews_count:
      product.reviewsCount == null
        ? 0
        : Number(product.reviewsCount),

    custom_image: Boolean(product.customImage),

    extra:
      product.extra &&
      typeof product.extra === 'object'
        ? product.extra
        : {},

    created_at:
      product.createdAt
        ? new Date(product.createdAt).toISOString()
        : new Date().toISOString(),

    updated_at:
      product.updatedAt
        ? new Date(product.updatedAt).toISOString()
        : new Date().toISOString(),
  };
});

console.log('در حال انتقال محصولات به Supabase...');

const { data, error } = await supabase
  .from('products')
  .upsert(rows, {
    onConflict: 'id',
  })
  .select('id');

if (error) {
  console.error('خطا در Migration:');
  console.error(error);
  process.exit(1);
}

console.log(
  `Migration با موفقیت انجام شد. ${data.length} محصول وارد/به‌روزرسانی شد.`
);