
// Single source of truth for the storefront catalog + the admin panel.
// Products are loaded from Supabase.
// Product CRUD is also persisted to Supabase.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CATEGORY_LABELS,
  SECTION_LABELS,
  blankProduct,
  getSeedProducts,
} from '../data/catalog';

import {
  selectFeatured,
  selectLuxury,
  selectDiscount,
  selectCollection,
} from '../data/adapters';

import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'lj_catalog_v1';
const ACTIVITY_KEY = 'lj_activity_v1';

const ProductsContext = createContext(null);

/* =========================================================
   SUPABASE → FRONTEND PRODUCT
========================================================= */

const fromSupabaseProduct = (row) => {
  if (!row) return null;

  return {
    id: String(row.id),
    section: row.section,

    name: row.name || '',
    englishName: row.english_name || '',

    category: row.category || '',
    categoryLabel: row.category_label || '',

    price: Number(row.price) || 0,

    oldPrice:
      row.old_price == null
        ? null
        : Number(row.old_price),

    discountPercent:
      Number(row.discount_percent) || 0,
      discounted: Boolean(row.discounted),

    stock:
      Number(row.stock) || 0,

    image: row.image || '',
    tag: row.tag || '',

    description: row.description || '',
    details: row.details || '',

    active: row.active !== false,
    featured: row.featured === true,

    rating:
      row.rating == null
        ? 5
        : Number(row.rating),

    reviewsCount:
      row.reviews_count == null
        ? 0
        : Number(row.reviews_count),

    customImage:
      row.custom_image === true,

    extra:
      row.extra &&
      typeof row.extra === 'object'
        ? row.extra
        : {},

    createdAt:
      row.created_at
        ? new Date(
            row.created_at
          ).getTime()
        : Date.now(),

    updatedAt:
      row.updated_at
        ? new Date(
            row.updated_at
          ).getTime()
        : Date.now(),
  };
};

/* =========================================================
   FRONTEND PRODUCT → SUPABASE
========================================================= */

const toSupabaseProduct = (
  product
) => {
  return {
    id: String(product.id),

    section: product.section,

    name:
      product.name || null,

    english_name:
      product.englishName || null,

    category:
      product.category || null,

    category_label:
      product.categoryLabel || null,

    price:
      Number(product.price) || 0,

    old_price:
      product.oldPrice == null
        ? null
        : Number(product.oldPrice),

    discount_percent:
      Number(product.discountPercent) || 0,
      discounted: Boolean(product.discounted),

    stock:
      Number(product.stock) || 0,

    image:
      product.image || null,

    tag:
      product.tag || null,

    description:
      product.description || null,

    details:
      product.details || null,

    active:
      product.active !== false,

    featured:
      product.featured === true,

    rating:
      product.rating == null
        ? 5
        : Number(product.rating),

    reviews_count:
      product.reviewsCount == null
        ? 0
        : Number(product.reviewsCount),

    custom_image:
      product.customImage === true,

    extra:
      product.extra &&
      typeof product.extra ===
        'object'
        ? product.extra
        : {},

    updated_at:
      new Date().toISOString(),
  };
};

/* =========================================================
   LOAD PRODUCTS FROM SUPABASE
========================================================= */

const fetchProductsFromSupabase =
  async () => {
    const {
      data,
      error,
    } = await supabase
      .from('products')
      .select('*')
      .order('created_at', {
        ascending: true,
      });

    if (error) {
      console.error(
        '[ProductsContext] Failed to fetch products from Supabase:',
        error
      );

      throw error;
    }

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(
        fromSupabaseProduct
      )
      .filter(Boolean);
  };

/* =========================================================
   LEGACY LOCAL STORAGE HELPERS
========================================================= */

const getSeedData = () => {
  try {
    const seedData =
      getSeedProducts();

    if (!Array.isArray(seedData)) {
      return new Map();
    }

    return new Map(
      seedData.map((p) => [
        String(p?.id || ''),
        p,
      ])
    );
  } catch (error) {
    console.warn(
      '[ProductsContext] Error creating seedById map:',
      error
    );

    return new Map();
  }
};

