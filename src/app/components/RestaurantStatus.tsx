'use client';
import { useEffect, useState } from 'react';
import { isRestaurantOpenGMT } from '../utils/isRestaurantOpen';

type RestaurantStatusResponse = {
  is_open: boolean;
  next_open_day?: string;
  next_open_time?: string;
};

export default function RestaurantStatus() {
  const [gmtStatus, setGmtStatus] = useState(() => isRestaurantOpenGMT());
  const [backendStatus, setBackendStatus] =
    useState<RestaurantStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBackendStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/restaurant/status/`
      );
      if (!res.ok) throw new Error('Failed to fetch restaurant status');
      const data: RestaurantStatusResponse = await res.json();
      setBackendStatus(data);
    } catch (err) {
      console.error(err);
      setBackendStatus({ is_open: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendStatus();

    const interval = setInterval(() => {
      setGmtStatus(isRestaurantOpenGMT());
      fetchBackendStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !backendStatus) {
    return (
      <div className="mb-4 p-3 rounded-xl text-center shadow-sm border bg-white/80">
        Loading restaurant status…
      </div>
    );
  }

  const scheduleOpen = gmtStatus.isOpen;
  const adminOpen = backendStatus.is_open;

  const canAcceptOrders = adminOpen;

  return (
    <div className="mb-4 p-3 rounded-xl text-center shadow-sm border bg-white/80 backdrop-blur">
      {canAcceptOrders ? (
        <p className="text-green-700 font-semibold text-sm">
          🟢 Open now
          {/*{!scheduleOpen && adminOpen && (
            <span className="block text-xs text-gray-600 mt-1">
              Opened early today
            </span>
          )}*/}
        </p>
      ) : (
        <>
        <p className="text-red-700 font-semibold text-sm">
          🔴 Closed
        </p>
          <p>
          {gmtStatus.nextOpenDay && gmtStatus.nextOpenTime && (
            <span className="block text-xs text-gray-600 mt-1">
              Opens {gmtStatus.nextOpenDay} at {gmtStatus.nextOpenTime}
            </span>
          )}
        </p>
        </>
      )}
    </div>
  );
}

