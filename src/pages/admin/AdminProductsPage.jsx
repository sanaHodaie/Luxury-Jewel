// src/pages/admin/AdminProductsPage.jsx
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
  ImageOff,
  Package,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import ProductFormModal from '../../components/admin/ProductFormModal';
import styles from './AdminProductsPage.module.css';

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const card = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function AdminProductsPage() {
  const { products, categoryLabels, deleteProduct, toggleActive } = useProducts();

  // فیلتر کردن محصولات نامعتبر
  const validProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(
      (p) => p !== null && p !== undefined && typeof p === 'object'
    );
  }, [products]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalState, setModalState] = useState({ open: false, product: null });

  const filtered = useMemo(() => {
    return validProducts.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        (p.name && p.name.toLowerCase().includes(search.trim().toLowerCase()));
      const matchesCategory =
        categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [validProducts, search, categoryFilter]);

  // آمار سریع
  const stats = useMemo(() => {
    const total = validProducts.length;
    const active = validProducts.filter((p) => p.active !== false).length;
    const outOfStock = validProducts.filter(
      (p) => Number(p.stock || 0) === 0
    ).length;
    const lowStock = validProducts.filter(
      (p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 2
    ).length;
    return { total, active, outOfStock, lowStock };
  }, [validProducts]);

  const handleDelete = (product) => {
    if (
      product &&
      window.confirm(
        `محصول «${product.name}» حذف بشه؟ این عمل قابل بازگشت نیست.`
      )
    ) {
      deleteProduct(product.id);
    }
  };

  return (
    <div dir="rtl" className={styles.page}>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerBadge}>
            <Sparkles size={14} />
            <span>پنل مدیریت محصولات</span>
          </div>
          <h1 className={styles.headerTitle}>محصولات</h1>
          <p className={styles.headerDescription}>
            مدیریت کامل محصولات فروشگاه. از اینجا می‌توانید محصولات را
            اضافه، ویرایش، فعال/غیرفعال یا حذف کنید. تغییرات به‌صورت زنده
            در فروشگاه اعمال می‌شوند.
          </p>

          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${
                    stats.total
                      ? Math.round((stats.active / stats.total) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className={styles.progressLabel}>
              {stats.total
                ? Math.round((stats.active / stats.total) * 100)
                : 0}
              ٪ محصول فعال
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            className={styles.primaryButton}
            onClick={() => setModalState({ open: true, product: null })}
          >
            <Plus size={18} />
            <span>افزودن محصول</span>
          </motion.button>
        </div>
      </motion.div>

      {/* =====================================================
          STATISTICS CARDS
      ===================================================== */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_indigo}`}>
            <Package size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>مجموع محصولات</span>
            <strong className={styles.statValue}>
              {stats.total.toLocaleString('fa-IR')}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_emerald}`}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>فعال در فروشگاه</span>
            <strong className={styles.statValue}>
              {stats.active.toLocaleString('fa-IR')}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_amber}`}>
            <AlertCircle size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>موجودی کم</span>
            <strong className={styles.statValue}>
              {stats.lowStock.toLocaleString('fa-IR')}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTone_rose}`}>
            <X size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>ناموجود</span>
            <strong className={styles.statValue}>
              {stats.outOfStock.toLocaleString('fa-IR')}
            </strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="جستجوی نام محصول..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearch('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.selectWrapper}>
          <Layers size={16} className={styles.selectIcon} />
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
      </div>

      {/* =====================================================
          PRODUCTS GRID
      ===================================================== */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <Package size={42} />
          <p className={styles.emptyStateTitle}>محصولی پیدا نشد</p>
          <p className={styles.emptyStateText}>
            با تغییر عبارت جستجو یا فیلترها دوباره تلاش کنید، یا محصول
            جدیدی اضافه کنید.
          </p>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setModalState({ open: true, product: null })}
          >
            <Plus size={16} />
            <span>افزودن اولین محصول</span>
          </button>
        </div>
      ) : (
        <motion.div
          className={styles.grid}
          variants={grid}
          initial="hidden"
          animate="show"
        >
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
                    <img
                      src={p.image}
                      alt={p.name || 'محصول'}
                      className={styles.thumbImg}
                    />
                  ) : (
                    <div className={styles.thumbFallback}>
                      <ImageOff size={22} />
                      <span>بدون تصویر</span>
                    </div>
                  )}

                  {p.discountPercent > 0 && (
                    <span className={styles.discountBadge}>
                      {p.discountPercent}%- تخفیف
                    </span>
                  )}

                  <button
                    type="button"
                    className={`${styles.statusBtn} ${
                      p.active ? styles.statusOn : styles.statusOff
                    }`}
                    onClick={() => toggleActive(p.id)}
                    title={
                      p.active
                        ? 'کلیک برای غیرفعال کردن'
                        : 'کلیک برای فعال کردن'
                    }
                  >
                    {p.active ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{p.active ? 'در فروشگاه' : 'مخفی'}</span>
                  </button>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.productName}>
                    {p.name || 'بدون نام'}
                  </p>
                  <div className={styles.metaRow}>
                    <span className={styles.categoryPill}>
                      {categoryLabels?.[p.category] ||
                        p.category ||
                        'دسته‌بندی نشده'}
                    </span>
                    {p.tag && <span className={styles.tagPill}>{p.tag}</span>}
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      {Number(p.price || 0).toLocaleString('fa-IR')} تومان
                    </span>
                    <span
                      className={
                        Number(p.stock || 0) <= 2
                          ? styles.lowStock
                          : styles.stock
                      }
                    >
                      موجودی: {p.stock || 0}
                    </span>
                  </div>

                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() =>
                        setModalState({ open: true, product: p })
                      }
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