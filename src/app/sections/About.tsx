import React from 'react';
import Image from 'next/image';
import aboutImage from '../../../public/assets/images/kk83-about.png';
import './about.css';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div
            className="col-lg-6 order-1 order-lg-2"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="about-img">
              {/*<Image src={aboutImage} alt="" />*/}
              <video autoPlay muted loop playsInline>
                <source src="/assets/videos/the-foundry-video-2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

          </div>
          <div className="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content">
            <h2>
              About Us
            </h2>
            {/*<p className="italic leading-relaxed tracking-wide my-6 px-4 text-lg text-gray-700">*/}
            <p className="hero-text">
              At The Foundry, we believe every meal should be an experience worth savoring. Whether you’re dropping by for a rich morning coffee, a quick handcrafted lunch, or a cozy evening meal, our kitchen is dedicated to serving freshly prepared, high-quality dishes made with passion and local ingredients.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

