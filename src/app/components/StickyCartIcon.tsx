// components/StickyCartIcon.tsx
'use client';
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import './stickyCartIcon.css'; // or use Tailwind

export default function StickyCartIcon({ itemCount = 0 }: { itemCount?: number }) {
  return (
    <div className="sticky-cart-icon">
      <Link href="/checkout">
        <div className="icon-wrapper">
          <ShoppingCart size={24} />
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </div>
      </Link>
    </div>
  );
}

