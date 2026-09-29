// utils/reward.ts

type FreeItemReward = {
  id: number;
  reward: string;
  type: "free_item";

  free_item: {
    id: number;
    name: string;
  };

  coupon: string | null;
  used: boolean; // or status: "available" | "redeemed" | "consumed" | "expired"
  expires_at: string;
  created_at: string;
};

export const REWARD_KEY = "reward";

/**
 * Safely parse reward from localStorage
 */
export function getStoredReward(): FreeItemReward | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("freeItemReward");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Convert reward → cart item
 */
export function rewardToCartItem(reward: FreeItemReward | null) {
  if (!reward) return null;
  if (reward.type !== "free_item") return null;
  if (!reward.free_item) return null;

  return {
    cartId: `reward-${reward.id}`,
    id: reward.free_item.id,
    name: reward.free_item.name,
    price: 0,
    quantity: 1,
    type: "free_item" as const,
  };
}

/**
 * Check if reward is still valid
 */
export function isRewardValid(reward: FreeItemReward | null) {
  if (!reward) return false;
  if (reward.used) return false;
  if (reward.type !== "free_item") return false;

  const now = Date.now();
  const expires = new Date(reward.expires_at).getTime();

  return now < expires;
}

