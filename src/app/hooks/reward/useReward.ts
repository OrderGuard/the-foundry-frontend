// hooks/useReward.ts

import { useEffect, useState } from "react";
import {
  getStoredReward,
  rewardToCartItem,
  isRewardValid,
} from "@/utils/reward/reward";

type FreeItemReward = {
  id: number;
  reward: string;
  type: "free_item";
  free_item: {
    id: number;
    name: string;
  };
  coupon: string | null;
  used: boolean;
  expires_at: string;
  created_at: string;
};

export function useReward() {
  const [reward, setReward] = useState<FreeItemReward | null>(null);

  useEffect(() => {
    const stored = getStoredReward();
    setReward(stored);
  }, []);

  const isValid = isRewardValid(reward);
  const cartItem = rewardToCartItem(isValid ? reward : null);

  return {
    reward,
    isValid,
    cartItem,
  };
}

