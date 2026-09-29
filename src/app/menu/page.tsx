'use client';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

import Menu from '../components/menu/Menu';
//import Menu from '../sections/Menu';
import './page.css';

export default function MenuPage() {
  useEffect(() => {
      AOS.init({ once: true });
  }, []);

  console.log("Menu Mounted")
  return (
    <section id="page" className="menu-page menu d-flex align-items-center">
      <div className="container align-items-center mx-auto space-y-6">
          <Menu />
      </div>
    </section>
  );
}


