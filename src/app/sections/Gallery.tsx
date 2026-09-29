'use client';

import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import GalleryItem from '../components/GalleryItem';
import Preloader from '../components/Preloader';

export default function Gallery() {
  const images = [
    {
      id: 1,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-1.PNG',
    },
    {
      id: 2,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-2.PNG',
    },
    {
      id: 3,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-3.PNG',
    },
    {
      id: 4,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-4.PNG',
    },
    {
      id: 5,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-5.PNG',
    },
    {
      id: 6,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-6.PNG',
    },
    {
      id: 7,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-7.PNG',
    },
    {
      id: 8,
      image: '/assets/images/gallery/klub-kitchen-83-gallery-8.PNG',
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

