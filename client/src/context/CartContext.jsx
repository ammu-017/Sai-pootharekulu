import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sai_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sai_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Unique identifier for items by id + packSize
  const getItemKey = (item) => `${item._id || item.product}-${item.packSize}`;

  const addToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          (item._id === product._id || item.product === product._id) &&
          item.packSize === product.packSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qtyToAdd;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            _id: product._id,
            product: product._id,
            name: product.name,
            category: product.category,
            packSize: product.packSize,
            pieces: product.pieces,
            price: Number(product.price),
            image: product.image,
            quantity: qtyToAdd,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, packSize, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId, packSize);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (
          (item._id === productId || item.product === productId) &&
          item.packSize === packSize
        ) {
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId, packSize) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            (item._id === productId || item.product === productId) &&
            item.packSize === packSize
          )
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('sai_cart');
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  // Free delivery threshold: ₹499
  const freeDeliveryThreshold = 499;
  const deliveryCharges = subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : 40;
  const grandTotal = subtotal + deliveryCharges;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const value = {
    cartItems,
    itemsCount,
    subtotal,
    deliveryCharges,
    grandTotal,
    freeDeliveryThreshold,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

