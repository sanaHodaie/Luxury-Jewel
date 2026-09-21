import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, CreditCard, ShieldAlert } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useCart, parsePrice, formatPrice } from '../../contexts/CartContext';
import styles from './InvoiceModal.module.css';

export const InvoiceModal = ({ isOpen, onClose }) => {
  const { cartItems, totalPriceFormatted, clearCart } = useCart();
  
  // رفرنس برای کامپوننتی که قرار است پرینت شود
  const printRef = useRef();

  // هندلر پرینت با react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${new Date().getTime()}`,
  });

  const invoiceNumber = useMemo(() => {
    return `LJ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  }, [isOpen]);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('fa-IR');

  const handlePayment = () => {
    alert('در حال انتقال به درگاه امن پرداخت بانکی (شاپرک)...');
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Close Button */}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="بستن پیش‌فاکتور"
          >
            <X size={18} />
          </button>

          {/* این بخش دقیقاً همان چیزی است که چاپ می‌شود (پدر printRef) */}
          <div className={styles.modalScrollContainer} ref={printRef}>
            {/* Invoice Brand & Meta Header */}
            <div className={styles.invoiceHeader}>
              <div className={styles.brandBlock}>
                <span className={styles.brandLogo}>💎</span>
                <div>
                  <h3 className={styles.brandTitle}>گالری طلا و جواهر لوکس ژوئل</h3>
                  <p className={styles.brandSub}>Luxury Jewel Official Proforma Invoice</p>
                </div>
              </div>

              <div className={styles.invoiceMeta}>
                <div>شماره پیش‌فاکتور: <span className={styles.metaHighlight}>{invoiceNumber}</span></div>
                <div>تاریخ صدور: <span className={styles.metaHighlight}>{todayStr}</span></div>
                <div>مشتری: <span className={styles.metaHighlight}>خریدار محترم (پیش‌فاکتور آنلاین)</span></div>
              </div>
            </div>

            {/* Prominent Status Banner */}
            <div className={styles.statusBanner}>
              <ShieldAlert size={24} className={styles.statusIcon} />
              <div>
                <div className={styles.statusText}>
                  ⚠️ سفارش در صف پرداخت و نهایی شدن قرار دارد
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  این سند پیش‌فاکتور موقت خریدهای شماست و پس از پرداخت آنلاین، ثبت نهایی و کد پیگیری صادر می‌شود.
                </div>
              </div>
            </div>

            {/* Table Listing Cart Products */}
            <div className={styles.tableWrapper}>
              <table className={styles.invoiceTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>شرح کالا / زیورآلات</th>
                    <th>تعداد</th>
                    <th>قیمت واحد (تومان)</th>
                    <th>قیمت کل (تومان)</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                        هیچ محصولی در پیش‌فاکتور موجود نیست.
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item, idx) => {
                      const unitPriceNum = parsePrice(item.price);
                      const itemTotalNum = unitPriceNum * item.quantity;
                      const itemTotalFormatted = formatPrice(itemTotalNum);

                      return (
                        <tr key={item.id || idx}>
                          <td>{formatPrice(idx + 1)}</td>
                          <td>
                            <div className={styles.productCell}>
                              {item.image && (
                                <img src={item.image} alt={item.name} className={styles.productThumb} />
                              )}
                              <div>
                                <div style={{ fontWeight: 700 }}>{item.name}</div>
                                {item.purity && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.purity}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{formatPrice(item.quantity)} عدد</td>
                          <td>{item.price}</td>
                          <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{itemTotalFormatted}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Box */}
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>مجموع ارزش کالاها:</span>
                <span style={{ fontWeight: 700 }}>{totalPriceFormatted} تومان</span>
              </div>
              <div className={styles.summaryRow}>
                <span>مالیات بر ارزش افزوده و عوارض:</span>
                <span>۰ تومان (محاسبه در قیمت)</span>
              </div>
              <div className={styles.summaryRow}>
                <span>هزینه بسته بندی و ارسال بیمه‌شده:</span>
                <span style={{ color: '#2ec4b6', fontWeight: 700 }}>رایگان (هدیه گالری)</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className={styles.totalPrice}>{totalPriceFormatted} تومان</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className={styles.invoiceFooterNotice}>
              <strong>یادداشت گالری ژوئل:</strong> تمام زیورآلات و طلاهای ارائه شده دارای شناسنامه معتبر و عیار ۱۸ است. پس از تایید نهایی و پرداخت، مرسوله همراه با فاکتور رسمی مهر شده ارسال می‌گردد.
            </div>

            {/* Interactive Actions (با کلاس no-print تا در چاپ نیافتد) */}
            <div className={`${styles.actionsBar} no-print`}>
              <button
                type="button"
                className={styles.printBtn}
                onClick={() => handlePrint()}
              >
                <Printer size={18} />
                <span>دانلود / چاپ پیش‌فاکتور (PDF)</span>
              </button>

              <button
                type="button"
                className={styles.payBtn}
                onClick={handlePayment}
              >
                <CreditCard size={18} />
                <span>تکمیل خرید و پرداخت آنلاین</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvoiceModal;