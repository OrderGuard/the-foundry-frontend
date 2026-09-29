'use client';

import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import AppBtn from './AppBtn';
import Nav from './Nav';
import { useAuth } from '../context/AuthContext'; // adjust path as needed
import { useRouter } from 'next/navigation';
// Cart
import ClientStickyCart from './cart/ClientStickyCart';

// Link and Image
import Link from 'next/link';
import Image from 'next/image';
// Auth Store
import { useAuthStore } from '../store/useAuthStore'; // update path if needed



export default function Header() {
  const [scroll, setScroll] = useState(0);
  // Zustand Store
  const [hasMounted, setHasMounted] = useState(false);
  const { user, isLoggedIn, logout, initAuth } = useAuthStore();
  // dropdown on username for logout
  const [showDropdown, setShowDropdown] = useState(false);

  //const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

   useEffect(() => {
      setHasMounted(true);
      initAuth();
    }, []);

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

  // handle to remove toggle when click
  const handleMenuClick = () => {
    const isMobile = window.innerWidth < 768;
    const navbar = document.querySelector('#navbar');

    if (isMobile && navbar?.classList.contains('mobile-nav-toggle')) {
      navbar.classList.remove('mobile-nav-toggle'); // Close mobile nav
    }

    // Navigate using Next.js router
    router.push('/menu');
  };

  // dropdown on username for logout
  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle outside click
  //const dropdownRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node && // extra safety check
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);

  return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
  logout(); // handle both token removal and login state internally
  window.location.href = '/login';
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  if (!hasMounted) return null; // ⛔ avoid mismatch during SSR

  //const handleMenuClick = () => {
    //router.push('/menu');
  //};


  return (
    <>
    <header
      id="header"
      className={`fixed-top d-flex align-items-cente ${
        scroll > 100 ? 'header-scrolled' : undefined
      }`}
    >
      <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
        {/*
          <h1 className="logo me-auto me-lg-0">
            <a href="/">Uplands</a>
          </h1>
        */}
        {/* Uncomment below if you prefer to use an image logo  */}

    <Link href="/" className="logo me-auto me-lg-0">
      {/*<Image
        src="/assets/images/klub-kitchen-83-logo-white.PNG"
        alt="Upland Logo"
        width={150}
        height={150} // Set an appropriate height to avoid layout shift
        priority // Preload this image for faster LCP
      />*/}
    </Link>



        {/* Navigation  */}
        <div className="d-flex align-items-center">
        <Nav />
        </div>

        <div className="d-flex align-items-center">
          <Link href="/checkout" className="block">
            <ClientStickyCart />
          </Link>

          {/*
          <Link href="/menu" className="d-none d-md-flex btn btn-sm custom-outline-text">
            ORDER MENU
          </Link>
          */}

          <button
            onClick={handleMenuClick}
            className="d-none d-md-flex btn btn-sm custom-outline-text"
          >
            ORDER MENU
          </button>

          {/* Auth Button */}
          {isLoggedIn ? (
          <div className="d-flex align-items-center gap-2 position-relative"
            ref={dropdownRef}>
              <button
              onClick={handleToggleDropdown}
              className="btn btn-sm custom-outline-text"
            >
              Hello, {user?.username || 'Guest'} ▼
            </button>

            {showDropdown && (
              <div className="dropdown-menu show mt-2 p-2 shadow"
                style={{ position: 'absolute', top: '100%', right: 0, zIndex: 999 }}
              >
                <button
                  onClick={() => router.push("/profile")}
                  className="dropdown-item"
                >
                  Profile
                </button>

                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="d-none d-md-flex btn btn-sm custom-outline-text"
            >
              Login
            </button>
          )}
        </div>

      </div>
    </header>
    </>
  );
}
