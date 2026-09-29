'use client';

import { useEffect, useState } from 'react';

export default function TrackOrderClient({ token }: { token: string }) {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/track/${token}/`)
      .then(res => res.json())
      .then(setOrder);
  }, [token]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Tracking Order #{order.id}</h1>

      <p>Name: <b>{order.customer_name.toUpperCase()}</b></p>
      <p>Status: <b>{order.status.toUpperCase()}</b></p>
      <p>Order type: {order.order_type}</p>
      <p>Estimated time: {order.estimated_time} min</p>
    </div>
  );
}

