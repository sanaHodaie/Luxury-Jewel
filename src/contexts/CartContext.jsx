import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const englishStr = priceStr
    .toString()
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[^0-9]/g, '');
  return parseInt(englishStr, 10) || 0;
};

export const formatPrice = (num) => {
  if (!num || isNaN(num)) return '۰';
  const formatted = Math.round(num).toLocaleString('en-US');
  return formatted.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [deleteToast, setDeleteToast] = useState({ show: false, message: '' });

  // Auto hide deletion toast after 10 seconds
  useEffect(() => {
    let timer;
    if (deleteToast.show) {
      timer = setTimeout(() => {
        setDeleteToast({ show: false, message: '' });
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [deleteToast.show]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find((item) => item.id === productId);
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    
    // Trigger center-screen 10-second deletion notice
    const itemName = itemToRemove?.name ? ` «${itemToRemove.name}»` : '';
    setDeleteToast({
      show: true,
      message: `محصول${itemName} با موفقیت از سبد خرید حذف شد.`,
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const hideDeleteToast = () => {
    setDeleteToast({ show: false, message: '' });
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalPriceNumber = cartItems.reduce((acc, item) => {
    const unitPrice = parsePrice(item.price);
    return acc + unitPrice * item.quantity;
  }, 0);

  const totalPriceFormatted = formatPrice(totalPriceNumber);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPriceNumber,
        totalPriceFormatted,
        deleteToast,
        hideDeleteToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      totalCount: 0,
      totalPriceNumber: 0,
      totalPriceFormatted: '۰',
      deleteToast: { show: false, message: '' },
      hideDeleteToast: () => {},
    };
  }
  return context;
};

export default CartContext;
