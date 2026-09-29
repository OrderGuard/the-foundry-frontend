'use client';

import React from 'react';

type Props = {
  form: {
    customer_email: string;
    phone_number: string;
    order_type: string;
    delivery_address: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export default function UserInfoFields({ form, onChange }: Props) {
  return (
    <>
      <h3 className="text-lg font-semibold">Customer Info</h3>

      <input
        type="email"
        name="customer_email"
        placeholder="Email"
        value={form.customer_email}
        onChange={onChange}
        required
        className="w-full border px-4 py-2 rounded"
      />

      <input
        type="tel"
        name="phone_number"
        placeholder="Phone Number"
        value={form.phone_number}
        onChange={onChange}
        className="w-full border px-4 py-2 rounded"
      />

      <select
        name="order_type"
        value={form.order_type}
        onChange={onChange}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="pickup">Pickup</option>
        <option value="delivery">Delivery</option>
      </select>

      {form.order_type === 'delivery' && (
        <input
          type="text"
          name="delivery_address"
          placeholder="Delivery Address"
          value={form.delivery_address}
          onChange={onChange}
          className="w-full border px-4 py-2 rounded"
        />
      )}
    </>
  );
}

