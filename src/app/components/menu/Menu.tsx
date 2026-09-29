'use client';

import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Preloader from './Preloader';
import MenuItem from './MenuItem';
import './menu.css';
import MenuModal from './MenuModal';

export default function MenuComponents() {

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
    category: {
      id: number;
      name: string;
    };
  };
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MenuItemType[]>([]);
  const [items, setItems] = useState<MenuItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<
    { id: number; name: string; category: number | null; active: boolean }[]
  >([]);

  //const getMenuData = () => {
    //fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/items/?available=true`)
      //.then(res => res.json())
      //.then(menu => setData(menu))
      //.catch(e => console.log(e.message));
  //};

//const getCategoryData = () => {
  //fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/categories/`)
    //.then(res => res.json())
    //.then(cats => {
      //const today = new Date().getDay(); // Sunday = 0

      //const filtered = cats.filter((cat: any) => {
        //if (cat.name.toLowerCase().includes('sunday')) {
          //return today === 0; // show ONLY on Sunday
        //}
        //return true;
      //});

      //setCategories(filtered);
    //})
    //.catch(e => console.error('Categories error:', e.message));
//};

  const getMenuData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/menu/items/?available=true`
    );
    return await res.json();
  };

  const getCategoryData = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/menu/categories/`
  );
  const cats = await res.json();

  const today = new Date().getDay(); // Sunday = 0

  return cats.filter((cat: any) => {
    const name = cat.name.toLowerCase();

    const isSunday = name.includes('sunday');
    const isDessert = name.includes('dessert');

    if (isDessert) return true; // ✅ always show desserts

    if (today === 0) {
      // Sunday → show Sunday categories only (plus desserts already handled)
      return isSunday;
    } else {
      // Not Sunday → hide Sunday categories
      return !isSunday;
    }
  });
};

  //useEffect(() => {
    //getCategoryData();
  //}, []);

  //useEffect(() => {
    //getMenuData();
  //}, []);

useEffect(() => {
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [menu, filteredCategories] = await Promise.all([
        getMenuData(),
        getCategoryData(),
      ]);

      setData(menu);
      setCategories(filteredCategories);

    } catch (error: any) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);

  // When menu data or filters change
  useEffect(() => {
    setItems(data);
  }, [data]);

  // Categories make a one line
  useEffect(() => {
    if (categories.length === 0) return;

    // Create category filters
    const dynamicFilters = categories.map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      category: cat.id,
      active: index === 0, // make the first category active by default
    }));

    setFilters(dynamicFilters);

    // Show items from the first category automatically
    const firstCategoryId = categories[0].id;
    setItems(data.filter((item) => item.category?.id === firstCategoryId));
  }, [categories, data]);

  const handleFilterChange = (id: number, category: number | null) => {
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        active: f.id === id,
      }))
    );

    setItems(data.filter((item) => item.category?.id === category));
  };


  return (
    <section id="menu" className="menu section-bg-opacity">
      <div className="container container-scroll">
        <div className="row" data-aos="fade-up" data-aos-delay="100">
        <SectionTitle title="Our Menu" subtitle="Check Our Tasty Menu" />
          <div className="col-lg-12 d-flex justify-content-center">
            <ul id="menu-flters">
              {/*Filter and don't include Toppings Categories on tab*/}
              {filters
                .filter(filter => !filter.name.toLowerCase().includes('toppings'))
                .map(filter => (
                  <li
                    key={filter.id}
                    className={filter.active ? 'filter-active' : undefined}
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

          {loading ? (
    <Preloader />
  ) : items.length === 0 ? (
    <p className="no-menu text-center w-100">
      No menu item available
    </p>
  ) : (
    items
      .filter(item => {
        const categoryName = item.category?.name ?? item.category;
        return !String(categoryName)
          .toLowerCase()
          .includes('toppings');
      })
      .map(item => (
        <MenuItem
          key={item.id}
          item={item}
          onDetailsClick={setSelectedItem}
        />
      ))
  )}

        </div>

      </div>
      {selectedItem && (
        <MenuModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

    </section>
  );
}

