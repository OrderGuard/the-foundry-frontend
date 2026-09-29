import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { navs } from '../data/data';
import './nav.css';

// Link
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../store/useAuthStore';


export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [navList, setNavList] = useState(navs);
  const [scroll, setScroll] = useState(0);

  // Zustand Store
  const [hasMounted, setHasMounted] = useState(false);
  const { user, isLoggedIn, logout, initAuth } = useAuthStore();
  // dropdown on username for logout
  const [showDropdown, setShowDropdown] = useState(false);

 useEffect(() => {
    setHasMounted(true);
    initAuth();
  }, []);

  const handleToggleMenu = () => {
    setOpen(!open);
  };

  const handleNavActive = () => {
    let position = scroll + 200;
    //nav add and remove class active
    setNavList(
      navList.map(nav => {
        nav.active = false;
        let targetSection: HTMLElement = document.querySelector(
          '#' + nav.target
        )!;

        if (
          targetSection &&
          position >= targetSection.offsetTop &&
          position <= targetSection.offsetTop + targetSection.offsetHeight
        ) {
          nav.active = true;
        }
        return nav;
      })
    );
  };

  const handleLogout = () => {
    console.log("Logout Clicked")
    logout();
    setOpen(false);
    router.push("/login");
  };

  const handleLoginClick = () => {
    router.push('/login');
    setOpen(!open);
  };

  const handleMenuClick = () => {
    router.push('/menu');
    setOpen(!open);
  };

  const handleScrollTo = (section: string) => {
    let header: HTMLElement = document.querySelector('#header')!;
    let offset = header.offsetHeight;
    let targetEl: HTMLElement = document.querySelector('#' + section)!;
    setOpen(false); // ⬅️ This closes the mobile nav when an item is clicked

    if (pathname === '/') {
      let elementPosition = targetEl.offsetTop;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    } else {
      router.push(`/#${section}`);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY);
    });
    return () => {
      window.removeEventListener('scroll', () => {
        setScroll(window.scrollY);
      });
    };
  }, [scroll]);

  useEffect(() => {
    handleNavActive();
  }, [scroll]);

  return (
    <nav
      id="navbar"
      className={`navbar order-last order-lg-0 ${
        open ? 'navbar-mobile' : undefined
      }`}
    >
      <ul>
        {navList.map(nav => (
          <li key={nav.id}>
            <a
              className={`nav-link scrollto ${
                nav.active ? 'active' : undefined
              }`}
              onClick={() => handleScrollTo(nav.target)}
            >
              {nav.name === 'Home' ? (
                <i className="bi bi-house-door-fill"></i>
              ) : (
                nav.name
              )}
            </a>
          </li>
        ))}

    {/* Add mobile-only actions here */}
    <li className="d-lg-none w-100 mt-3">
      <div className="d-flex flex-column gap-2 align-items-stretch">
        {/*
        <Link href="/menu" className="btn btn-sm custom-outline-text w-100">
          ORDER MENU
        </Link>
        */}

          <button
            onClick={handleMenuClick}
            className="btn btn-sm custom-outline-text w-100"
          >
            ORDER MENU
          </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="btn btn-sm custom-outline-text w-100"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="btn btn-sm custom-outline-text w-100"
          >
            Login
          </button>
        )}
      </div>
    </li>

      </ul>
      <i
        className="bi bi-list mobile-nav-toggle"
        onClick={handleToggleMenu}
      ></i>
    </nav>
  );
}