const seedById =
  getSeedData();

const readStoredProducts =
  () => {
    try {
      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!raw) {
        return getSeedProducts();
      }

      let stored;

      try {
        stored =
          JSON.parse(raw);
      } catch (parseError) {
        console.warn(
          '[ProductsContext] Failed to parse stored products:',
          parseError
        );

        localStorage.removeItem(
          STORAGE_KEY
        );

        return getSeedProducts();
      }

      if (
        !Array.isArray(
          stored
        ) ||
        stored.length === 0
      ) {
        return getSeedProducts();
      }

      const validProducts =
        stored.filter(
          (p) =>
            p !== null &&
            p !== undefined &&
            typeof p ===
              'object'
        );

      if (
        validProducts.length ===
        0
      ) {
        localStorage.removeItem(
          STORAGE_KEY
        );

        return getSeedProducts();
      }

      return validProducts
        .map((p) => {
          if (!p || !p.id) {
            return null;
          }

          const seed =
            seedById.get(
              String(p.id)
            );

          if (!seed) {
            return {
              ...p,
              id: String(p.id),
            };
          }

          return {
            ...seed,
            ...p,

            id: String(p.id),

            image: p.customImage
              ? p.image
              : seed.image,

            extra: {
              ...seed.extra,
              ...p.extra,

              metalImages:
                p.customImage
                  ? p.extra
                      ?.metalImages
                  : seed.extra
                      ?.metalImages,
            },
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.warn(
        '[ProductsContext] Error reading stored products:',
        error
      );

      try {
        localStorage.removeItem(
          STORAGE_KEY
        );
      } catch {
        /* ignore */
      }

      return getSeedProducts();
    }
  };

const readStoredActivity =
  () => {
    try {
      const raw =
        localStorage.getItem(
          ACTIVITY_KEY
        );

      const parsed =
        raw
          ? JSON.parse(raw)
          : [];

      return Array.isArray(
        parsed
      )
        ? parsed
        : [];
    } catch {
      return [];
    }
  };

/* =========================================================
   DATE HELPERS
========================================================= */

const FA_MONTH =
  new Intl.DateTimeFormat(
    'fa-IR-u-ca-persian',
    {
      month: 'long',
    }
  );

const monthLabel = (
  date
) => {
  try {
    return FA_MONTH.format(
      date
    );
  } catch {
    return date.toLocaleDateString(
      'fa-IR',
      {
        month: 'long',
      }
    );
  }
};

/* =========================================================
   PROVIDER
========================================================= */

export function ProductsProvider({
  children,
}) {
  const [products, setProducts] =
    useState([]);

  const [activity, setActivity] =
    useState(
      readStoredActivity
    );

  /* =======================================================
     ADMIN AUTH STATE
  ======================================================= */

  const [
    isAdminAuthed,
    setIsAdminAuthed,
  ] = useState(false);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  /* =======================================================
     CHECK SUPABASE AUTH SESSION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const checkAdminSession =
      async () => {
        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!mounted) return;

        if (!session?.user) {
          setIsAdminAuthed(
            false
          );

          setAuthLoading(
            false
          );

          return;
        }

        const {
          data:
            adminProfile,
          error:
            adminError,
        } =
          await supabase
            .from(
              'admin_profiles'
            )
            .select(
              'user_id'
            )
            .eq(
              'user_id',
              session.user.id
            )
            .maybeSingle();

        if (!mounted) return;

        if (adminError) {
          console.error(
            '[ProductsContext] Failed to verify admin profile:',
            adminError
          );

          setIsAdminAuthed(
            false
          );
        } else {
          setIsAdminAuthed(
            !!adminProfile
          );
        }

        setAuthLoading(
          false
        );
      };

    checkAdminSession();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        () => {
          checkAdminSession();
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadProducts =
      async () => {
        try {
          const data =
            await fetchProductsFromSupabase();

          if (!cancelled) {
            setProducts(data);

            console.log(
              '[ProductsContext] Products loaded from Supabase:',
              data.length
            );
          }
        } catch (error) {
          console.error(
            '[ProductsContext] Could not load products from Supabase.',
            error
          );
        }
      };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     LEGACY LOCAL STORAGE
     فعلاً برای جلوگیری از تغییرات ناگهانی نگه داشته شده.
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
      );
    } catch (err) {
      console.warn(
        '[luxury-jewel] could not persist catalog:',
        err?.message
      );
    }
  }, [products]);

  useEffect(() => {
    const onStorage = (
      e
    ) => {
      if (
        e.key ===
          STORAGE_KEY &&
        e.newValue
      ) {
        try {
          const next =
            JSON.parse(
              e.newValue
            );

          if (
            Array.isArray(
              next
            )
          ) {
            setProducts(
              next
            );
          }
        } catch {
          /* ignore */
        }
      }
    };

    addEventListener(
      'storage',
      onStorage
    );

    return () => {
      removeEventListener(
        'storage',
        onStorage
      );
    };
  }, []);

  /* =======================================================
     ACTIVITY STORAGE
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        ACTIVITY_KEY,
        JSON.stringify(
          activity.slice(0, 50)
        )
      );
    } catch {
      /* storage full */
    }
  }, [activity]);

  /* =======================================================
     ACTIVITY
  ======================================================= */

  const logActivity =
    useCallback(
      (
        type,
        productName
      ) => {
        setActivity(
          (prev) =>
            [
              {
                id: `${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 6)}`,

                type,

                productName,

                at: Date.now(),
              },

              ...prev,
            ].slice(0, 50)
        );
      },
      []
    );

  /* =======================================================
     ADD PRODUCT → SUPABASE
  ======================================================= */

  const addProduct =
    useCallback(
      async (product) => {
        const ready = {
          ...blankProduct(
            product.section
          ),

          ...product,

          id: String(
            product.id
          ),

          createdAt:
            Date.now(),

          updatedAt:
            Date.now(),
        };

        const row =
          toSupabaseProduct(
            ready
          );

        const {
          data,
          error,
        } =
          await supabase
            .from('products')
            .insert(row)
            .select('*')
            .single();

        if (error) {
          console.error(
            '[ProductsContext] Failed to add product:',
            error
          );

          throw error;
        }

        const saved =
          fromSupabaseProduct(
            data
          );

        if (!saved) {
          throw new Error(
            'محصول از Supabase دریافت نشد.'
          );
        }

        setProducts(
          (prev) => [
            saved,
            ...prev,
          ]
        );

        logActivity(
          'add',
          saved.name ||
            'محصول بدون نام'
        );

        return saved;
      },
      [logActivity]
    );

  /* =======================================================
     UPDATE PRODUCT → SUPABASE
  ======================================================= */

  const updateProduct =
    useCallback(
      async (
        id,
        patch
      ) => {
        const key =
          String(id);

        const existing =
          products.find(
            (p) =>
              p &&
              String(p.id) ===
                key
          );

        if (!existing) {
          throw new Error(
            'محصول موردنظر پیدا نشد.'
          );
        }

        const updated = {
          ...existing,
          ...patch,

          id: key,

          updatedAt:
            Date.now(),
        };

        const row =
          toSupabaseProduct(
            updated
          );

        const {
          data,
          error,
        } =
          await supabase
            .from('products')
            .update(row)
            .eq(
              'id',
              key
            )
            .select('*')
            .single();

        if (error) {
          console.error(
            '[ProductsContext] Failed to update product:',
            error
          );

          throw error;
        }

        const saved =
          fromSupabaseProduct(
            data
          );

        if (!saved) {
          throw new Error(
            'محصول به‌روزشده از Supabase دریافت نشد.'
          );
        }

        setProducts(
          (prev) =>
            prev.map(
              (p) =>
                p &&
                String(
                  p.id
                ) === key
                  ? saved
                  : p
            )
        );

        logActivity(
          'update',
          saved.name ||
            'محصول'
        );

        return saved;
      },
      [products, logActivity]
    );

  /* =======================================================
     DELETE PRODUCT → SUPABASE
  ======================================================= */

  const deleteProduct =
    useCallback(
      async (id) => {
        const key =
          String(id);

        const target =
          products.find(
            (p) =>
              p &&
              String(p.id) ===
                key
          );

        if (!target) {
          throw new Error(
            'محصول موردنظر پیدا نشد.'
          );
        }

        const {
          error,
        } =
          await supabase
            .from('products')
            .delete()
            .eq(
              'id',
              key
            );

        if (error) {
          console.error(
            '[ProductsContext] Failed to delete product:',
            error
          );

          throw error;
        }

        setProducts(
          (prev) =>
            prev.filter(
              (p) =>
                p &&
                String(
                  p.id
                ) !== key
            )
        );

        logActivity(
          'delete',
          target.name ||
            'محصول'
        );
      },
      [products, logActivity]
    );

  /* =======================================================
     TOGGLE ACTIVE → SUPABASE
  ======================================================= */

  const toggleActive =
    useCallback(
      async (id) => {
        const key =
          String(id);

        const target =
          products.find(
            (p) =>
              p &&
              String(p.id) ===
                key
          );

        if (!target) {
          throw new Error(
            'محصول موردنظر پیدا نشد.'
          );
        }

        const nextActive =
          !target.active;

        const {
          data,
          error,
        } =
          await supabase
            .from('products')
            .update({
              active:
                nextActive,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              key
            )
            .select('*')
            .single();

        if (error) {
          console.error(
            '[ProductsContext] Failed to toggle active:',
            error
          );

          throw error;
        }

        const saved =
          fromSupabaseProduct(
            data
          );

        setProducts(
          (prev) =>
            prev.map(
              (p) =>
                p &&
                String(
                  p.id
                ) === key
                  ? saved
                  : p
            )
        );

        logActivity(
          nextActive
            ? 'activate'
            : 'deactivate',

          saved?.name ||
            target.name ||
            'محصول'
        );

        return saved;
      },
      [products, logActivity]
    );

  /* =======================================================
     TOGGLE FEATURED → SUPABASE
  ======================================================= */

  const toggleFeatured =
    useCallback(
      async (id) => {
        const key =
          String(id);

        const target =
          products.find(
            (p) =>
              p &&
              String(p.id) ===
                key
          );

        if (!target) {
          throw new Error(
            'محصول موردنظر پیدا نشد.'
          );
        }

        const nextFeatured =
          !target.featured;

        const {
          data,
          error,
        } =
          await supabase
            .from('products')
            .update({
              featured:
                nextFeatured,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              key
            )
            .select('*')
            .single();

        if (error) {
          console.error(
            '[ProductsContext] Failed to toggle featured:',
            error
          );

          throw error;
        }

        const saved =
          fromSupabaseProduct(
            data
          );

        setProducts(
          (prev) =>
            prev.map(
              (p) =>
                p &&
                String(
                  p.id
                ) === key
                  ? saved
                  : p
            )
        );

        logActivity(
          nextFeatured
            ? 'featured'
            : 'unfeatured',

          saved?.name ||
            target.name ||
            'محصول'
        );

        return saved;
      },
      [products, logActivity]
    );

  /* =======================================================
     RESET
     فعلاً به seed محلی برمی‌گردد.
     در مرحله بعد برای Supabase بازنویسی می‌شود.
  ======================================================= */

  const resetToDefaults =
    useCallback(
      () => {
        setProducts(
          getSeedProducts()
        );

        setActivity([]);

        try {
          localStorage.removeItem(
            STORAGE_KEY
          );

          localStorage.removeItem(
            ACTIVITY_KEY
          );
        } catch {
          /* ignore */
        }
      },
      []
    );

  /* =======================================================
     EXPORT
  ======================================================= */

  const exportJSON =
    useCallback(
      () => {
        const payload = {
          app:
            'luxury-jewel',

          version: 1,

          exportedAt:
            new Date().toISOString(),

          products,
        };

        const blob =
          new Blob(
            [
              JSON.stringify(
                payload,
                null,
                2
              ),
            ],
            {
              type:
                'application/json',
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            'a'
          );

        a.href = url;

        a.download =
          `luxury-jewel-products-${new Date()
            .toISOString()
            .slice(0, 10)}.json`;

        a.click();

        URL.revokeObjectURL(
          url
        );
      },
      [products]
    );

  /* =======================================================
     IMPORT
     فعلاً state only است.
     بعداً به Supabase وصل می‌شود.
  ======================================================= */

  const importJSON =
    useCallback(
      async (file) => {
        const text =
          await file.text();

        const parsed =
          JSON.parse(text);

        const list =
          Array.isArray(
            parsed
          )
            ? parsed
            : parsed?.products;

        if (
          !Array.isArray(
            list
          ) ||
          list.length === 0
        ) {
          throw new Error(
            'فایل معتبر نیست: هیچ محصولی پیدا نشد.'
          );
        }

        setProducts(
          list.map(
            (p) => ({
              ...blankProduct(
                p.section ||
                  'collection'
              ),

              ...p,

              id: String(
                p.id ??
                  Date.now()
              ),
            })
          )
        );

        setActivity([]);
      },
      []
    );

  /* =======================================================
     REPORTING
  ======================================================= */

  const getStats =
    useCallback(
      () => {
        const validProducts =
          Array.isArray(
            products
          )
            ? products.filter(
                (p) =>
                  p !== null &&
                  p !== undefined &&
                  typeof p ===
                    'object'
              )
            : [];

        const total =
          validProducts.length;

        const active =
          validProducts.filter(
            (p) =>
              p.active !== false
          ).length;

        const featured =
          validProducts.filter(
            (p) =>
              p.featured === true
          ).length;

        const totalValue =
          validProducts.reduce(
            (sum, p) =>
              sum +
              (Number(
                p.price
              ) || 0) *
                (Number(
                  p.stock
                ) || 0),

            0
          );

        const priceSum =
          validProducts.reduce(
            (sum, p) =>
              sum +
              (Number(
                p.price
              ) || 0),

            0
          );

        const weekAgo =
          Date.now() -
          7 *
            86400000;

        const byCategory =
          Object.keys(
            CATEGORY_LABELS ||
              {}
          ).reduce(
            (
              acc,
              key
            ) => {
              acc[key] =
                validProducts.filter(
                  (p) =>
                    p.category ===
                    key
                ).length;

              return acc;
            },
            {}
          );

        return {
          total,

          active,

          featured,

          totalValue,

          avgPrice:
            total
              ? Math.round(
                  priceSum /
                    total
                )
              : 0,

          byCategory,

          addedThisWeek:
            validProducts.filter(
              (p) =>
                (p.createdAt ||
                  0) >=
                weekAgo
            ).length,
        };
      },
      [products]
    );

  const getActivity =
    useCallback(
      (limit = 6) =>
        activity.slice(
          0,
          limit
        ),
      [activity]
    );

  const getMonthlyTrend =
    useCallback(
      (months = 6) => {
        const out = [];

        const now =
          new Date();

        const validProducts =
          Array.isArray(
            products
          )
            ? products.filter(
                (p) =>
                  p !== null &&
                  p !== undefined &&
                  typeof p ===
                    'object'
              )
            : [];

        for (
          let i =
            months - 1;
          i >= 0;
          i -= 1
        ) {
          const end =
            new Date(
              now.getFullYear(),
              now.getMonth() -
                i +
                1,
              0,
              23,
              59,
              59
            ).getTime();

          const upTo =
            validProducts.filter(
              (p) =>
                (p.createdAt ||
                  0) <= end
            );

          out.push({
            label:
              monthLabel(
                new Date(
                  now.getFullYear(),
                  now.getMonth() -
                    i,
                  1
                )
              ),

            count:
              upTo.length,

            value:
              upTo.reduce(
                (
                  sum,
                  p
                ) =>
                  sum +
                  (Number(
                    p.price
                  ) || 0) *
                    (Number(
                      p.stock
                    ) || 0),

                0
              ),
          });
        }

        return out;
      },
      [products]
    );

  /* =======================================================
     SUPABASE AUTH
  ======================================================= */

  const loginAdmin =
    useCallback(
      async (
        email,
        password
      ) => {
        const {
          data: {
            user,
          },
          error:
            signInError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                String(
                  email
                ).trim(),

              password:
                String(
                  password
                ),
            }
          );

        if (signInError) {
          console.error(
            '[ProductsContext] Admin login failed:',
            signInError
          );

          return {
            ok: false,
            error:
              signInError,
          };
        }

        if (!user) {
          return {
            ok: false,

            error:
              new Error(
                'کاربر احراز هویت نشد.'
              ),
          };
        }

        const {
          data:
            adminProfile,
          error:
            adminError,
        } =
          await supabase
            .from(
              'admin_profiles'
            )
            .select(
              'user_id'
            )
            .eq(
              'user_id',
              user.id
            )
            .maybeSingle();

        if (adminError) {
          console.error(
            '[ProductsContext] Failed to verify admin profile:',
            adminError
          );

          await supabase.auth.signOut();

          return {
            ok: false,

            error:
              adminError,
          };
        }

        if (!adminProfile) {
          await supabase.auth.signOut();

          return {
            ok: false,

            error:
              new Error(
                'این حساب دسترسی ادمین ندارد.'
              ),
          };
        }

        setIsAdminAuthed(
          true
        );

        return {
          ok: true,

          user,
        };
      },
      []
    );

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logoutAdmin =
    useCallback(
      async () => {
        const {
          error,
        } =
          await supabase.auth.signOut();

        if (error) {
          console.error(
            '[ProductsContext] Admin logout failed:',
            error
          );
        }

        setIsAdminAuthed(
          false
        );
      },
      []
    );

  /* =======================================================
     STOREFRONT PROJECTIONS
  ======================================================= */

  const featuredProducts =
    useMemo(() => {
      try {
        return selectFeatured(
          products || []
        );
      } catch (error) {
        console.warn(
          'Error in selectFeatured:',
          error
        );

        return [];
      }
    }, [products]);

  const luxuryProducts =
    useMemo(() => {
      try {
        return selectLuxury(
          products || []
        );
      } catch (error) {
        console.warn(
          'Error in selectLuxury:',
          error
        );

        return [];
      }
    }, [products]);

  const discountProducts =
    useMemo(() => {
      try {
        return selectDiscount(
          products || []
        );
      } catch (error) {
        console.warn(
          'Error in selectDiscount:',
          error
        );

        return [];
      }
    }, [products]);

  const collectionProducts =
    useMemo(() => {
      try {
        return selectCollection(
          products || []
        );
      } catch (error) {
        console.warn(
          'Error in selectCollection:',
          error
        );

        return [];
      }
    }, [products]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({
        products:
          products || [],

        categoryLabels:
          CATEGORY_LABELS,

        sectionLabels:
          SECTION_LABELS,

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

        authLoading,

        loginAdmin,

        logoutAdmin,

        featuredProducts:
          featuredProducts || [],

        luxuryProducts:
          luxuryProducts || [],

        discountProducts:
          discountProducts || [],

        collectionProducts:
          collectionProducts || [],
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

        authLoading,

        loginAdmin,

        logoutAdmin,

        featuredProducts,

        luxuryProducts,

        discountProducts,

        collectionProducts,
      ]
    );

  return (
    <ProductsContext.Provider
      value={value}
    >
      {children}
    </ProductsContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export const useProducts =
  () => {
    const ctx =
      useContext(
        ProductsContext
      );

    if (!ctx) {
      throw new Error(
        'useProducts must be used inside <ProductsProvider>'
      );
    }

    return ctx;
  };

export default ProductsContext;

