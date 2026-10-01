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
  onDetailsClick: (item: any) => void;
};

export default function MenuItem({ item, onDetailsClick }: MenuItemProps) {
  const [imgSrc, setImgSrc] = useState(item.image || "/assets/images/the-foundry-logo.jpeg");
  //const [imgSrc, setImgSrc] = useState(item.image || "/assets/images/menu/cake.jpg");

  return (
    <div
      className="col-lg-5 menu-item mx-auto"
      onClick={() => onDetailsClick(item)}
    >
      <Image
        src={imgSrc}
        alt={item.name}
        width={60} // adjust as needed
        height={70} // adjust as needed
        className="menu-img"
        onError={() => setImgSrc("/assets/images/klub-kitchen-83-logo-white.PNG")}
        priority={true} // helps LCP if visible above the fold
      />

      <div className="menu-content">
        <div className="name-action">
          <a className="menu-name-button" onClick={() => onDetailsClick(item)}>
            {item.name}
          </a>
        </div>

        <div className="price-action">

          <button
            className="add-to-cart-button"
            onClick={(e) => {
              e.stopPropagation();
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
              window.location.href = "/checkout"; // or use Next.js router
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

