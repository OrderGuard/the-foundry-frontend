// hooks/useRestaurantStatus.ts
import { useState, useEffect } from "react";

export default function useRestaurantStatus() {
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/status/`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        setIsRestaurantOpen(data.is_open);
      } catch (err) {
        console.error(err);
        setIsRestaurantOpen(false); // assume closed if error
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Optionally: refresh every 30s
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isRestaurantOpen, loading };
}

