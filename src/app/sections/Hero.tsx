'use client';

import AOS from 'aos';
import React, { useEffect } from 'react';
import './hero.css';
import RewardsSection from '../components/rewards/RewardsSection';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/menu');
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      mirror: false,
    });
  }, []);

  return (
    <section
      id="hero"
      className="d-flex align-items-center min-vh-100"
    >
      <div className="container-fluid px-18" data-aos="zoom-in" data-aos-delay="100">
        <div className="row align-items-center">
          {/* Left Column */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <Link href="/" className="d-block mb-4">
              <Image
                src="/assets/images/the-foundry-logo-no-bg.png"
                alt="Upland Logo"
                width={180}
                height={150}
                priority
              />
            </Link>

            <h1 className="fw-bold text-white mb-2">
              <span>The Foundry</span>
            </h1>

            <h2 className="text-white mb-4">
              <span>Cafe & Kitchen</span>
            </h2>

            <button
              onClick={handleLoginClick}
              className="btn btn-sm custom-outline"
            >
              ORDER MENU
            </button>
          </div>

          {/* Right Column */}
          <div className="col-lg-6 d-flex justify-content-center">
            {/*<RewardsSection />*/}
          </div>
        </div>
      </div>
    </section>
  );
}

