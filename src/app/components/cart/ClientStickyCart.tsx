'use client';

import React, { useEffect, useState } from 'react';
import StickyCartIcon from './StickyCartIcon';
import { useCartStore } from '../../store/cartStore'; // adjust the path

export default function ClientStickyCart() {
  //const [cartCount, setCartCount] = useState(0);
  const cartCount = useCartStore((state) => state.cart.length);

  //useEffect(() => {
    //const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    //// Storage Cart Retreive
    //setCartCount(cart.length);

    //// Optional: sync on storage change
    //const handleStorage = () => {
      //const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      //setCartCount(updatedCart.length);
    //};

    //window.addEventListener('storage', handleStorage);
    //return () => window.removeEventListener('storage', handleStorage);
  //}, []);

  return <StickyCartIcon itemCount={cartCount} />;
}

