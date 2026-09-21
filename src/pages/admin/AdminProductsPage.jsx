// src/pages/admin/AdminProductsPage.jsx
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, ImageOff } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import ProductFormModal from '../../components/admin/ProductFormModal';
import styles from './AdminProductsPage.module.css';

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const card = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function AdminProductsPage() {
  const { products, categoryLabels, deleteProduct, toggleActive } = useProducts();

  // فیلتر کردن محصولات نامعتبر
  const validProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => p !== null && p !== undefined && typeof p === 'object');
  }, [products]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalState, setModalState] = useState({ open: false, product: null });

  const filtered = useMemo(() => {
    return validProducts.filter((p) => {
      const matchesSearch =
        !search.trim() || (p.name && p.name.toLowerCase().includes(search.trim().toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [validProducts, search, categoryFilter]);

  const handleDelete = (product) => {
    if (product && window.confirm(`محصول «${product.name}» حذف بشه؟ این عمل قابل بازگشت نیست.`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>محصولات</h1>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          className={styles.addBtn}
          onClick={() => setModalState({ open: true, product: null })}
        >
          <Plus size={18} />
          <span>افزودن محصول</span>
        </motion.button>
      </motion.div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="جستجوی نام محصول..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">همه‌ی دسته‌ها</option>
          {Object.entries(categoryLabels || {}).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p>محصولی پیدا نشد.</p>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setModalState({ open: true, product: null })}
          >
            <Plus size={16} />
            <span>افزودن اولین محصول</span>
          </button>
        </div>
      ) : (
        <motion.div className={styles.grid} variants={grid} initial="hidden" animate="show">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                variants={card}
                initial="hidden"
                animate="show"
                exit="exit"
                whileHover={{ y: -6 }}
                className={styles.productCard}
              >
                <div className={styles.thumbWrap}>
                  {p.image ? (
                    <img src={p.image} alt={p.name || 'محصول'} className={styles.thumbImg} />
                  ) : (
                    <div className={styles.thumbFallback}>
                      <ImageOff size={22} />
                      <span>بدون تصویر</span>
                    </div>
                  )}

                  {p.discountPercent > 0 && (
                    <span className={styles.discountBadge}>{p.discountPercent}%- تخفیف</span>
                  )}

                  <button
                    type="button"
                    className={`${styles.statusBtn} ${p.active ? styles.statusOn : styles.statusOff}`}
                    onClick={() => toggleActive(p.id)}
                    title={p.active ? 'کلیک برای غیرفعال کردن' : 'کلیک برای فعال کردن'}
                  >
                    {p.active ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{p.active ? 'در فروشگاه' : 'مخفی'}</span>
                  </button>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.productName}>{p.name || 'بدون نام'}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.categoryPill}>{categoryLabels?.[p.category] || p.category || 'دسته‌بندی نشده'}</span>
                    {p.tag && <span className={styles.tagPill}>{p.tag}</span>}
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>{Number(p.price || 0).toLocaleString('fa-IR')} تومان</span>
                    <span className={Number(p.stock || 0) <= 2 ? styles.lowStock : styles.stock}>
                      موجودی: {p.stock || 0}
                    </span>
                  </div>

                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => setModalState({ open: true, product: p })}
                    >
                      <Pencil size={15} />
                      <span>ویرایش</span>
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(p)}
                    >
                      <Trash2 size={15} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {modalState.open && (
          <ProductFormModal
            product={modalState.product}
            onClose={() => setModalState({ open: false, product: null })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}