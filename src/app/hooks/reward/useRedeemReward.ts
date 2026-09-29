'use client';

import { useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { useCartStore } from '@/store/cartStore';

export function useRedeemReward() {
  const addFreeItem = useCartStore((state) => state.addFreeItem);
  const [loading, setLoading] = useState(false);

  const redeemReward = async (rewardId: number) => {
    try {
      setLoading(true);

      const res = await fetchWithAuth(
        `/rewards/redeem/${rewardId}/`,
        {
          method: 'POST',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to redeem reward.');
      }

      console.log("Jibreel");
      console.log("Redeem response:", data);
      console.log("Redeem response:", data.free_item);

      if (data.free_item) {
        addFreeItem(data.free_item, data.reward_id);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    redeemReward,
    loading,
  };
}

