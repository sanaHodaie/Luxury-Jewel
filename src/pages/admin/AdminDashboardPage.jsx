// src/pages/admin/AdminDashboardPage.jsx
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Gem,
  CheckCircle2,
  Star,
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  RotateCcw,
  ImageIcon,
  Sparkles,
  BarChart3,
  Layers,
  TrendingUp,
  Clock,
  Database,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useProducts } from '../../contexts/ProductsContext';
import StatCard from '../../components/admin/StatCard';
import styles from './AdminDashboardPage.module.css';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const DONUT_COLORS = [
  'rgba(99, 102, 241, 0.85)',
  'rgba(16, 185, 129, 0.85)',
  'rgba(245, 158, 11, 0.85)',
  'rgba(236, 72, 153, 0.85)',
  'rgba(6, 182, 212, 0.85)',
];

const ACTIVITY_META = {
  add: { icon: PlusCircle, color: '#059669', text: 'اضافه شد' },
  update: { icon: Pencil, color: '#4f46e5', text: 'ویرایش شد' },
  delete: { icon: Trash2, color: '#dc2626', text: 'حذف شد' },
  activate: { icon: Eye, color: '#059669', text: 'در فروشگاه فعال شد' },
  deactivate: { icon: EyeOff, color: '#6b7280', text: 'از فروشگاه مخفی شد' },
};

