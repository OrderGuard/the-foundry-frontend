import React from 'react';
import './heroBtn.css';

export default function HeroBtn({
  name,
  target,
}: {
  name: string;
  target: string;
}) {
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
      onClick={() => handleScrollTo(target)}
      className={`btn-hero animated fadeInUp scrollto ${
        name.includes('book') ? 'ms-4' : undefined
      }`}
    >
      {name}
    </a>
  );
}
