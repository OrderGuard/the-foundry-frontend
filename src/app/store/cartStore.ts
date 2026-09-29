import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'

export type CartItem = {
  cartId: string
  name: string
  price: number
  quantity: number
  id: number
  menu_item: number
  pizza?: any
  note?: string
  components?: any
  pizzaPrice?: number
  toppings?: any[]
  drinks?: any
  total: number
  isFreeItem?: boolean;
  rewardId?: number;
}

type CartStore = {
  cart: CartItem[]
  isHydrated: boolean
  setHydrated: () => void

  addItem: (item: CartItem) => void
  removeItem: (cartId: string) => void
  addFreeItem: (reward: any, rewardId: number) => void;
  clearCart: () => void
  clearRedeemedItems: () => void
  updateNote: (cartId: string, note: string) => void
}

/* =========================
  SSR-safe storage
========================= */

// Fallback storage (used on server)
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

// Use localStorage only in browser
const storage = createJSONStorage(() =>
  typeof window !== 'undefined' ? localStorage : noopStorage
)

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),

      addItem: (item) =>
        set((state) => ({
          cart: [...state.cart, item],
        })),

      removeItem: (cartId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.cartId !== cartId),
        })),

      clearCart: () => set({ cart: [] }),

      clearRedeemedItems: () =>
        set((state) => ({
          cart: state.cart.filter((item) => !item.isFreeItem),
        })),

          addFreeItem: (reward, rewardId) =>
            set((state) => {
              const exists = state.cart.some(
                item => item.rewardId === rewardId
              );

              if (exists) {
                return state;
              }

              return {
                cart: [
                  ...state.cart,
                  {
                    cartId: crypto.randomUUID(),
                    id: reward.id,
                    menu_item: reward.id,
                    name: reward.name,
                    price: 0,
                    quantity: 1,
                    total: 0,
                    pizza: null,
                    note: "",
                    toppings: [],
                    drinks: null,
                    components: [],
                    isFreeItem: true,
                    rewardId,
                  },
                ],
              };
            }),

      updateNote: (cartId, note) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.cartId === cartId ? { ...item, note } : item
          ),
        })),
    }),
    {
      name: 'cart-storage',

      // THIS FIXES SSR
      storage,

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
)

