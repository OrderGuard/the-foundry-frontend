import React from 'react';
import SectionTitle from '../components/SectionTitle';
import ChefsItem from '../components/ChefsItem';

export default async function Chefs() {

  const items = [
    {
      id: 1,
      name: 'Walter White',
      photo: './assets/images/chefs/chefs-1.jpg',
      position: 'Master Chef',
      delay: '100',
    },
    {
      id: 2,
      name: 'Sarah Jhonson',
      photo: './assets/images/chefs/chefs-2.jpg',
      position: 'Patissier',
      delay: '200',
    },
    {
      id: 3,
      name: 'William Anderson',
      photo: './assets/images/chefs/chefs-3.jpg',
      position: 'Cook',
      delay: '300',
    },
  ];

  return (
    <section id="chefs" className="chefs">
      <div className="container" data-aos="fade-up">
        <SectionTitle title="Chefs" subtitle="Our Proffesional Chefs" />

        <div className="row">
          {items &&
            items.length > 0 &&
            items.map(
              (item: {
                id: number;
                name: string;
                photo: string;
                position: string;
                delay: string;
              }) => <ChefsItem key={item.id} item={item} />
            )}
        </div>
      </div>
    </section>
  );
}
