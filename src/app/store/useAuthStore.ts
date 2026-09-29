import { create } from 'zustand';
import { syncRedeemedRewards } from "@/utils/syncRedeemedRewards";
import { useCartStore } from "@/store/cartStore";

interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  contact_number?: string;
  // Address fields
  house_number_or_name?: string;
  street_address?: string;
  city?: string;
  postal_code?: string;
  // Computed
  full_address?: string;
}

interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
  isLoggedIn: boolean;
  login: (access: string, refresh: string, user: User) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

/* =========================
   ✅ Safe helpers
========================= */

const getItem = (key: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeItem = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

/* =========================
   ✅ Store
========================= */

export const useAuthStore = create<AuthState>((set) => ({
  // ❌ DO NOT read localStorage here
  access: null,
  refresh: null,
  user: null,
  isLoggedIn: false,

  login: async (access, refresh, user) => {
    setItem('access', access);
    setItem('refresh', refresh);
    setItem('user', JSON.stringify(user));

    set({ access, refresh, user, isLoggedIn: true });
    await syncRedeemedRewards(access);
  },

  logout: () => {
    // Remove redeemed reward items
    useCartStore.getState().clearRedeemedItems();

    removeItem('access');
    removeItem('refresh');
    removeItem('user');

    set({ access: null, refresh: null, user: null, isLoggedIn: false });
  },

  initAuth: async () => {
    const access = getItem('access');
    const refresh = getItem('refresh');

    set({
      access,
      refresh,
      isLoggedIn: !!access,
    });

    if (!access) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (res.ok) {
        const user = await res.json();

        setItem('user', JSON.stringify(user));
        set({ user });
        await syncRedeemedRewards(access);

      } else {
        // invalid token → logout
        removeItem('access');
        removeItem('refresh');
        removeItem('user');

        set({ access: null, refresh: null, user: null, isLoggedIn: false });
      }
    } catch (err) {
      console.error('Auth init failed', err);
    }
  },
}));

