import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

// الـ Provider اللي بيحتفظ بحالة السلة والمفضلة وبيوزعها على كل الصفحات، وبيحفظها في الـ localStorage
export default function CartProvider({ children }) {

    // Favorites
 // حالة المفضلة: بتتقرا من الـ localStorage أول مرة وتبدأ فاضية لو مفيش حاجة
 const [favorites, setFavorites] = useState(() => {
    const savedFav = localStorage.getItem("favoritesItems");
    return savedFav ? JSON.parse(savedFav) : [];
  });

  // بتضيف منتج للمفضلة بس لو مش موجود قبل كده (عشان ميتكررش)
  const addToFavorites = (item) => {
    setFavorites((prev) => {
        if(prev.some((i) => i.id === item.id)) return prev;
        return [...prev, item]
    })
  }

  // كل ما المفضلة تتغير بنحفظها في الـ localStorage عشان متضيعش بعد الريفريش
  useEffect(() => {
    localStorage.setItem("favoritesItems" , JSON.stringify(favorites))
  }, [favorites])

  // بتشيل منتج من المفضلة عن طريق الـ id بتاعه
  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((i) => i.id !== id))
  }
   
  // cart
  // حالة السلة: بتتقرا من الـ localStorage أول مرة وتبدأ فاضية لو مفيش حاجة
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // increaseQuantity
  // بتزوّد كمية المنتج في السلة واحد
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // decreaseQuantity
  // بتقلّل كمية المنتج واحد، ومبتنزلش عن 1 (للمسح استخدم removeFromCart)
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // removeFromCart
  // بتمسح المنتج من السلة خالص
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // بتضيف منتج جديد للسلة بكمية 1
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
  };

  // كل ما السلة تتغير بنحفظها في الـ localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        addToFavorites,
        favorites,
        removeFromFavorites
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
