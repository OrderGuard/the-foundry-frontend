'use client';

import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import Preloader from '../components/Preloader';
import MenuItem from '../components/menu/MenuItem';
import { filters } from '../data/data';
import './menu.css';
import MenuModal from '../components/menu/MenuModal';

export default function Menu() {

  type Category = {
    id: number;
    name: string;
  };

  type MenuItemType = {
    id: number;
    name: string;
    image: string;
    price: number;
    ingredients: string;
    category: number;
  };

  const [data, setData] = useState<MenuItemType[]>([]);
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<
    { id: number | 'all'; name: string; category: number | null; active: boolean }[]
  >([]);

  const getMenuData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/items`)
      .then(res => res.json())
      .then(menu => setData(menu))
      .catch(e => console.log(e.message));
  };

  const getCategoryData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/categories`)
      .then(res => res.json())
      .then(cats => setCategories(cats))
      .catch(e => console.error('Categories error:', e.message));
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  useEffect(() => {
    getMenuData();
  }, []);

  // When menu data or filters change
  useEffect(() => {
    setItems(data);
  }, [data]);

  // FIlter
  useEffect(() => {
    const dynamicFilters = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      category: cat.id,
      active: false,
    }));

    setFilters([
      { id: 'all', name: 'All', category: null, active: true },
      ...dynamicFilters,
    ]);
  }, [categories]);

  const handleFilterChange = (id: number | 'all', category: number | null) => {
    // set active
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        active: f.id === id,
      }))
    );

    if (category === null) {
      setItems(data); // Show all
    } else {
      setItems(data.filter((item) => item.category === category));
    }
  };

  return (
    <section id="menu" className="menu section-bg">
      <div className="container" data-aos="fade-up">
        <SectionTitle title="Our Menu" subtitle="Check Our Tasty Menu" />

        <div className="row" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-12 d-flex justify-content-center">
            <ul id="menu-flters">
              {filters.map(filter => (
                <li
                  key={filter.id}
                  className={`${filter.active ? 'filter-active' : undefined}`}
                  onClick={() => handleFilterChange(filter.id, filter.category)}
                >
                  {filter.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="row menu-container"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {!items ? (
            <Preloader />
          ) : items.length > 0 ? (
            items.map(
              (item: {
                id: number;
                name: string;
                image: string;
                price: number;
                ingredients: string;
              }) => <MenuItem
                      key={item.id}
                      item={item}
                      onDetailsClick={setSelectedItem} />
            )
          ) : (
            <Preloader />
          )}
        </div>
      </div>

      {selectedItem && (
        <MenuModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

    </section>
  );
}
