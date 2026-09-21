import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);
  
  const toggleWishlist = (item) => {
    setWishlist((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  // ✅ اضافه کردن تابع isInWishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ 
        wishlist, 
        isOpen, 
        openWishlist, 
        closeWishlist, 
        toggleWishlist,
        isInWishlist // ✅ اضافه کردن به value
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlist: [],
      isOpen: false,
      openWishlist: () => {},
      closeWishlist: () => {},
      toggleWishlist: () => {},
      isInWishlist: () => false,
    };
  }
  return context;
};

export default WishlistContext;