function timeAgoFa(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'همین الان';
  if (min < 60) return `${min} دقیقه پیش`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ساعت پیش`;
  const day = Math.floor(hr / 24);
  return `${day} روز پیش`;
}

const CustomTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className={styles.chartTooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        {mode === 'value'
          ? `${Number(v).toLocaleString('fa-IR')} تومان`
          : `${v.toLocaleString('fa-IR')} محصول`}
      </p>
    </div>
  );
};

export default function AdminDashboardPage() {
  const {
    getStats,
    categoryLabels,
    getActivity,
    getMonthlyTrend,
    products,
    exportJSON,
    importJSON,
    resetToDefaults,
  } = useProducts();

  const stats = getStats();
  const trend = getMonthlyTrend(6);
  const activity = getActivity(6);
  const [chartMode, setChartMode] = useState('count');

  const withImagePercent = products.length
    ? Math.round(
        (products.filter((p) => p.image).length / products.length) * 100
      )
    : 0;
  const activePercent = stats.total
    ? Math.round((stats.active / stats.total) * 100)
    : 0;
  const featuredPercent = stats.total
    ? Math.round((stats.featured / stats.total) * 100)
    : 0;

  const donutData = Object.entries(stats.byCategory)
    .map(([key, count], idx) => ({
      name: categoryLabels[key] || key,
      value: count,
      color: DONUT_COLORS[idx % DONUT_COLORS.length],
    }))
    .filter((d) => d.value > 0);
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .slice(0, 5),
    [products]
  );

  const totalValueSpark = trend.map((t) => ({ v: t.value }));
  const totalCountSpark = trend.map((t) => ({ v: t.count }));

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importJSON(file);
      alert('داده با موفقیت وارد شد.');
    } catch (err) {
      alert(err.message || 'وارد کردن فایل با خطا مواجه شد.');
    }
    e.target.value = '';
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
        transition={{ duration: 0.45 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerBadge}>
            <Sparkles size={14} />
            <span>پنل مدیریت محتوا</span>
          </div>
          <h1 className={styles.headerTitle}>داشبورد</h1>
          <p className={styles.headerDescription}>
            خوش اومدی! خلاصه‌ی وضعیت فروشگاه جواهرات لوکس‌ژوئل رو اینجا
            می‌بینی.
          </p>

          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {activePercent}٪ محصولات فعال
            </span>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          STATS GRID
      ===================================================== */}
      <motion.div
        className={styles.statsGrid}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <StatCard
            icon={<Wallet size={19} />}
            color="gold"
            label="ارزش کل موجودی"
            value={stats.totalValue}
            sub={`میانگین قیمت: ${stats.avgPrice.toLocaleString(
              'fa-IR'
            )} تومان`}
            sparkData={totalValueSpark}
            format={(n) => `${Math.round(n).toLocaleString('fa-IR')}`}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            icon={<Gem size={19} />}
            color="accent"
            label="تعداد کل محصولات"
            value={stats.total}
            sub={
              stats.addedThisWeek > 0
                ? `+${stats.addedThisWeek} این هفته`
                : 'بدون افزودن جدید این هفته'
            }
            sparkData={totalCountSpark}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            icon={<CheckCircle2 size={19} />}
            color="teal"
            label="محصولات فعال در فروشگاه"
            value={stats.active}
            sub={`${activePercent}% از کل محصولات`}
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            icon={<Star size={19} />}
            color="navy"
            label="محصولات ویژه"
            value={stats.featured}
            sub={`${featuredPercent}% از کل محصولات`}
          />
        </motion.div>
      </motion.div>

      {/* =====================================================
          MAIN ROW — CHART + DONUT
      ===================================================== */}
      <div className={styles.mainRow}>
        <motion.section
          className={`${styles.section} ${styles.overviewCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <div className={`${styles.sectionIcon} ${styles.iconTone_indigo}`}>
                <TrendingUp size={20} />
              </div>
              <div className={styles.sectionHeaderContent}>
                <h2 className={styles.sectionTitle}>روند فروشگاه</h2>
                <p className={styles.sectionDescription}>
                  بر اساس تاریخ افزوده‌شدن محصولات، طی ۶ ماه اخیر
                </p>
              </div>
            </div>

            <div className={styles.tabSwitch}>
              <button
                type="button"
                className={chartMode === 'count' ? styles.tabActive : styles.tab}
                onClick={() => setChartMode('count')}
              >
                تعداد محصولات
              </button>
              <button
                type="button"
                className={chartMode === 'value' ? styles.tabActive : styles.tab}
                onClick={() => setChartMode('value')}
              >
                ارزش موجودی
              </button>
            </div>
          </div>

          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={trend}
                margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
              >
                <defs>
                  <linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 6"
                  stroke="rgba(139, 92, 246, 0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip mode={chartMode} />} />
                <Area
                  type="monotone"
                  dataKey={chartMode}
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#overviewFill)"
                  isAnimationActive
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          className={`${styles.section} ${styles.donutCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <div className={`${styles.sectionIcon} ${styles.iconTone_amber}`}>
                <BarChart3 size={20} />
              </div>
              <div className={styles.sectionHeaderContent}>
                <h2 className={styles.sectionTitle}>دسته‌بندی محصولات</h2>
                <p className={styles.sectionDescription}>
                  سهم هر دسته از کل کاتالوگ
                </p>
              </div>
            </div>
          </div>

          <div className={styles.donutWrap}>
            {/* ✨ حلقه شیشه‌ای پشت دونات */}
            <div className={styles.donutGlassRing} />

            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                {/* حلقه پس‌زمینه شیشه‌ای */}
                <Pie
                  data={[{ value: 1 }]}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={74}
                  fill="rgba(139, 92, 246, 0.06)"
                  stroke="none"
                  isAnimationActive={false}
                />

                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={4}
                  cornerRadius={6}
                  isAnimationActive
                  animationDuration={900}
                  style={{
                    filter:
                      'drop-shadow(0 6px 14px rgba(99, 102, 241, 0.25))',
                  }}
                >
                  {donutData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.color}
                      stroke="rgba(255, 255, 255, 0.6)"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* مرکز شیشه‌ای */}
            <div className={styles.donutCenter}>
              <div className={styles.donutCenterInner}>
                <span className={styles.donutTotal}>{donutTotal}</span>
                <span className={styles.donutLabel}>محصول</span>
              </div>
            </div>
          </div>

          <div className={styles.legend}>
            {donutData.map((d) => (
              <div key={d.name} className={styles.legendRow}>
                <span
                  className={styles.legendDot}
                  style={{
                    background: d.color,
                    boxShadow: `0 0 10px ${d.color}`,
                  }}
                />
                <span className={styles.legendName}>{d.name}</span>
                <span className={styles.legendValue}>
                  {donutTotal
                    ? Math.round((d.value / donutTotal) * 100)
                    : 0}
                  ٪
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* =====================================================
          GOALS
      ===================================================== */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <div className={`${styles.sectionIcon} ${styles.iconTone_emerald}`}>
              <Layers size={20} />
            </div>
            <div className={styles.sectionHeaderContent}>
              <h2 className={styles.sectionTitle}>سلامت کاتالوگ</h2>
              <p className={styles.sectionDescription}>
                معیارهای کیفی محصولات فروشگاه
              </p>
            </div>
          </div>
        </div>

        <div className={styles.goals}>
          <GoalBar
            label="محصولات فعال در فروشگاه"
            percent={activePercent}
            valueText={`${stats.active} از ${stats.total}`}
            color="#10b981"
          />
          <GoalBar
            label="محصولات دارای تصویر"
            percent={withImagePercent}
            valueText={`${products.filter((p) => p.image).length} از ${
              stats.total
            }`}
            color="#8b5cf6"
          />
          <GoalBar
            label="محصولات ویژه (Featured)"
            percent={featuredPercent}
            valueText={`${stats.featured} از ${stats.total}`}
            color="#f59e0b"
          />
        </div>
      </motion.section>

      {/* =====================================================
          RECENT PRODUCTS + ACTIVITY
      ===================================================== */}
      <div className={styles.bottomRow}>
        <motion.section
          className={`${styles.section} ${styles.tableCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <div className={`${styles.sectionIcon} ${styles.iconTone_violet}`}>
                <Gem size={20} />
              </div>
              <div className={styles.sectionHeaderContent}>
                <h2 className={styles.sectionTitle}>محصولات اخیر</h2>
                <p className={styles.sectionDescription}>
                  آخرین محصولات ویرایش یا اضافه‌شده
                </p>
              </div>
            </div>
          </div>

          {recentProducts.length === 0 ? (
            <p className={styles.emptyHint}>هنوز محصولی ثبت نشده.</p>
          ) : (
            <div className={styles.recentList}>
              {recentProducts.map((p) => (
                <div key={p.id} className={styles.recentRow}>
                  <div className={styles.recentThumb}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <ImageIcon size={16} />
                    )}
                  </div>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentName}>{p.name}</span>
                    <span className={styles.recentMeta}>
                      {categoryLabels[p.category] || p.category}
                    </span>
                  </div>
                  <span
                    className={`${styles.statusChip} ${
                      p.active ? styles.chipOn : styles.chipOff
                    }`}
                  >
                    {p.active ? 'فعال' : 'مخفی'}
                  </span>
                  <span className={styles.recentPrice}>
                    {Number(p.price).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          className={`${styles.section} ${styles.activityCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.36 }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <div className={`${styles.sectionIcon} ${styles.iconTone_sky}`}>
                <Clock size={20} />
              </div>
              <div className={styles.sectionHeaderContent}>
                <h2 className={styles.sectionTitle}>فعالیت‌های اخیر</h2>
                <p className={styles.sectionDescription}>
                  آخرین تغییرات ثبت‌شده در پنل
                </p>
              </div>
            </div>
          </div>

          {activity.length === 0 ? (
            <p className={styles.emptyHint}>هنوز فعالیتی ثبت نشده.</p>
          ) : (
            <div className={styles.activityList}>
              {activity.map((a) => {
                const meta = ACTIVITY_META[a.type] || ACTIVITY_META.update;
                const Icon = meta.icon;
                return (
                  <div key={a.id} className={styles.activityRow}>
                    <span
                      className={styles.activityIcon}
                      style={{
                        color: meta.color,
                        background: `${meta.color}1f`,
                      }}
                    >
                      <Icon size={14} />
                    </span>
                    <div className={styles.activityText}>
                      <span className={styles.activityMain}>
                        «{a.productName}» {meta.text}
                      </span>
                      <span className={styles.activityTime}>
                        {timeAgoFa(a.at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>

      {/* =====================================================
          BACKUP
      ===================================================== */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.42 }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <div className={`${styles.sectionIcon} ${styles.iconTone_rose}`}>
              <Database size={20} />
            </div>
            <div className={styles.sectionHeaderContent}>
              <h2 className={styles.sectionTitle}>پشتیبان‌گیری از داده</h2>
              <p className={styles.sectionDescription}>
                چون داده فقط در همین مرورگر ذخیره می‌شه، هر از گاهی خروجی
                JSON بگیر.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <motion.button
            whileHover={{ y: -2 }}
            type="button"
            className={styles.actionBtn}
            onClick={exportJSON}
          >
            <Download size={16} />
            <span>خروجی JSON</span>
          </motion.button>

          <motion.label whileHover={{ y: -2 }} className={styles.actionBtn}>
            <Upload size={16} />
            <span>وارد کردن JSON</span>
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              hidden
            />
          </motion.label>

          <motion.button
            whileHover={{ y: -2 }}
            type="button"
            className={`${styles.actionBtn} ${styles.dangerBtn}`}
            onClick={() => {
              if (
                window.confirm(
                  'همه‌ی محصولات فعلی پاک و به حالت اولیه برمی‌گردند. مطمئنی؟'
                )
              ) {
                resetToDefaults();
              }
            }}
          >
            <RotateCcw size={16} />
            <span>بازنشانی به حالت اولیه</span>
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}

function GoalBar({ label, percent, valueText, color }) {
  return (
    <div className={styles.goalItem}>
      <div className={styles.goalTop}>
        <span className={styles.goalLabel}>{label}</span>
        <span className={styles.goalPercent}>{percent}٪</span>
      </div>
      <div className={styles.goalTrack}>
        <motion.div
          className={styles.goalFill}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className={styles.goalValueText}>{valueText}</span>
    </div>
  );
}