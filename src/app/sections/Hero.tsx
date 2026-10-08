'use client';

import AOS from 'aos';
import React, { useEffect } from 'react';
import './hero.css';
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
    <>
      {/* Discount Banner */}
      <div className="discount-banner">
        Enter <strong>‘FOUNDRY25’</strong> at checkout for <strong>25% off</strong> your order
      </div>

      <section
        id="hero"
        className="d-flex align-items-center justify-content-center min-vh-100"
      >
        <div
          className="container-fluid"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <div className="row justify-content-center">
            <div className="col-12 d-flex flex-column align-items-center text-center">

              {/* Logo */}
              <Link href="/" className="hero-logo d-block mb-4">
                <Image
                  src="/assets/images/the-foundry-logo-no-bg.png"
                  alt="The Foundry Cafe & Kitchen Logo"
                  width={360}
                  height={300}
                  priority
                />
              </Link>

              {/* Order Button */}
              <button
                onClick={handleLoginClick}
                className="hero-order-btn btn btn-sm custom-outline"
              >
                ORDER MENU
              </button>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

