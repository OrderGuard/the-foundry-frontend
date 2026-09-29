// hooks/reward/useRewardHistory.ts

import { useState, useEffect, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export type RewardHistory = {
  id: number;
  reward: string;
  type: "discount" | "free_item";
  free_item: {
    id: number;
    name: string;
  } | null;
  status: "available" | "redeemed" | "consumed" | "expired";
  coupon: string | null;
  expires_at: string;
  used: boolean;
  created_at: string;
};


export default function useRewardHistory() {
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRewardHistory = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetchWithAuth("/rewards/history/");

      if (!res.ok) {
        throw new Error("Failed to fetch reward history");
      }

      const data = await res.json();

      setRewardHistory(data.slice(0, 10));
    } catch (err) {
      console.error(err);
      setRewardHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewardHistory();
  }, [fetchRewardHistory]);

  return {
    rewardHistory,
    loading,
    refetch: fetchRewardHistory,
  };
}

