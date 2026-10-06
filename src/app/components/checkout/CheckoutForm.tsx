'use client';
import Script from 'next/script';

import { useEffect, useState, useRef, useMemo } from 'react';
// Stripe comment
//import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import SectionTitle from '../../components/menu/SectionTitle';

// Get Cart Store
import { useCartStore, CartItem } from '../../store/cartStore';

import './checkoutForm.css'
// Distance of Map
import { getDistance } from "../../utils/getDistance";
import DistanceNotice from './DistanceNotice';
// Open Time

//import { isRestaurantOpenGMT } from "../../utils/isRestaurantOpen";
import { SCHEDULE } from "../../utils/schedule";
//import { generatePreorderSlots } from "../../utils/generatePreorderSlots";
import RestaurantStatus from "../../components/RestaurantStatus";

// Hooks
import useRestaurantStatus from "../../hooks/useRestaurantStatus";
// Coupon Hooks
import { useCoupon } from "../../hooks/useCoupon";
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export const dynamic = 'force-dynamic';
import { useAuthStore } from "@/store/useAuthStore";

// Reward
import { useReward } from "@/hooks/reward/useReward";

export default function CheckoutForm() {
  const router = useRouter();


  // Store Cart
  const cart = useCartStore((state) => state.cart);
  const updateNote = useCartStore((state) => state.updateNote);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const isHydrated = useCartStore((state) => state.isHydrated);
  const [ready, setReady] = useState(false);

  // hooks
  // Check api api/restaurant/status if open useRestaurantStatus
  const { isRestaurantOpen, loading: statusLoading } = useRestaurantStatus();

  // Check Schedule status if open or close
  //const status = isRestaurantOpenGMT();
  // Disable order if status not loaded or restaurant closed
  //const canOrder = isRestaurantOpen === true || status.isOpen === true;
  // Scheduled and Status Open
  //const canOrder = Boolean(isRestaurantOpen && status?.isOpen);
  // Status Open Only
  //const canOrder = Boolean(status?.isOpen);
  const canOrder = Boolean(isRestaurantOpen);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  // Submit form message
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // Distance
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  // Open Time
  //const { isOpen } = isRestaurantOpenGMT();
  //const withinHours = isOpen; // clearer naming

  // Check today if open or close
  // Scheduled order
  // If restaurant status is close it will pre-order
  //const isPreOrder = !status.isOpen;
  //const [selectedDay, setSelectedDay] = useState<number | null>(null);
  //const [selectedTime, setSelectedTime] = useState("");
  const { user, isLoggedIn } = useAuthStore();

  function getAvailableDays() {
    const today = new Date();
    const days: { value: number; label: string }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const weekday = d.getDay();
      const schedule = SCHEDULE[weekday];

      if (schedule) {
        days.push({
          value: weekday,
          label: d.toLocaleDateString("en-GB", {
            weekday: "long",
            month: "short",
            day: "numeric",
          }),
        });
      }
    }

    return days;
  }
  //

  const weekday = new Date().getUTCDay();
  const today = new Date().getDay();
  //const todaySchedule = SCHEDULE[today] ?? null;
  //const todaySchedule = selectedDay !== null ? SCHEDULE[selectedDay] : null;

  // Simulate Sunday at 13:00 London time
  const testDate = new Date("2025-08-24T12:00:00Z");
  // 12:00 UTC = 13:00 BST (British Summer Time)

  console.log("Test Hours")
  //console.log(isRestaurantOpenUK(testDate));
  // should print false (too early)

  // Reward
  const { reward, isValid, cartItem: freeItem } = useReward();

  const checkoutCart = useMemo(() => {
    if (!isValid || !reward || !freeItem) return cart;

    const exists = cart.some(
      (item) =>
        item.rewardId === reward.id ||
        (item.isFreeItem && item.id === freeItem.id)
    );

    if (exists) return cart;

    return [...cart, freeItem];
  }, [cart, reward, freeItem, isValid]);

  const handleCheckDistance = async (address: string) => {
    const result = await getDistance(address);
    console.log("Check distance")
    console.log(result)
    console.log(distanceKm)

    if (result.error) {
      setDistanceKm(null);
      //setDeliveryFee(null);
      setError(result.error);
    } else {
      setDistanceKm(result.distanceKm);
      //setDeliveryFee(result.deliveryFee);
      setError("");
    }
  };

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    phone_number: '',
    order_type: 'pickup',
    delivery_address: '',
    house_number_or_name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United Kingdom",
  });

  type FormType = typeof form;

  // FUll Address
  const fullAddress = [
    form.house_number_or_name,
    form.street_address,
    form.city,
    //form.state,
    form.postal_code,
    //form.country,
  ].filter(Boolean).join(', ');

  useEffect(() => {
    if (form.order_type !== "delivery") return;

    // Only trigger if all required fields are filled
    if (
      !form.house_number_or_name ||
      !form.street_address ||
      !form.city ||
      !form.postal_code
    ) return;

    const timeout = setTimeout(() => {
      handleCheckDistance(fullAddress);
    }, 800); // delay to avoid spam

    return () => clearTimeout(timeout);
  }, [
    form.house_number_or_name,
    form.street_address,
    form.city,
    form.postal_code,
    form.order_type
  ]);

  useEffect(() => {
    if (isLoggedIn && user) {
      setForm((prev) => ({
        ...prev,
        customer_name: user.username || '',
        customer_email: user.email || '',
        phone_number: user.contact_number || '',
        // Address fields
        house_number_or_name: user.house_number_or_name || '',
        street_address: user.street_address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
      }));
    }
  }, [isLoggedIn, user]);

  // ✅ Simple UK postcode format validation
  //const validateUKPostcode = (postcode) => {
    //const regex =
      ///^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
    //return regex.test(postcode.trim());
  //};

  // Measure Distance
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const restaurantCoords = { lat: 51.613329, lng: -3.981437 }; // your Swansea restaurant

  // Service Fee
  const serviceFee = 0.75;
  // Delivery Charge
  let deliveryCharge = 0;

  //if (form.order_type === "delivery" && distanceKm !== null && distanceKm <= 5) {
    //// ≤2.5 km → £2.99, >2.5 km → £3.99
    //deliveryCharge = distanceKm <= 2.5 ? 2.99 : 3.99;
  //}

  if (form.order_type === "delivery" && distanceKm !== null) {
    if (distanceKm > 8) {
      deliveryCharge = 0; // or handle "not deliverable"
    } else if (distanceKm < 4) {
      deliveryCharge = 3.5;
    } else if (distanceKm < 6.5) {
      deliveryCharge = 4.0;
    } else {
      deliveryCharge = 4.5;
    }
  }

  // use Coupon hooks
  const [couponCode, setCouponCode] = useState("");
  const {
    discount,
    status: couponStatus,
    error: couponError,
    applyCoupon,
    resetCoupon
  } = useCoupon();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Apply discount to grand total
  const totalAmount = subtotal + serviceFee + deliveryCharge;
  const grandTotal = totalAmount - discount;

  // Minimum Order
  const MIN_ORDER = 15;

  const isBelowMinimum = subtotal < MIN_ORDER;
  const remainingAmount = Math.max(MIN_ORDER - subtotal, 0);


  // Total amount on cart
  //const totalAmount = cart.reduce(
    //(sum, item) => sum + item.price * item.quantity, 0
  //);
  // Total + Service Fee
  //const grandTotal = totalAmount + serviceFee + deliveryCharge;

  //const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //setForm({ ...form, [e.target.name]: e.target.value });
  //};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // allow digits only
    value = value.replace(/\D/g, "");

    // limit to 11 digits (UK local format)
    if (value.length > 11) {
      value = value.slice(0, 10);
    }

    setForm((prev) => ({
      ...prev,
      phone_number: value,
    }));
  };

  const formatUK = (value: string = "") => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length > 8) {
      return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }

    if (digits.length > 5) {
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }

    return digits;
  };

  const toE164UK = (value: string) => {
    let digits = value.replace(/\D/g, "");

    // convert leading 0 → UK format
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    return "+44" + digits;
  };

  const handleRemoveItem = async (item: CartItem) => {
    console.log("Removing item:", item);

    if (item.isFreeItem && item.rewardId) {
      console.log("Unredeeming reward:", item.rewardId);

      await fetchWithAuth(`/rewards/unredeem/${item.rewardId}/`, {
        method: "POST",
      });
    }

    removeItem(item.cartId);
  };

  const normalizeComponents = (
    selectedComponents: Record<number, Record<number, number>>
  ) => {
    const result: Record<string, number[]> = {};

    Object.values(selectedComponents || {}).forEach((group: any) => {
      if (!group.category || !group.selected_items) return;

      result[group.category] = group.selected_items.flatMap(
        (item: any) => Array(item.quantity).fill(item.id)
      );
    });

    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // close if restaurant is close
    if (!canOrder) {
      setError("Restaurant is currently closed. You cannot place an order.");
      setLoading(false);
      return;
    }

    // ✅ Validation for delivery orders only
    if (form.order_type === 'delivery') {

      const requiredFields: Array<keyof FormType> = [
        'house_number_or_name',
        'street_address',
        'city',
        'postal_code'
      ];

      const missingFields = requiredFields.filter(
        (field) => !form[field].trim()
      );

      if (missingFields.length > 0) {
        setError('Please fill in all required delivery address fields.');
        setLoading(false);
        return;
      }
    }

  console.log("FULL CART:", JSON.stringify(cart, null, 2));
  // Convert to Phone number to E164
  const phoneE164 = toE164UK(form.phone_number);

  // Bismillah
  const orderData = {
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      phone_number: phoneE164,
      order_type: form.order_type,
      delivery_address: fullAddress,
      distanceKm: distanceKm,
      coupon_code: couponCode || null,

      //scheduled_at: isPreOrder
        //? buildScheduledAt(selectedDay!, selectedTime)
        //: null,
      items: cart.map((item) => {
        const normalized = normalizeComponents(item.components || {});
        console.log("Item:", item.name);
        console.log("Normalized Components:", normalized);

        return {
          item: item.menu_item ?? item.id,
          quantity: item.quantity,
          total: item.total,
          //toppings: item.toppings || [],
          //toppings: item.toppings?.map((t: any) => t.id) || [],
          toppings: Array.isArray(item.toppings)
            ? item.toppings.filter((t: any) => t !== null && t !== undefined)
            : [],
          components: item.components || {},
          note: item.note || "",
          // Free Item
          rewardId: item.rewardId ?? null,
          isFreeItem: item.isFreeItem ?? false,
        };
      }),
    };
    console.log('orderData:', orderData);
    console.log('User Info:', userInfo);
    console.log('Stringify')
    console.log(JSON.stringify(orderData, null, 2));

    try {
      // Get token for authentication
      const token = localStorage.getItem('access');

      //const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/create-payment/`, {
        //method: 'POST',
        //credentials: "include",
        //headers: {
          //'Content-Type': 'application/json',
          //...(token && { Authorization: `Bearer ${token}` }),
        //},
        //body: JSON.stringify(orderData),
      //});

      const res = await fetchWithAuth("/order/create-payment/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("Bismillah")
      console.log(res)

      console.log("TOKEN RAW:", token);
      console.log("TOKEN TYPE:", typeof token);

      console.log(orderData)
      console.log(token)

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Order creation failed');
      }

      const clientSecret = data.client_secret;

      // Redirect to Mollie hosted checkout
      // Bismillah
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        //console.log("Redirecting to:", data.checkout_url);
        //alert("Stopping before redirect. Check console.");
      }

      //const result = await stripe?.confirmCardPayment(clientSecret, {
        //payment_method: 'pm_123456789', // Saved PaymentMethod ID from Stripe
      //});

      // Comment Stripe
      {/*const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement)!,
          billing_details: {
            name: form.customer_name,
            email: form.customer_email,
            phone: form.phone_number,
            address: form.order_type === 'delivery'
              ? { line1: form.delivery_address }
              : undefined,
          },
        },
      });

      if (!result) {
        setError('Payment failed: No response');
      } else if (result.error) {
        setError(result.error.message ?? 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        clearCart(); // Clear cart
        router.push(`/payment-success?session_intent=${result.paymentIntent.id}`);
      }*/}
      // Comment Stripe

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }

    setLoading(false);
  };

  {/*useEffect(() => {
    if (isHydrated) {
      setReady(true);
    }
  }, [isHydrated]);

  if (!ready) {
    return <p>Loading cart...</p>;
  }

  if (cart.length === 0) {
    return <p>Cart is empty...</p>;
  }*/}

  return (

    <>
    {/*<section id="menu" className="menu section-bg-opacity">*/}
      {/*<div className="container container-scroll">*/}
        {/*<div className="row" data-aos="fade-up" data-aos-delay="100">*/}
        {/*<div className="row">*/}

          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCiO6KwJVVphwpqUDJJBGJlQxgAcINUqws&libraries=geometry`}
            strategy="afterInteractive"
          />

          <form onSubmit={handleSubmit} className="contact contact-form max-w-md mx-auto mt-10 space-y-4">
          <SectionTitle title="Your Cart" subtitle="Checkout" />
          <RestaurantStatus />

            <div className="row">
              <div className="col-lg-6">

                <Link href="/menu" className="link-color text-blue-600 hover:underline block mt-4">
                  ← Back to Menu
                </Link>
                <br />
                <br />
                <br />

                {/*Show cart menu order */}
                {cart.length === 0 ? (
                  <p>No items in cart.</p>
                ) : (
                  cart.map((item, index) => (

                    <div key={index} className="cart-item-div row border-b py-2">
                      <div key={index} className="cart-item border-b py-2 flex justify-between">
                        <div>
                          {item.isFreeItem && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              Free Item -
                            </span>
                          )}
                          {item.name}

                          <p className="text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p>£{(item.price * item.quantity).toFixed(2)}</p>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item)}
                          className="remove-item-button"
                        >
                          ✕
                        </button>
                      </div>

                     {/* Row 2: notes, full width */}
                      <textarea
                        value={item.note || ""}
                        onChange={(e) => updateNote(item.cartId, e.target.value)}
                        placeholder="Add note for this item..."
                        rows={2}
                      />

                    </div>
                  ))
                )}
              </div>

              {/*Show customer info form if cart is true*/}
              <div className="col-lg-6">
                {cart.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold">Customer Info</h3>

                    <div className="col-md-8 form-group">
                      <input
                        name="customer_name"
                        placeholder="Name"
                        value={form.customer_name}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-8 form-group">
                      <input
                        type="email"
                        name="customer_email"
                        placeholder="Email"
                        value={form.customer_email}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>

                    {/*<div className="col-md-8 form-group">
                      <input
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={form.phone_number}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>*/}

                    <div className="col-md-8 form-group">
                      <div className="input-group">

                        {/* Prefix with flag + +44 */}
                         <span
                          className="input-group-text"
                          style={{
                            fontSize: "0.80rem",
                            padding: "0.25rem 0.5rem",
                            gap: "4px",
                          }}
                        >
                          🇬🇧 <span style={{ fontWeight: 600 }}>+44</span>
                        </span>


                        <input
                          type="tel"
                          name="phone_number"
                          placeholder="Phone Number"
                          value={formatUK(form.phone_number)}
                          onChange={handlePhoneChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    {/* Button for Pickup Delivery*/}
                    <div className="col-md-8 form-group">
                      <div className="order-type-buttons">
                        {['pickup', 'delivery'].map((type) => (
                          <label
                            key={type}
                            className={`order-type-button ${
                              form.order_type === type ? 'selected' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name="order_type"
                              value={type}
                              checked={form.order_type === type}
                              onChange={handleChange}
                              className="hidden-radio"
                            />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/*Map Form*/}
                    <div className="col-md-8 form-group">
                      {form.order_type === 'delivery' && (
                        <>
                          {/*<div className="col-md-12 form-group">
                            <input
                              type="text"
                              name="delivery_address"
                              placeholder="Delivery Address"
                              value={form.delivery_address}
                              onChange={handleChange} // only update state
                              className="delivery-address-input"
                            />
                          </div>*/}

                           {/* Street Address */}
                            <div className="col-md-12 form-group mb-3">
                              <input
                                type="text"
                                name="house_number_or_name"
                                placeholder="House Number/Name"
                                value={form.house_number_or_name}
                                onChange={handleChange}
                                className="delivery-address-input"
                                required={form.order_type === "delivery"}
                              />
                            </div>

                           {/* Street Address */}
                            <div className="col-md-12 form-group mb-3">
                              <input
                                type="text"
                                name="street_address"
                                placeholder="Street Address"
                                value={form.street_address}
                                onChange={handleChange}
                                className="delivery-address-input"
                                required={form.order_type === "delivery"}
                              />
                            </div>

                            {/* City */}
                            <div className="col-md-12 form-group mb-3">
                              <input
                                type="text"
                                name="city"
                                placeholder="City / Town"
                                value={form.city}
                                onChange={handleChange}
                                className="delivery-address-input"
                                required={form.order_type === "delivery"}
                              />
                            </div>

                            {/* County / Region */}
                            {/*<div className="col-md-12 form-group mb-3">
                              <input
                                type="text"
                                name="state"
                                placeholder="County / Region"
                                value={form.state}
                                onChange={handleChange}
                                className="delivery-address-input"
                              />
                            </div>*/}

                            {/* UK Postcode */}
                            <div className="col-md-12 form-group mb-3">
                              <input
                                type="text"
                                name="postal_code"
                                placeholder="Postcode"
                                value={form.postal_code}
                                onChange={handleChange}
                                className="delivery-address-input"
                                required={form.order_type === "delivery"}
                              />
                            </div>

                            {/* Fixed Country */}
                            {/*<div className="col-md-12 form-group mb-3">
                              <input
                                type="text"
                                name="country"
                                value="United Kingdom"
                                readOnly
                                className="delivery-address-input"
                              />
                            </div>*/}

                            <div className="col-md-12 form-group mb-3">
                              {/*<button
                                type="button"
                                onClick={() => handleCheckDistance(fullAddress)}
                                className="form-control btn-address mt-4 mb-4"
                              >
                                Check Distance
                              </button>*/}
                              <DistanceNotice distance={distanceKm}/>
                            </div>

                          {/*{distanceKm !== null && (
                            <p>
                              Delivery Charge: £{distanceKm <= 2.5 ? "2.99" : "3.99"} ({distanceKm} km)
                            </p>
                          )}*/}
                        </>
                      )}

                      <input
                        value={couponCode}
                        onChange={(e) => {
                            const value = e.target.value;
                            setCouponCode(value);

                            // ✅ If user clears coupon, reset everything
                            if (value.trim() === "") {
                              resetCoupon();
                            }
                          }}
                        placeholder="Coupon code"
                        className="form-control"
                      />

                      <button
                        className="button-coupon"
                        type="button" // ✅ IMPORTANT: prevent form submit
                        onClick={() => applyCoupon(couponCode, subtotal)}
                        disabled={couponStatus === "loading"}
                      >
                        {couponStatus === "loading" ? "Applying..." : "Apply"}
                      </button>

                      {couponError && <p className="text-red-500">{couponError}</p>}

                      {/*{error && <p className="text-red-500">{error.message}</p>}*/}

                      {/* Show discount */}
                      {discount > 0 && (
                        <p className="text-green-600">
                          Coupon Discount Applied: -£{discount.toFixed(2)}
                        </p>
                      )}

                      {/* Updated Grand Total */}
                      <p className="text-xl font-semibold">
                        Subtotal: £{subtotal.toFixed(2)}
                      </p>

                      {subtotal < MIN_ORDER && (
                        <p className="text-red-500 mt-2">
                          Minimum order is £{MIN_ORDER}.
                          <br/>Add £{remainingAmount.toFixed(2)} more to proceed.
                        </p>
                      )}

                    </div>

                    {/* End Button for Pickup Delivery*/}

                    {/*
                    <div className="col-md-8 form-group">
                      <p className="text-xl font-semibold">
                        Total: ${totalAmount.toFixed(2)}
                      </p>
                    </div>
                    */}

                    {!isBelowMinimum && form.order_type === "pickup" && (
                      <>
                        <p className="text-xl font-semibold">
                          Service Fee: £{serviceFee.toFixed(2)}
                        </p>
                        <p className="text-xl font-semibold">
                          Total: {new Intl.NumberFormat("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          }).format(grandTotal)}
                        </p>
                      </>
                    )}

                    {!isBelowMinimum &&
                      form.order_type === "delivery" &&
                      distanceKm !== null &&
                      distanceKm <= 5 && (
                        <>
                          <p className="text-xl font-semibold">
                            Service Fee: £{serviceFee.toFixed(2)}
                          </p>

                          <p className="text-xl font-semibold">
                            Delivery Charge: £{deliveryCharge.toFixed(2)}
                          </p>

                          <p className="text-xl font-semibold">
                            Total: {new Intl.NumberFormat("en-GB", {
                              style: "currency",
                              currency: "GBP",
                            }).format(grandTotal)}
                          </p>
                        </>
                    )}

                    <button
                      className="form-control mt-4 mb-4"
                       disabled={
                          loading ||
                          isBelowMinimum ||
                          (form.order_type === "delivery" &&
                            (distanceKm === null || distanceKm > 5)) ||
                          !canOrder
                        }
                    >
                      {/*{status.isOpen ? "Place Order" : "Restaurant Closes"}*/}
                      {canOrder ? "Place Order" : "Restaurant Close"}
                    </button>

                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">Payment successful!</p>}

                    {successMessage && (
                      <div className="p-4 mb-4 text-green-800 bg-green-100 rounded-lg">
                        {successMessage}
                      </div>
                    )}

                    {errorMessage && (
                      <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
                        {errorMessage}
                      </div>
                    )}
                  </>
                )}

              </div>

            </div>
          </form>


        {/*</div>
      </div>*/}
    {/*</section>*/}
    </>
  );
}




