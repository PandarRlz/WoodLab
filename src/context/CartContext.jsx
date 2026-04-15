import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Importante para escuchar el cambio de usuario

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('woodlab_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persistir en LocalStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('woodlab_cart', JSON.stringify(cart));
  }, [cart]);

  // NUEVO: Escuchar cambios de sesión para limpiar el carrito
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      // Si el usuario cierra sesión o se firma con otra cuenta
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setCart([]);
        localStorage.removeItem('woodlab_cart');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const addToCart = (product, quantity, color) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id && item.color === color);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, color }];
    });
  };

  const removeFromCart = (id, color) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.color === color)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('woodlab_cart');
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.precio_base * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);