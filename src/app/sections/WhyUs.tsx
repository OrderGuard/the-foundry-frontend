import React from 'react';
import './whyUs.css';
import WhyUsCard from '../components/WhyUsCard';
import SectionTitle from '../components/SectionTitle';


export default async function WhyUs() {
  const items = [
    {
      id: 1,
      title: 'fresh & locally sourced ingredients',
      content: `we believe great food starts with great ingredients. that's why we use only the freshest, locally sourced fish, meats, and produce—prepared daily for maximum flavor and quality.`,
    },
    {
      id: 2,
      title: 'authentic taste, unmatched flavor',
      content: `from traditional british fish & chips to savory mediterranean-style kababs, every dish is seasoned with authentic spices and cooked to perfection by experienced chefs.`,
    },
    {
      id: 3,
      title: 'fast, friendly service',
      content: `our team is passionate about good food and even better service. whether you're dining in, taking out, or ordering online—expect speed, accuracy, and a warm welcome every time.`,
    },
  ];

  return (
    <section id="why-us" className="why-us">
      <div className="container" data-aos="fade-up">
        <SectionTitle title="Why Us" subtitle="Why Choose Us" />
        <div className="row">
          {items &&
            items.length > 0 &&
            items.map(
              (item: { id: number; title: string; content: string }) => (
                <WhyUsCard key={item.id} item={item} />
              )
            )}
        </div>
      </div>
    </section>
  );
}
