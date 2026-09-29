'use client';

import { useEffect, useState } from 'react';

type WheelItem = {
  option: string;
  style?: {
    backgroundColor: string;
    textColor: string;
  };
};

export function useRewardWheel() {
  const [wheelData, setWheelData] = useState<WheelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWheel = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('access');

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rewards/wheel/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch wheel');
        }

        const data = await res.json();

        const mapped = (data?.wheel ?? []).map((item: any, index: number) => ({
          option: item.option || 'Try Again',
          style: {
            backgroundColor:
              index % 2 === 0 ? '#cda45e' : '#0c0b09',
            textColor: index % 2 === 0 ? '#0c0b09' : '#ffffff',
          },
        }));

        setWheelData(mapped);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchWheel();
  }, []);

  return { wheelData, loading, error };
}

