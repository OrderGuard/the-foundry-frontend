'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SectionTitle from '../components/SectionTitle';
import SpecialsItem from '../components/SpecialsItem';
import './specials.css';
import Preloader from '../components/Preloader';
import { specialsFilters } from '../data/data';

export default function Specials() {
  const [items, setItems] = useState<any | []>([]);
  const data = useMemo(() => [
    {
      id: 1,
      image: './assets/images/specials/upland-1.jpeg',
      title: 'Where Tradition Meets Taste',
      subtitle:
        'At our restaurant, pizza is more than just a meal — it’s a celebration of flavor, freshness, and craft. Our Pizza Specials are made with hand-stretched dough, house-made sauces, and premium toppings, all baked to perfection in a blazing hot oven for that signature golden crust and melty goodness.',
      content:
        '',
      active: true,
    },
    {
      id: 2,
      image: './assets/images/specials/upland-2.jpeg',
      title: 'Flavor Beyond the Bun',
      subtitle:
        "At our restaurant, burgers aren't just food — they're an experience. Our Burger Specials lineup features bold, handcrafted combinations made from high-quality ingredients and bursting with flavor. Whether you're craving something smoky, spicy, or classic, there's a special burger here for you.",
      content:
        '',
      active: false,
    },
    {
      id: 3,
      image: './assets/images/specials/upland-3.jpeg',
      title: 'Fresh, Flavorful, and Folded to Perfection',
      subtitle:
        'Looking for something light yet satisfying? Our Wraps Specials offer the perfect balance of freshness and flavor — ideal for a quick lunch, a healthy dinner, or something delicious on the go. Each wrap is made with soft, warm flatbread and filled with premium ingredients, bold sauces, and vibrant veggies.',
      content:
        '',
      active: false,
    },
    {
      id: 4,
      image: './assets/images/specials/upland-4.jpeg',
      title:
        'Classic Comfort, Freshly Baked',
      subtitle:
        'Totam aperiam accusamus. Repellat consequuntur iure voluptas iure porro quis delectus',
      content:
        "There’s something timeless about a golden-crusted pie or a perfectly folded pasty. At our kitchen, we bring these classics to life with handcrafted fillings, flaky pastry, and a passion for traditional flavors. Whether you're craving something hearty or wholesome, our Pies & Pasties Specials deliver satisfaction in every bite.",
      active: false,
    },
    {
      id: 5,
      image: './assets/images/specials/upland-5.jpeg',
      title: 'Crispy, Juicy, Unforgettable',
      subtitle: 'There’s nothing quite like the satisfying crunch of golden fried chicken. At our kitchen, we take this classic comfort food to the next level with a perfected recipe that combines bold seasoning, tender cuts, and a signature crisp coating that keeps guests coming back for more.',
      content:
        '',
      active: false,
    },
  ], []);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleFilterAcive = (id: number) => {
    specialsFilters.map(filter => {
      filter.active = false;
      if (filter.id === id) filter.active = true;
    });
  };

  const handleSpecialChange = (id: number): void => {
    handleFilterAcive(id);
    const updatedItems = items.map(
      (item: {
        id: number;
        image: string;
        title: string;
        subtitle: string;
        content: string;
        active: boolean;
      }) => {
        item.active = false;
        if (item.id === id) item.active = true;
        return item;
      }
    );

    setItems(updatedItems);
  };

  return (
    <section id="specials" className="specials">
      <div className="container" data-aos="fade-up">
        <SectionTitle title="Specials" subtitle="Check Our Specials" />

        <div className="row" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-3">
            <ul className="nav nav-tabs flex-column">
              {specialsFilters.map(filter => (
                <li className="nav-item" key={filter.id}>
                  <a
                    className={`nav-link ${filter.active ? 'active show' : ''}`}
                    onClick={() => handleSpecialChange(filter.id)}
                  >
                    {filter.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-9 mt-4 mt-lg-0">
            <div className="tab-content">
              {!items ? (
                <Preloader />
              ) : items.length > 0 ? (
                items.map(
                  (item: {
                    id: number;
                    image: string;
                    title: string;
                    subtitle: string;
                    content: string;
                    active: boolean;
                  }) => <SpecialsItem key={item.id} item={item} />
                )
              ) : (
                <Preloader />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

