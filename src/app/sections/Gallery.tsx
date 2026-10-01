'use client';

import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import GalleryItem from '../components/GalleryItem';
import Preloader from '../components/Preloader';

export default function Gallery() {
  const images = [
    {
      id: 1,
      image: '/assets/images/the-foundry-images/the-foundry-1.jpeg',
    },
    {
      id: 2,
      image: '/assets/images/the-foundry-images/the-foundry-2.jpeg',
    },
    {
      id: 3,
      image: '/assets/images/the-foundry-images/the-foundry-3.jpeg',
    },
    {
      id: 4,
      image: '/assets/images/the-foundry-images/the-foundry-4.jpeg',
    },
    {
      id: 5,
      image: '/assets/images/the-foundry-images/the-foundry-5.jpeg',
    },
    {
      id: 6,
      image: '/assets/images/the-foundry-images/the-foundry-6.jpeg',
    },
    {
      id: 7,
      image: '/assets/images/the-foundry-images/the-foundry-7.jpeg',
    },
    {
      id: 8,
      image: '/assets/images/the-foundry-images/the-foundry-8.jpeg',
    },
  ];

  return (
    <section id="gallery" className="gallery">
      <div className="container" data-aos="fade-up">
        <SectionTitle
          title="Gallery"
          subtitle="Some photos from Our Restaurant"
        />
      </div>

      <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-0">
          {!images ? (
            <Preloader />
          ) : images.length > 0 ? (
            images.map((image: { id: number; image: string }) => (
              <GalleryItem key={image.id} item={image} />
            ))
          ) : (
            <Preloader />
          )}
        </div>
      </div>
    </section>
  );
}

