'use client';

import { useLoadScript } from "@react-google-maps/api";
import CheckoutForm from '../components/checkout/CheckoutForm';

import './page.css';

export default function CheckoutPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["geometry", "places"],
  });

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <section id="page" className="contact checkout-page d-flex align-items-center">
      <div className="container align-items-center mx-auto space-y-6">
        <CheckoutForm />
      </div>
    </section>
  );
}

