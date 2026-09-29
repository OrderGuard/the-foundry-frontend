import React, { useEffect } from 'react';
//import Glightbox from 'glightbox';
import './galleryItem.css';
import Image from 'next/image';

export default function GalleryItem({
  item,
}: {
  item: { id: number; image: string };
}) {
  //useEffect(() => {
    //new Glightbox({
      //selector: '.gallery-lightbox',
    //});
  //}, []);

  return (
    <div className="col-lg-3 col-md-4">
      <div className="gallery-item">
        <a
          href={item.image}
          className="gallery-lightbox"
          data-gall="gallery-item"
        >
          <Image
            width={500}
            height={300}
            src={item.image}
            alt=""
            className="img-fluid"
          />
        </a>
      </div>
    </div>
  );
}
