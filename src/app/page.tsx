import Hero from './sections/Hero';
import About from './sections/About';
import WhyUs from './sections/WhyUs';
//import Menu from './sections/Menu';
import Specials from './sections/Specials';
import Events from './sections/Events';
import Testimonials from './sections/Testimonials';
import Gallery from './sections/Gallery';
import Chefs from './sections/Chefs';
import Contact from './sections/Contact';
import { useEffect } from 'react';
import Booking from './sections/Booking';
import Reward from './sections/Rewards';

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main">
        <About />
        {/*<WhyUs />*/}
        {/*<Menu />*/}
        {/*<Specials />*/}
        {/*
          <Events />
        */}
        <Reward />
        <Booking />
        {/*<Testimonials />*/}
        <Gallery />
        {/*<Chefs />*/}
        <Contact />
      </main>
    </>
  );
}
