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
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const DONUT_COLORS = ['#c98a5a', '#2fb3a3', '#3b5bdb', '#c9971f'];

const ACTIVITY_META = {
  add: { icon: PlusCircle, color: '#3ba35a', text: 'اضافه شد' },
  update: { icon: Pencil, color: '#3b5bdb', text: 'ویرایش شد' },
  delete: { icon: Trash2, color: '#e05a5a', text: 'حذف شد' },
  activate: { icon: Eye, color: '#3ba35a', text: 'در فروشگاه فعال شد' },
  deactivate: { icon: EyeOff, color: '#8a8a8a', text: 'از فروشگاه مخفی شد' },
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
        {mode === 'value' ? `${Number(v).toLocaleString('fa-IR')} تومان` : `${v.toLocaleString('fa-IR')} محصول`}
      </p>
    </div>
  );
};

export default function AdminDashboardPage() {
  const { getStats, categoryLabels, getActivity, getMonthlyTrend, products, exportJSON, importJSON, resetToDefaults } =
    useProducts();

  const stats = getStats();
  const trend = getMonthlyTrend(6);
  const activity = getActivity(6);
  const [chartMode, setChartMode] = useState('count'); // 'count' | 'value'

  const withImagePercent = products.length
    ? Math.round((products.filter((p) => p.image).length / products.length) * 100)
    : 0;
  const activePercent = stats.total ? Math.round((stats.active / stats.total) * 100) : 0;
  const featuredPercent = stats.total ? Math.round((stats.featured / stats.total) * 100) : 0;

  const donutData = Object.entries(stats.byCategory)
    .map(([key, count], idx) => ({
      name: categoryLabels[key] || key,
      value: count,
      color: DONUT_COLORS[idx % DONUT_COLORS.length],
    }))
    .filter((d) => d.value > 0);
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);

  const recentProducts = useMemo(
    () => [...products].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 5),
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
    <div>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <h1 className={styles.title}>داشبورد</h1>
          <p className={styles.subtitle}>خوش اومدی! خلاصه‌ی وضعیت فروشگاه جواهرات لوکس‌ژوئل رو اینجا می‌بینی.</p>
        </div>
      </motion.div>

      {/* ---------- کارت‌های آماری ---------- */}
      <motion.div className={styles.statsGrid} variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <StatCard
            icon={<Wallet size={19} />}
            color="gold"
            label="ارزش کل موجودی"
            value={stats.totalValue}
            sub={`میانگین قیمت: ${stats.avgPrice.toLocaleString('fa-IR')} تومان`}
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
            sub={stats.addedThisWeek > 0 ? `+${stats.addedThisWeek} این هفته` : 'بدون افزودن جدید این هفته'}
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

      {/* ---------- نمودار روند + دسته‌بندی ---------- */}
      <div className={styles.mainRow}>
        <motion.div
          className={`${styles.card} ${styles.overviewCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className={styles.cardHeaderRow}>
            <div>
              <h2 className={styles.cardTitle}>روند فروشگاه</h2>
              <p className={styles.cardHint}>بر اساس تاریخ افزوده‌شدن محصولات، طی ۶ ماه اخیر</p>
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
              <AreaChart data={trend} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip mode={chartMode} />} />
                <Area
                  type="monotone"
                  dataKey={chartMode}
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  fill="url(#overviewFill)"
                  isAnimationActive
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.donutCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <h2 className={styles.cardTitle}>دسته‌بندی محصولات</h2>
          <p className={styles.cardHint}>سهم هر دسته از کل کاتالوگ</p>

          <div className={styles.donutWrap}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={3}
                  isAnimationActive
                  animationDuration={800}
                >
                  {donutData.map((d, i) => (
                    <Cell key={d.name} fill={d.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.donutCenter}>
              <span className={styles.donutTotal}>{donutTotal}</span>
              <span className={styles.donutLabel}>محصول</span>
            </div>
          </div>

          <div className={styles.legend}>
            {donutData.map((d) => (
              <div key={d.name} className={styles.legendRow}>
                <span className={styles.legendDot} style={{ background: d.color }} />
                <span className={styles.legendName}>{d.name}</span>
                <span className={styles.legendValue}>
                  {donutTotal ? Math.round((d.value / donutTotal) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---------- اهداف ماهانه ---------- */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
      >
        <h2 className={styles.cardTitle}>سلامت کاتالوگ</h2>
        <p className={styles.cardHint}>معیارهای کیفی محصولات فروشگاه</p>

        <div className={styles.goals}>
          <GoalBar label="محصولات فعال در فروشگاه" percent={activePercent} valueText={`${stats.active} از ${stats.total}`} color="var(--chart-teal, #2fb3a3)" />
          <GoalBar label="محصولات دارای تصویر" percent={withImagePercent} valueText={`${products.filter((p) => p.image).length} از ${stats.total}`} color="var(--accent)" />
          <GoalBar label="محصولات ویژه (Featured)" percent={featuredPercent} valueText={`${stats.featured} از ${stats.total}`} color="#c9971f" />
        </div>
      </motion.div>

      {/* ---------- محصولات اخیر + فعالیت‌ها ---------- */}
      <div className={styles.bottomRow}>
        <motion.div
          className={`${styles.card} ${styles.tableCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <div className={styles.cardHeaderRow}>
            <div>
              <h2 className={styles.cardTitle}>محصولات اخیر</h2>
              <p className={styles.cardHint}>آخرین محصولات ویرایش یا اضافه‌شده</p>
            </div>
          </div>

          {recentProducts.length === 0 ? (
            <p className={styles.emptyHint}>هنوز محصولی ثبت نشده.</p>
          ) : (
            <div className={styles.recentList}>
              {recentProducts.map((p) => (
                <div key={p.id} className={styles.recentRow}>
                  <div className={styles.recentThumb}>
                    {p.image ? <img src={p.image} alt={p.name} /> : <ImageIcon size={16} />}
                  </div>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentName}>{p.name}</span>
                    <span className={styles.recentMeta}>{categoryLabels[p.category] || p.category}</span>
                  </div>
                  <span className={`${styles.statusChip} ${p.active ? styles.chipOn : styles.chipOff}`}>
                    {p.active ? 'فعال' : 'مخفی'}
                  </span>
                  <span className={styles.recentPrice}>{Number(p.price).toLocaleString('fa-IR')} تومان</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className={`${styles.card} ${styles.activityCard}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.36 }}
        >
          <h2 className={styles.cardTitle}>فعالیت‌های اخیر</h2>
          <p className={styles.cardHint}>آخرین تغییرات ثبت‌شده در پنل</p>

          {activity.length === 0 ? (
            <p className={styles.emptyHint}>هنوز فعالیتی ثبت نشده.</p>
          ) : (
            <div className={styles.activityList}>
              {activity.map((a) => {
                const meta = ACTIVITY_META[a.type] || ACTIVITY_META.update;
                const Icon = meta.icon;
                return (
                  <div key={a.id} className={styles.activityRow}>
                    <span className={styles.activityIcon} style={{ color: meta.color, background: `${meta.color}1f` }}>
                      <Icon size={14} />
                    </span>
                    <div className={styles.activityText}>
                      <span className={styles.activityMain}>
                        «{a.productName}» {meta.text}
                      </span>
                      <span className={styles.activityTime}>{timeAgoFa(a.at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ---------- پشتیبان‌گیری ---------- */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.42 }}
      >
        <h2 className={styles.cardTitle}>پشتیبان‌گیری از داده</h2>
        <p className={styles.cardHint}>چون داده فقط در همین مرورگر ذخیره می‌شه، هر از گاهی خروجی JSON بگیر.</p>
        <div className={styles.actionsRow}>
          <motion.button whileHover={{ y: -2 }} type="button" className={styles.actionBtn} onClick={exportJSON}>
            <Download size={16} />
            <span>خروجی JSON</span>
          </motion.button>
          <motion.label whileHover={{ y: -2 }} className={styles.actionBtn}>
            <Upload size={16} />
            <span>وارد کردن JSON</span>
            <input type="file" accept="application/json" onChange={handleImport} hidden />
          </motion.label>
          <motion.button
            whileHover={{ y: -2 }}
            type="button"
            className={`${styles.actionBtn} ${styles.dangerBtn}`}
            onClick={() => {
              if (window.confirm('همه‌ی محصولات فعلی پاک و به حالت اولیه برمی‌گردند. مطمئنی؟')) {
                resetToDefaults();
              }
            }}
          >
            <RotateCcw size={16} />
            <span>بازنشانی به حالت اولیه</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function GoalBar({ label, percent, valueText, color }) {
  return (
    <div className={styles.goalItem}>
      <div className={styles.goalTop}>
        <span className={styles.goalLabel}>{label}</span>
        <span className={styles.goalPercent}>{percent}%</span>
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
