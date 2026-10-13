import React from 'react';
import Image from 'next/image';
import aboutImage from '../../../public/assets/images/kk83-about.png';
import './about.css';
import RewardsSection from '../components/rewards/RewardsSection';
import SectionTitle from '../components/SectionTitle';

export default function Reward() {
  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <SectionTitle title="Spin the Wheel" subtitle="Rewards" />
      </div>

      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <RewardsSection />
          </div>

        </div>
      </div>
    </section>
  );
}


