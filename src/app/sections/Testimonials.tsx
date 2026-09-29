'use client';

import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';

// import section css
import './testimonials.css';
import TestimonialsItem from '../components/TestimonialsItem';

export default function Testimonials() {
  const slides = [
    {
      id: 1,
      content: `“I ordered the BBQ Chicken Pizza and a side of wings — everything arrived hot, fresh, and full of flavor. You can tell they care about quality. Definitely ordering again!”`,
      avatar: './assets/images/testimonials/testimonials-1.jpg',
      client: 'Saul Goodman',
      position: 'CEO',
    },
    {
      id: 2,
      content: `“I’m always skeptical with food delivery, but they nailed it. The staff was helpful on the phone, and my burger arrived in under 30 minutes — still crispy!”`,
      avatar: './assets/images/testimonials/testimonials-2.jpg',
      client: 'Sara Wilsson',
      position: 'Consultant',
    },
    {
      id: 3,
      content: `“As someone who grew up eating Mediterranean food, I was blown away by their kebabs and wraps. You can tell it’s all made from scratch. So good!”`,
      avatar: './assets/images/testimonials/testimonials-3.jpg',
      client: 'Jena Karlis',
      position: 'Store Owner',
    },
    {
      id: 4,
      content: `“We got the family pizza and chicken bucket combo for game night — everyone loved it. Generous portions and real value for money. Will be back!”`,
      avatar: './assets/images/testimonials/testimonials-4.jpg',
      client: 'Matt Brandon',
      position: 'Freelancer',
    },
    {
      id: 5,
      content: `“Whether I dine in or order online, the food quality is always spot-on. Their fried chicken is crispy perfection, and the wraps are packed with flavor. My go-to spot for comfort food!”`,
      avatar: './assets/images/testimonials/testimonials-5.jpg',
      client: 'John Larson',
      position: 'Entrepreneur',
    },
  ];

  return (
    <section id="testimonials" className="testimonials section-bg">
      <div className="container" data-aos="fade-up">
        <SectionTitle
          title="Testimonials"
          subtitle="What our customers are saying"
        />

        <div data-aos="fade-up" data-aos-delay="100">
          <Swiper
            slidesPerView={'auto'}
            speed={600}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: '.testimonials-swiper-pagination',
              type: 'bullets',
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },

              1200: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="testimonials-slider swiper-container"
          >
            {slides &&
              slides.length > 0 &&
              slides.map(
                (slide: {
                  id: number;
                  content: string;
                  avatar: string;
                  client: string;
                  position: string;
                }) => (
                  <SwiperSlide key={slide.id}>
                    <TestimonialsItem item={slide} />
                  </SwiperSlide>
                )
              )}
          </Swiper>
          <div className="testimonials-swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
}
