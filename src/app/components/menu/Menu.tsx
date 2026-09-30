'use client';

import React, { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';
import Preloader from './Preloader';
import MenuItem from './MenuItem';
import MenuModal from './MenuModal';
import './menu.css';

type Menu = {
  id: number;
  name: string;
  start_time?: string;
  end_time?: string;
  is_active?: boolean;
};

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

export default function MenuComponents() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ----------------------------------------
  // STATE
  // ----------------------------------------

  // Breakfast / Dinner
  const [menus, setMenus] = useState<Menu[]>([]);

  // Selected Breakfast/Dinner
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);

  // Selected category
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  // ALL menu items
  const [data, setData] = useState<MenuItemType[]>([]);

  // ITEMS DISPLAYED FOR SELECTED CATEGORY
  const [items, setItems] = useState<MenuItemType[]>([]);

  // Selected item for modal
  const [selectedItem, setSelectedItem] =
    useState<MenuItemType | null>(null);

  // Loading states
  const [menuLoading, setMenuLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);

  // ----------------------------------------
  // GET MENUS
  // ----------------------------------------

  const getMenus = async () => {
    const response = await fetch(
      `${API_URL}/menu/menu/`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch menus');
    }

    return await response.json();
  };

  // ----------------------------------------
  // GET CATEGORIES
  // ----------------------------------------

  const getCategories = async (menuName: string) => {
    const response = await fetch(
      `${API_URL}/menu/menu/${menuName.toLowerCase()}/`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  };

  // ----------------------------------------
  // GET ALL MENU ITEMS
  // ----------------------------------------

  const getMenuItems = async () => {
    const response = await fetch(
      `${API_URL}/menu/items/?available=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch menu items');
    }

    return await response.json();
  };

  // ----------------------------------------
  // LOAD MENUS + MENU ITEMS
  // ----------------------------------------

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setMenuLoading(true);

        const [menuData, itemData] = await Promise.all([
          getMenus(),
          getMenuItems(),
        ]);

        // Only active menus
        const activeMenus = menuData.filter(
          (menu: Menu) => menu.is_active !== false
        );

        setMenus(activeMenus);

        // Save ALL menu items
        setData(itemData);

        // Select first menu
        if (activeMenus.length > 0) {
          setSelectedMenu(activeMenus[0]);
        }

      } catch (error) {
        console.error(
          'Initial data error:',
          error
        );
      } finally {
        setMenuLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // ----------------------------------------
  // LOAD CATEGORIES WHEN MENU CHANGES
  // ----------------------------------------

  useEffect(() => {
    if (!selectedMenu) return;

    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);

        // Clear previous category/items
        setCategories([]);
        setSelectedCategory(null);
        setItems([]);

        const categoryData = await getCategories(
          selectedMenu.name
        );

        // Don't show Toppings
        const filteredCategories =
          categoryData.filter(
            (category: Category) =>
              !category.name
                .toLowerCase()
                .includes('toppings')
          );

        setCategories(filteredCategories);

        // Automatically select first category
        if (filteredCategories.length > 0) {
          setSelectedCategory(
            filteredCategories[0]
          );
        }

      } catch (error) {
        console.error(
          'Category error:',
          error
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, [selectedMenu]);

  // ----------------------------------------
  // FILTER ITEMS WHEN CATEGORY CHANGES
  // ----------------------------------------

  useEffect(() => {
    if (!selectedCategory) {
      setItems([]);
      return;
    }

    setItemsLoading(true);

    // IMPORTANT:
    // Only show items belonging to
    // the selected category.
    const filteredItems = data.filter(
      (item) =>
        item.category?.id ===
        selectedCategory.id
    );

    setItems(filteredItems);

    setItemsLoading(false);

  }, [selectedCategory, data]);

  // ----------------------------------------
  // MENU CLICK
  // ----------------------------------------

  const handleMenuChange = (menu: Menu) => {
    setSelectedMenu(menu);
  };

  // ----------------------------------------
  // CATEGORY CLICK
  // ----------------------------------------

  const handleCategoryChange = (
    category: Category
  ) => {
    setSelectedCategory(category);
  };

  // ----------------------------------------
  // LOADING MENUS
  // ----------------------------------------

  if (menuLoading) {
    return (
      <section
        id="menu"
        className="menu section-bg-opacity"
      >
        <div className="container container-scroll">
          <Preloader />
        </div>
      </section>
    );
  }

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <section
      id="menu"
      className="menu section-bg-opacity"
    >
      <div className="container container-scroll">

        {/* ================================== */}
        {/* TITLE */}
        {/* ================================== */}

        <div
          className="row"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <SectionTitle
            title="Our Menu"
            subtitle="Check Our Tasty Menu"
          />
        </div>

        {/* ================================== */}
        {/* BREAKFAST / DINNER */}
        {/* ================================== */}

        <div className="col-lg-12 d-flex justify-content-center">
          <ul id="menu-flters">

            {menus.map((menu) => (
              <li
                key={menu.id}
                className={
                  selectedMenu?.id === menu.id
                    ? 'filter-active'
                    : undefined
                }
                onClick={() =>
                  handleMenuChange(menu)
                }
              >
                {menu.name}
              </li>
            ))}

          </ul>
        </div>

        {/* ================================== */}
        {/* CATEGORIES */}
        {/* ================================== */}

        {categoryLoading ? (
          <div className="row">
            <Preloader />
          </div>
        ) : categories.length > 0 ? (

          <div className="col-lg-12 d-flex justify-content-center">
            <ul
              id="menu-flters"
              className="category-filters"
            >

              {categories.map((category) => (
                <li
                  key={category.id}
                  className={
                    selectedCategory?.id ===
                    category.id
                      ? 'filter-active'
                      : undefined
                  }
                  onClick={() =>
                    handleCategoryChange(
                      category
                    )
                  }
                >
                  {category.name}
                </li>
              ))}

            </ul>
          </div>

        ) : (

          <p className="no-menu text-center w-100">
            No categories available
          </p>

        )}

        {/* ================================== */}
        {/* MENU ITEMS */}
        {/* ================================== */}

        <div
          className="row menu-container"
          data-aos="fade-up"
          data-aos-delay="200"
        >

          {itemsLoading ? (

            <Preloader />

          ) : items.length === 0 ? (

            <p className="no-menu text-center w-100">
              No menu item available
            </p>

          ) : (

            items
              .filter((item) => {

                const categoryName =
                  item.category?.name ?? '';

                return !categoryName
                  .toLowerCase()
                  .includes('toppings');

              })
              .map((item) => (

                <MenuItem
                  key={item.id}
                  item={item}
                  onDetailsClick={
                    setSelectedItem
                  }
                />

              ))

          )}

        </div>

      </div>

      {/* ================================== */}
      {/* MODAL */}
      {/* ================================== */}

      {selectedItem && (
        <MenuModal
          item={selectedItem}
          onClose={() =>
            setSelectedItem(null)
          }
        />
      )}

    </section>
  );
}

