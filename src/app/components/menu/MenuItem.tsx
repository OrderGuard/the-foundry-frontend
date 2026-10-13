import React, { useState } from "react";
import Image from "next/image";
import "./menuItem.css";

type MenuItemProps = {
  item: {
    id: number;
    name: string;
    image: string | null;
    price: number;
    description?: string;
  };
  isMenuOpen: boolean;
  onDetailsClick: (item: any) => void;
};

export default function MenuItem({
  item,
  isMenuOpen,
  onDetailsClick,
}: MenuItemProps) {
  const [imgSrc, setImgSrc] = useState(
    item.image || "/assets/images/the-foundry-logo.jpeg"
  );

  return (
    <div
      className={`col-lg-5 menu-item mx-auto ${
        !isMenuOpen ? "menu-item-disabled" : ""
      }`}
      onClick={() => {
        if (!isMenuOpen) return;
        onDetailsClick(item);
      }}
    >
      <Image
        src={imgSrc}
        alt={item.name}
        width={60}
        height={70}
        className="menu-img"
        onError={() =>
          setImgSrc("/assets/images/klub-kitchen-83-logo-white.PNG")
        }
        priority={true}
      />

      <div className="menu-content">
        <div className="name-action">
          <a
            className="menu-name-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!isMenuOpen) return;
              onDetailsClick(item);
            }}
          >
            {item.name}
          </a>
        </div>

        <div className="price-action">
          <button
            className="add-to-cart-button"
            disabled={!isMenuOpen}
            onClick={(e) => {
              e.stopPropagation();

              if (!isMenuOpen) return;
              onDetailsClick(item);
            }}
          >
            <span>£{item.price}</span>
            🛒
          </button>

          <button
            className="checkout-button"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = "/checkout";
            }}
          >
            💳 Checkout
          </button>
        </div>
      </div>

      <div className="menu-ingredients">{item.description}</div>
    </div>
  );
}

