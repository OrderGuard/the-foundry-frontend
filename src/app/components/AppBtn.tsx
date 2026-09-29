import React from 'react';
import './appBtn.css';

export default function AppBtn({ name }: { name: string }) {
  const handleScrollTo = (section: string) => {
    let header: HTMLElement = document.querySelector('#header')!;
    let offset = header.offsetHeight;
    let targetEl: HTMLElement = document.querySelector('#' + section)!;
    let elementPosition = targetEl.offsetTop;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    });
  };

  return (
    <a
      className="app-btn scrollto d-none d-lg-flex"
      onClick={() => handleScrollTo('book-a-table')}
    >
      {name}
    </a>
  );
}
