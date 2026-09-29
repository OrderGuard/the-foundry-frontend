'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import SectionTitle from '../components/menu/SectionTitle';
// Add to cart
import { useCartStore } from '../store/cartStore'; // adjust path as needed
import { nanoid } from 'nanoid';
//
import RewardsTab from './rewards/RewardsTab';
import type { Order, OrderItem } from "@/types/order";

type FormType = {
  username: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  house_number_or_name: string;
  street_address: string;
  city: string;
  postal_code: string;
};

export default function Profile() {
  const router = useRouter();
  const { user, isLoggedIn, initAuth } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'orders' | 'rewards'>('profile');

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ✏️ Profile form
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    contact_number: '',
    house_number_or_name: '',
    street_address: '',
    city: '',
    postal_code: '',
  });

  // UX states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Order - Add to cart
  const { cart, isHydrated } = useCartStore();
  const latestOrderId = orders.length > 0 ? orders[0].id : null;
  // message if item add to cart
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // ✅ Init auth
  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push("/login");
    }
  }, [mounted, isLoggedIn, router]);

  // ✅ Autofill form
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,

        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        contact_number: user.contact_number || '',

        // ✅ ADDRESS (add these)
        house_number_or_name: user.house_number_or_name || '',
        street_address: user.street_address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
      }));
    }
  }, [user]);

  // ✅ Fetch orders when tab active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  if (!isHydrated) {
    return <p>Loading cart...</p>;
  }

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access");
  };

  const getRefreshToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh");
  };

  const setAccessToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access", token);
    }
  };

  const clearStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      const token = getAccessToken();

      if (!token) {
        router.push("/login");
        return;
      }

      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/my/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔄 refresh if expired
      if (res.status === 401) {
        const refresh = getRefreshToken();

        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
          }
        );

        if (!refreshRes.ok) {
          clearStorage();
          router.push("/login");
          return;
        }

        const data = await refreshRes.json();
        setAccessToken(data.access);

        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/my/`, {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        });
      }

      const data = await res.json();

      if (!res.ok) return;

      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      setError(false);

      const token = getAccessToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: any) => {
    if (!order.items) return;

    const newItems = order.items.map((item: any) => {
      const basePrice = parseFloat(item.item_price || 0);

      return {
        // ✅ THIS is correct for YOUR backend
        item: item.item_id,

        menu_item: item.item_id,

        name: item.item_name,

        cartId: nanoid(),

        quantity: item.quantity,

        // keep same structure as checkout
        toppings: Array.isArray(item.toppings)
          ? item.toppings.filter(Boolean)
          : [],

        components: Array.isArray(item.components)
          ? item.components
          : {},

        note: item.note || "",

        price: basePrice,
        total: basePrice * item.quantity,
      };
    });

    useCartStore.setState({
      cart: newItems,
    });

    router.push("/checkout");
  };

  return (
    <>
      <SectionTitle title="Profile" subtitle="Me" />

      {/* 🔘 Tabs */}
      <div className="menu">
        <div className="col-lg-12 d-flex justify-content-center">
          <ul id="menu-flters">
            <li
              className={activeTab === 'profile' ? 'filter-active' : undefined}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>

            <li
              className={activeTab === 'address' ? 'filter-active' : undefined}
              onClick={() => setActiveTab('address')}
            >
              Address
            </li>

            <li
              className={activeTab === 'orders' ? 'filter-active' : undefined}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </li>

            <li
              className={activeTab === 'rewards' ? 'filter-active' : undefined}
              onClick={() => setActiveTab('rewards')}
            >
              Rewards
            </li>
          </ul>
        </div>
      </div>

      {/* 👤 PROFILE TAB (MATCHES ORDER CARD DESIGN) */}
      {activeTab === 'profile' && (
        //<div className="profile-item text-white max-w-xl mx-auto space-y-4">
        <div>

          {/* 👤 Profile Card */}
          <div className="profile-item p-4 rounded-lg">

            <form className="profile-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
            >

              <h3 className="font-semibold mb-3">Profile Information</h3>
              {/* Username */}
              <div className="col-md-8 form-group mt-2">
                <label className="text-sm text-gray-400">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.username}
                  disabled
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>

              {/* First Name */}
              <div className="col-md-8 form-group mt-2">
                <label className="text-sm text-gray-400">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                />
              </div>

              {/* Last Name */}
              <div className="col-md-8 form-group mt-2">
                <label className="text-sm text-gray-400">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                />
              </div>

              {/* Contact */}
              <div className="col-md-8 form-group mt-2">
                <label className="text-sm text-gray-400">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.contact_number || ''}
                  onChange={(e) =>
                    setForm({ ...form, contact_number: e.target.value })
                  }
                />
              </div>

              {/* Email (readonly) */}
              <div className="col-md-8 form-group mt-2">
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              {/* Save Section */}
              <div className="order-type-buttons mt-3">

                {/* Status */}
                <div className="text-sm">
                  {loading && <span className="text-yellow-400">Saving...</span>}
                  {success && <span className="text-green-400">Saved!</span>}
                  {error && <span className="text-red-400">Error</span>}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="order-type-button"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* 👤 PROFILE TAB (MATCHES ORDER CARD DESIGN) */}
      {activeTab === 'address' && (
        //<div className="profile-item text-white max-w-xl mx-auto space-y-4">
        <div>

          {/* 👤 Profile Card */}
          <div className="profile-item p-4 rounded-lg">

            <form className="profile-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
            >

              <h3 className="font-semibold mb-3">Address Information</h3>

        {/* House / Unit */}
        <div className="col-md-8 form-group mt-2">
          <label className="text-sm text-gray-400">House / Unit</label>
          <input
            type="text"
            className="form-control"
            value={form.house_number_or_name || ''}
            onChange={(e) =>
              setForm({ ...form, house_number_or_name: e.target.value })
            }
          />
        </div>

        {/* Street */}
        <div className="col-md-8 form-group mt-2">
          <label className="text-sm text-gray-400">Street Address</label>
          <input
            type="text"
            className="form-control"
            value={form.street_address || ''}
            onChange={(e) =>
              setForm({ ...form, street_address: e.target.value })
            }
          />
        </div>

        {/* City */}
        <div className="col-md-8 form-group mt-2">
          <label className="text-sm text-gray-400">City</label>
          <input
            type="text"
            className="form-control"
            value={form.city || ''}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />
        </div>

        {/* Postal Code */}
        <div className="col-md-8 form-group mt-2">
          <label className="text-sm text-gray-400">Postal Code</label>
          <input
            type="text"
            className="form-control"
            value={form.postal_code || ''}
            onChange={(e) =>
              setForm({ ...form, postal_code: e.target.value })
            }
          />
        </div>

              {/* Save Section */}
              <div className="order-type-buttons mt-3">

                {/* Status */}
                <div className="text-sm">
                  {loading && <span className="text-yellow-400">Saving...</span>}
                  {success && <span className="text-green-400">Saved!</span>}
                  {error && <span className="text-red-400">Error</span>}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="order-type-button"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* 📦 ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="profile-item text-white max-w-xl mx-auto">
          {loadingOrders ? (
            <p className="text-center">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="profile-item p-4 border border-gray-600 rounded-lg"
                >
                  <p><strong>Order #{order.id}</strong></p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.created_at).toLocaleString()}</p>

                  <div className="mt-3 space-y-2">
                    {order.items?.map((item: OrderItem) => (
                      <div
                        key={item.id}
                        className="p-2 border border-gray-700 rounded"
                      >
                        <p className="font-semibold">
                          {item.quantity}x {item.item_name}
                        </p>

                        <p className="text-sm text-gray-300">
                          Base: £{item.item_price}
                        </p>

                        {(item.toppings?.length ?? 0) > 0 && (
                          <div className="text-sm text-gray-400">
                            {item.toppings?.map((t, i) => (
                              <p key={i}>
                                - {t.name} x{t.quantity}
                              </p>
                            ))}
                          </div>
                        )}

                        <p className="text-sm font-semibold mt-1">
                          Total £{item.total_price}
                        </p>

                        {/* ✅ Reorder button ONLY for latest */}
                        {order.id === latestOrderId && (
                          <button
                            className="order-type-button mt-3"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowConfirm(true);
                            }}
                          >
                            Reorder
                          </button>
                        )}

                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/*Rewards*/}
      {activeTab === 'rewards' && <RewardsTab />}


      {/*Modal for reorder*/}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Reorder this order?</h3>

            <div className="confirm-actions">
              <button onClick={() => setShowConfirm(false)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleReorder(selectedOrder);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

