// Single source of truth for the storefront catalog + the admin panel.
// Products live in localStorage so edits made in /admin survive reloads and
// show up on the public site immediately.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_PRODUCTS, CATEGORY_LABELS, SECTION_LABELS, blankProduct, getSeedProducts } from '../data/catalog';
import {
  selectFeatured,
  selectLuxury,
  selectDiscount,
  selectCollection,
} from '../data/adapters';

const STORAGE_KEY = 'lj_catalog_v1';
const ACTIVITY_KEY = 'lj_activity_v1';
const AUTH_KEY = 'lj_admin_authed';

// NOTE: this is a client-side gate only (the whole app is static). It keeps the
// panel out of sight, it is NOT real security — anyone can read the bundle.
const ADMIN_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || 'luxury1404';

const ProductsContext = createContext(null);

// ایمن‌سازی seedById با چک کردن SEED_PRODUCTS
const getSeedData = () => {
  try {
    const seedData = getSeedProducts();
    if (!Array.isArray(seedData)) return new Map();
    return new Map(seedData.map((p) => [String(p?.id || ''), p]));
  } catch (error) {
    console.warn('[ProductsContext] Error creating seedById map:', error);
    return new Map();
  }
};

const seedById = getSeedData();

const readStoredProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSeedProducts();
    
    let stored;
    try {
      stored = JSON.parse(raw);
    } catch (parseError) {
      console.warn('[ProductsContext] Failed to parse stored products:', parseError);
      localStorage.removeItem(STORAGE_KEY);
      return getSeedProducts();
    }
    
    if (!Array.isArray(stored) || stored.length === 0) {
      return getSeedProducts();
    }
    
    const validProducts = stored.filter(p => p !== null && p !== undefined && typeof p === 'object');
    
    if (validProducts.length === 0) {
      console.warn('[ProductsContext] No valid products in storage, using seed');
      localStorage.removeItem(STORAGE_KEY);
      return getSeedProducts();
    }
    
    return validProducts.map((p) => {
      if (!p || !p.id) {
        console.warn('[ProductsContext] Invalid product in storage:', p);
        return null;
      }
      const seed = seedById.get(String(p.id));
      if (!seed) return { ...p, id: String(p.id) };
      return {
        ...seed,
        ...p,
        id: String(p.id),
        image: p.customImage ? p.image : seed.image,
        extra: {
          ...seed.extra,
          ...p.extra,
          metalImages: p.customImage ? p.extra?.metalImages : seed.extra?.metalImages,
        },
      };
    }).filter(p => p !== null);
  } catch (error) {
    console.warn('[ProductsContext] Error reading stored products:', error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return getSeedProducts();
  }
};

