'use client';

import { useEffect, useState } from 'react';

type RewardStatus = {
  points: number;
  spins_available: number;
  can_spin: boolean;
};

export function useRewardStatus() {
  const [status, setStatus] = useState<RewardStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);

      let token = localStorage.getItem('access');

      let res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rewards/status/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        const refresh = localStorage.getItem('refresh');

        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
          }
        );

        if (!refreshRes.ok) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }

        const refreshData = await refreshRes.json();
        localStorage.setItem('access', refreshData.access);

        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rewards/status/`,
          {
            headers: {
              Authorization: `Bearer ${refreshData.access}`,
            },
          }
        );
      }

      const data = await res.json();
      setStatus(data);

    } catch (err) {
      console.error('Failed to load reward status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return { status, loading, refetch: fetchStatus };
}
