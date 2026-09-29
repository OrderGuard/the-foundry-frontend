'use client';

//import { Wheel } from 'react-custom-roulette';
import dynamic from 'next/dynamic';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const Wheel = dynamic(
  () => import('react-custom-roulette').then((mod) => mod.Wheel),
  { ssr: false }
);

import { useState } from 'react';
import { useRewardWheel } from '@/hooks/useRewardWheel';
import { useRewardStatus } from '@/hooks/useRewardStatus';

type RewardResponse = {
  reward: string;
  type: "free_item" | "discount";
  value: number;
  coupon: string;
  expires_at: string;
  spins_available: number;
  points: number;
};

type Props = {
  onReward?: (reward: RewardResponse) => void;
  onSpinComplete?: () => void;
};

export default function SpinWheel({
  onReward,
  onSpinComplete,
}: Props) {
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState('');
  const [spinLoading, setSpinLoading] = useState(false);
  const [error, setError] = useState('');

  const { wheelData, loading, error: wheelError } = useRewardWheel();
  const { status, loading: statusLoading, refetch } = useRewardStatus();

  const spin = async () => {
    try {
      setSpinLoading(true);
      setError('');

      //if (typeof window === 'undefined') return;

      const res = await fetchWithAuth('/rewards/spin/', {
        method: 'POST',
      });

      const data = await res.json();
      console.log(data)

      if (!res.ok) {
        setError(data.detail || 'Cannot spin now');
        return;
      }

      // ✅ SAFETY CHECK (this fixes your crash)
      let safeIndex = 0;

      if (
        typeof data.index === 'number' &&
        Array.isArray(wheelData) &&
        wheelData.length > 0 &&
        data.index >= 0 &&
        data.index < wheelData.length
      ) {
        safeIndex = data.index;
      } else {
        console.warn('Invalid index from backend:', data.index);
      }

      setPrizeIndex(safeIndex);
      setSpinning(true);

      // ✅ Send full backend response to parent
      //onReward?.(data);

      // If your spin lasts 5 seconds (5000ms):
      setTimeout(() => {
        onReward?.(data);
      }, 12000);

    } catch (err) {
      setError('Something went wrong');
    } finally {
      setSpinLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="text-white mb-4 space-y-1">

        {statusLoading ? (
          <p className="text-gray-400">Loading rewards...</p>
        ) : (
          <>
            <p>
              <b>
                EARN 50 POINTS FOR A FREE SPIN
              </b> <br/>
              <b>
                Points: <strong>{status?.points ?? 0} / 50</strong>
              </b> <br/>
            </p>

            <p>
              🎟 Spins Available:{" "}
              <strong>{status?.spins_available ?? 0}</strong>
            </p>

            <div>
        <p>
          {status?.can_spin ? (
            <span className="text-green-400">✅ You can spin</span>
          ) : (
            <span className="text-red-400">❌ Need more points</span>
          )}
        </p>

        {status?.can_spin && (status?.spins_available ?? 0) > 0 && (
          <button
            onClick={spin}
            disabled={loading}
            className="order-type-button mt-4"
          >
            {loading ? 'Spinning...' : 'Spin 🎡'}
          </button>
        )}

        {error && (
          <p className="text-red-400 mt-2">{error}</p>
        )}
      </div>
          </>
        )}

      </div>

      <div
        className="flex justify-center w-full"
      >
        <div
          className="wheel-section"
        >
          <div
            className="wheel-box"
          >
            {loading || wheelData.length === 0 ? (
                <p className="text-gray-400">Loading wheel...</p>
              ) : (
                <div className="flex justify-center w-full">
                  <div
                    style={{
                      borderRadius: '50%',
                      padding: '1px',
                      display: 'inline-block',
                      boxShadow: '0 0 18px rgba(205, 164, 94, 0.25)',
                    }}
                  >
                    <div
                      style={{
                        borderRadius: '50%',
                        padding: '1px',
                        backgroundColor: '#0c0b09',
                      }}
                    >
                      <Wheel
                        mustStartSpinning={spinning}
                        prizeNumber={prizeIndex}
                        data={wheelData}
                        onStopSpinning={() => {
                          setSpinning(false);

                          // Refresh points/spins
                          refetch();

                          // Refresh reward history in the parent
                          onSpinComplete?.();

                          const selected = wheelData[prizeIndex];
                          if (selected) {
                            setResult(selected.option);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