const readStoredActivity = () => {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const FA_MONTH = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' });
const monthLabel = (date) => {
  try {
    return FA_MONTH.format(date);
  } catch {
    return date.toLocaleDateString('fa-IR', { month: 'long' });
  }
};

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(readStoredProducts);
  const [activity, setActivity] = useState(readStoredActivity);
  const [isAdminAuthed, setIsAdminAuthed] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(AUTH_KEY) === '1'
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.warn('[luxury-jewel] could not persist catalog:', err?.message);
    }
  }, [products]);

  useEffect(() => { const onStorage = (e) => { if (e.key === STORAGE_KEY && e.newValue) { try { const next=JSON.parse(e.newValue); if(Array.isArray(next)) setProducts(next); } catch {} } }; addEventListener('storage', onStorage); return () => removeEventListener('storage', onStorage); }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity.slice(0, 50)));
    } catch {
      /* storage full — activity log is disposable */
    }
  }, [activity]);

  const logActivity = useCallback((type, productName) => {
    setActivity((prev) =>
      [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, productName, at: Date.now() }, ...prev].slice(
        0,
        50
      )
    );
  }, []);

  /* ------------------------------ mutations ------------------------------ */

  const addProduct = useCallback(
    (product) => {
      const ready = { ...blankProduct(product.section), ...product, createdAt: Date.now(), updatedAt: Date.now() };
      ready.id = String(ready.id);
      setProducts((prev) => [ready, ...prev]);
      logActivity('add', ready.name || 'محصول بدون نام');
      return ready;
    },
    [logActivity]
  );

  const updateProduct = useCallback(
    (id, patch) => {
      const key = String(id);
      const validProducts = Array.isArray(products) 
        ? products.filter(p => p !== null && p !== undefined)
        : [];
      setProducts((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.map((p) => {
          if (!p || !p.id) return p;
          return p.id === key ? { ...p, ...patch, id: key, updatedAt: Date.now() } : p;
        });
      });
      logActivity('update', patch.name || validProducts.find((p) => p.id === key)?.name || 'محصول');
    },
    [logActivity, products]
  );

  const deleteProduct = useCallback(
    (id) => {
      const key = String(id);
      const validProducts = Array.isArray(products) 
        ? products.filter(p => p !== null && p !== undefined)
        : [];
      const target = validProducts.find((p) => p.id === key);
      setProducts((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.filter((p) => p && p.id !== key);
      });
      logActivity('delete', target?.name || 'محصول');
    },
    [logActivity, products]
  );

  const toggleActive = useCallback(
    (id) => {
      const key = String(id);
      const validProducts = Array.isArray(products) 
        ? products.filter(p => p !== null && p !== undefined)
        : [];
      const target = validProducts.find((p) => p.id === key);
      if (!target) return;
      setProducts((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.map((p) => {
          if (!p || !p.id) return p;
          return p.id === key ? { ...p, active: !p.active, updatedAt: Date.now() } : p;
        });
      });
      logActivity(target.active ? 'deactivate' : 'activate', target.name || 'محصول');
    },
    [logActivity, products]
  );

  const toggleFeatured = useCallback((id) => {
    const key = String(id);
    setProducts((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.map((p) => {
        if (!p || !p.id) return p;
        return p.id === key ? { ...p, featured: !p.featured, updatedAt: Date.now() } : p;
      });
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(getSeedProducts());
    setActivity([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVITY_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /* --------------------------- backup / restore -------------------------- */

  const exportJSON = useCallback(() => {
    const payload = { app: 'luxury-jewel', version: 1, exportedAt: new Date().toISOString(), products };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxury-jewel-products-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [products]);

  const importJSON = useCallback(async (file) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const list = Array.isArray(parsed) ? parsed : parsed?.products;
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('فایل معتبر نیست: هیچ محصولی پیدا نشد.');
    }
    setProducts(
      list.map((p) => ({ ...blankProduct(p.section || 'collection'), ...p, id: String(p.id ?? Date.now()) }))
    );
    setActivity([]);
  }, []);

  /* ------------------------------- reporting ----------------------------- */

  const getStats = useCallback(() => {
    const validProducts = Array.isArray(products) 
      ? products.filter(p => p !== null && p !== undefined && typeof p === 'object')
      : [];
    
    const total = validProducts.length;
    const active = validProducts.filter((p) => p.active !== false).length;
    const featured = validProducts.filter((p) => p.featured === true).length;
    const totalValue = validProducts.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0), 0);
    const priceSum = validProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const weekAgo = Date.now() - 7 * 86400000;
    const byCategory = Object.keys(CATEGORY_LABELS || {}).reduce((acc, key) => {
      acc[key] = validProducts.filter((p) => p.category === key).length;
      return acc;
    }, {});
    return {
      total,
      active,
      featured,
      totalValue,
      avgPrice: total ? Math.round(priceSum / total) : 0,
      byCategory,
      addedThisWeek: validProducts.filter((p) => (p.createdAt || 0) >= weekAgo).length,
    };
  }, [products]);

  const getActivity = useCallback((limit = 6) => activity.slice(0, limit), [activity]);

  const getMonthlyTrend = useCallback(
    (months = 6) => {
      const out = [];
      const now = new Date();
      const validProducts = Array.isArray(products) 
        ? products.filter(p => p !== null && p !== undefined && typeof p === 'object')
        : [];
      
      for (let i = months - 1; i >= 0; i -= 1) {
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59).getTime();
        const upTo = validProducts.filter((p) => (p.createdAt || 0) <= end);
        out.push({
          label: monthLabel(new Date(now.getFullYear(), now.getMonth() - i, 1)),
          count: upTo.length,
          value: upTo.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0), 0),
        });
      }
      return out;
    },
    [products]
  );

  /* --------------------------------- auth -------------------------------- */

  const loginAdmin = useCallback((password) => {
    const ok = String(password) === String(ADMIN_PASSWORD);
    if (ok) {
      setIsAdminAuthed(true);
      try {
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch {
        /* ignore */
      }
    }
    return ok;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthed(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /* ------------------------ storefront projections ----------------------- */

  const featuredProducts = useMemo(() => {
    try {
      return selectFeatured(products || []);
    } catch (error) {
      console.warn('Error in selectFeatured:', error);
      return [];
    }
  }, [products]);

  const luxuryProducts = useMemo(() => {
    try {
      return selectLuxury(products || []);
    } catch (error) {
      console.warn('Error in selectLuxury:', error);
      return [];
    }
  }, [products]);

  const discountProducts = useMemo(() => {
    try {
      return selectDiscount(products || []);
    } catch (error) {
      console.warn('Error in selectDiscount:', error);
      return [];
    }
  }, [products]);

  const collectionProducts = useMemo(() => {
    try {
      return selectCollection(products || []);
    } catch (error) {
      console.warn('Error in selectCollection:', error);
      return [];
    }
  }, [products]);

  const value = useMemo(
    () => ({
      products: products || [],
      categoryLabels: CATEGORY_LABELS,
      sectionLabels: SECTION_LABELS,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleActive,
      toggleFeatured,
      resetToDefaults,
      exportJSON,
      importJSON,
      getStats,
      getActivity,
      getMonthlyTrend,
      isAdminAuthed,
      loginAdmin,
      logoutAdmin,
      featuredProducts: featuredProducts || [],
      luxuryProducts: luxuryProducts || [],
      discountProducts: discountProducts || [],
      collectionProducts: collectionProducts || [],
    }),
    [
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleActive,
      toggleFeatured,
      resetToDefaults,
      exportJSON,
      importJSON,
      getStats,
      getActivity,
      getMonthlyTrend,
      isAdminAuthed,
      loginAdmin,
      logoutAdmin,
      featuredProducts,
      luxuryProducts,
      discountProducts,
      collectionProducts,
    ]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProducts must be used inside <ProductsProvider>');
  }
  return ctx;
};

export default ProductsContext;