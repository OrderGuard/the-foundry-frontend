'use client';

import SpinWheel from './SpinWheel';
import { useState, useEffect } from 'react';
import '../../components/menu/menuModal.css';
import useRewardHistory from '@/hooks/reward/useRewardHistory';
import { useRedeemReward } from '@/hooks/reward/useRedeemReward';
import { useCartStore } from "@/store/cartStore";

// Unified type for the modal to display
type ModalReward = {
  reward: string;
  expires_at: string;

  coupon?: string | null;
  coupon_code?: string;

  id?: number;
  created_at?: string;
  status?: string;

  type?: "free_item" | "discount";
  free_item?:
    | string
    | {
        id: number;
        name: string;
      }
    | null;
  isHistory?: boolean;
};

type RewardResponse = {
  reward: string;
  type: "free_item" | "discount";
  value: number;
  coupon: string | null;
  expires_at: string;
  spins_available: number;
  points: number;
};

export type RewardHistory = {
  id: number;
  reward: string;
  type: "discount" | "free_item";
  free_item: {
    id: number;
    name: string;
  } | null;
  coupon: string | null;
  status: "available" | "redeemed" | "consumed" | "expired";
  expires_at: string;
  created_at: string;
};

export default function RewardsTab() {
  const [activeTab, setActiveTab] = useState<'spin' | 'history'>('spin');
  // State to control what is shown in the modal
  const [rewardData, setRewardData] = useState<ModalReward | null>(null);
  const [copied, setCopied] = useState(false);

  const { rewardHistory, loading, refetch } = useRewardHistory();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  // add to cart
  const addFreeItem = useCartStore((state) => state.addFreeItem);

  const activeCoupons = rewardHistory.filter(
    (r) => r.coupon && !r.used && r.reward !== 'Try Again'
  );

  const usedCoupons = rewardHistory.filter(
    (r) => r.coupon && r.used
  );

  {/* Calculate Days Remaining */}
  const getDaysRemaining = (expiryDate: string) => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const freeItemName =
  typeof rewardData?.free_item === "string"
    ? rewardData.free_item
    : rewardData?.free_item?.name ?? "";
  //const daysRemaining = getDaysRemaining(item.expires_at);

  // Modal lock body scroll
  useEffect(() => {
    if (rewardData) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [rewardData]);

  const closeModal = () => setRewardData(null);

  // Helper to open modal from history
  const openHistoryReward = (item: RewardHistory) => {
    setRewardData({
      id: item.id,
      reward: item.reward,
      status: item.status,
      coupon: item.coupon,
      type: item.type,
      free_item: item.free_item ?? undefined,
      expires_at: item.expires_at,
      created_at: item.created_at,
      isHistory: true,
    });
  };

  const { redeemReward } = useRedeemReward();

  const handleRedeem = async (rewardId: number) => {

    if (!rewardData?.id) return;
    console.log("handleRedeem called");

    try {
      const data = await redeemReward(rewardData!.id);

      // Update the modal
      setRewardData(prev => {
        if (!prev) return null;

        return {
          ...prev,
          status: data.status,
        };
      });

      // Optional: Update the history list
      {/*setRewardHistory((prev) =>
        prev.map((item) =>
          item.id === rewardData.id
            ? {
                ...item,
                status: data.status ?? "redeemed",
              }
            : item
        )
      );*/}
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-item text-white max-w-xl mx-auto space-y-6 bg-black/40 border border-gray-800 rounded-lg p-4">
      <h3 className="font-semibold text-center text-xl">Rewards</h3>

      {/* 🔘 TABS */}
      <div className="menu">
        <div className="col-lg-12 d-flex justify-content-center">
          <ul id="menu-flters">
            <li
              className={activeTab === 'spin' ? 'filter-active' : undefined}
              onClick={() => setActiveTab('spin')}
            >
              🎡 Spin Wheel
            </li>
            <li
              className={activeTab === 'history' ? 'filter-active' : undefined}
              onClick={() => setActiveTab('history')}
            >
              📜 History
            </li>
          </ul>
        </div>
      </div>

      {/* 🎡 SPIN TAB */}
      {activeTab === 'spin' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-center text-lg">Spin the Wheel</h3>
          <SpinWheel
            onReward={(data: RewardResponse) => setRewardData(data)}
            onSpinComplete={refetch}
          />
        </div>
      )}

      {/* 📜 HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="overflow-x-auto">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            📜 Reward History
          </h4>

          {loading ? (
            <p className="text-gray-400">Loading rewards...</p>
          ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-800 shadow-xl">
            {/*<table className="w-full text-left border-collapse bg-black/20">*/}
            <table className="w-full text-left border-collapse" style={{ backgroundColor: '#1a1a1a' }}>

              <thead>
                {/*<tr className="bg-white/5 border-b border-gray-700 text-gray-300 text-xs uppercase tracking-wider">*/}
                <tr style={{ backgroundColor: '#0a2579', borderBottom: '1px solid #444' }}>
                  <th className="py-4 px-3 font-semibold">Date</th>
                  <th className="py-4 px-3 font-semibold">Reward</th>
                  <th className="py-4 px-3 font-semibold">Code</th>
                  <th className="py-4 px-3 text-center font-semibold">Expires</th>
                  <th className="py-4 px-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {rewardHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 italic bg-black/40">
                      No rewards found yet.
                    </td>
                  </tr>
                ) : (
                  rewardHistory.map((item, index) => {
                    const daysRemaining = getDaysRemaining(item.expires_at);
                    const isClickable = !!item.coupon;

                    return (
                      //<tr
                        //key={item.id}
                        //onClick={() => item.coupon && openHistoryReward(item)}
                        //className="transition-colors border-b border-gray-800/50 hover:bg-blue-900/20 cursor-pointer"
                        //style={{ backgroundColor: index % 2 === 0 ? '#1f1f1f' : '#1a1a1a' }}
                      //>

                      <tr
                        key={item.id}
                        onClick={() => item.coupon && openHistoryReward(item)}
                        onMouseEnter={() => setHoveredRow(item.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          cursor: isClickable ? "pointer" : "default",
                          backgroundColor:
                            hoveredRow === item.id
                              ? "#1e3a8a" // Blue while hovering
                              : index % 2 === 0
                              ? "#1f1f1f"
                              : "#1a1a1a",
                          transition: "background-color 0.2s ease",
                        }}
                      >

                        {/* DATE */}
                        <td className="py-4 px-3 text-gray-400 whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>

                        {/* REWARD */}
                        <td className="py-4 px-3">
                          <span className="font-bold text-white block">
                            {item.free_item?.name ?? item.reward}
                          </span>
                        </td>

                        {/* CODE */}
                        <td className="py-4 px-3">
                          <span className="font-mono text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                            {item.coupon || '—'}
                          </span>
                        </td>

                        {/* EXPIRES */}
                        <td className="py-4 px-3 text-center">
                          {item.used || item.reward === 'Try Again' ? (
                            <span className="text-gray-600">—</span>
                          ) : daysRemaining > 0 ? (
                            <div className="flex flex-col items-center">
                              <span className={daysRemaining <= 3 ? 'text-orange-400 font-bold' : 'text-gray-300'}>
                                {daysRemaining}d
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-500 font-medium">Expired</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-3 text-center">
                          <div className="flex justify-center">
                            {item.used ? (
                              <span className="min-w-[70px] text-[10px] bg-red-900/40 text-red-400 px-2 py-1 rounded-full border border-red-800/50 uppercase font-bold tracking-tighter">
                                Used
                              </span>
                            ) : item.reward === 'Try Again' ? (
                              <span className="min-w-[70px] text-[10px] bg-gray-700/50 text-gray-400 px-2 py-1 rounded-full border border-gray-600/50 uppercase font-bold tracking-tighter">
                                N/A
                              </span>
                            ) : daysRemaining > 0 ? (
                              <span className="min-w-[70px] text-[10px] bg-green-900/40 text-green-400 px-2 py-1 rounded-full border border-green-800/50 uppercase font-bold tracking-tighter shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                Active
                              </span>
                            ) : (
                              <span className="min-w-[70px] text-[10px] bg-black/60 text-gray-500 px-2 py-1 rounded-full border border-gray-800 uppercase font-bold tracking-tighter">
                                Void
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* 🎁 REWARD MODAL */}
      {rewardData && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="modal-header">
              <button className="close-button" onClick={closeModal}>×</button>
              <div className="titleDesign">
                <h2 className="menuTitle">
                  {rewardData.isHistory ? 'Reward Details' : 'Congratulations!'}
                </h2>
                <p className="menuTextTitle">
                  <strong>Status:</strong> {rewardData.isHistory ? 'Saved' : 'Winner'}
                </p>
              </div>
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="text-center py-4">
                <span style={{ fontSize: '3rem' }}>{rewardData.reward.includes('Again') ? '❌' : '🎁'}</span>
                <h3 className="menuText" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '10px' }}>
                  {rewardData.reward}
                </h3>
              </div>

              <div className="menu-title">
                <p className="menuText"><strong>Your Reward Details</strong></p>
              </div>

              <div className="option-row">
                <div className="menuText">Coupon Code</div>
                <div className="price" style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {rewardData.coupon || "N/A"}
                </div>
              </div>

              <div className="option-row">
                <div className="menuText">Valid Until</div>
                <div className="price">
                  {new Date(rewardData.expires_at).toLocaleDateString()}
                </div>
              </div>

              {rewardData.coupon && (
                <div className="component-section" style={{ marginTop: '15px', padding: '10px', textAlign: 'center' }}>
                  {rewardData.type === "discount" && (
                    <button
                      className="circle-btn"
                      style={{
                        width: "auto",
                        padding: "0 20px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        margin: "0 auto",
                      }}
                      onClick={() => {
                        if (rewardData.coupon) {
                          navigator.clipboard.writeText(rewardData.coupon);

                          setCopied(true);

                          setTimeout(() => {
                            setCopied(false);
                          }, 2000);
                        }
                      }}
                    >
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                  )}

                  {rewardData?.type === "free_item" && (
                    <>
                      {(() => {
                        const isDisabled = ["redeemed", "consumed", "expired"].includes(
                          rewardData.status ?? ""
                        );

                        return (
                          <button
                            className="circle-btn"
                            style={{
                              width: "auto",
                              padding: "0 20px",
                              borderRadius: "20px",
                              fontSize: "14px",
                              margin: "0 auto",
                              opacity: isDisabled ? 0.6 : 1,
                              cursor: isDisabled ? "not-allowed" : "pointer",
                            }}
                            onClick={() => {
                              if (rewardData.id && !isDisabled) {
                                handleRedeem(rewardData.id);
                              }
                            }}
                            disabled={isDisabled}
                          >
                            {rewardData.status === "redeemed"
                              ? "Redeemed"
                              : rewardData.status === "consumed"
                              ? "Consumed"
                              : rewardData.status === "expired"
                              ? "Expired"
                              : `Add ${freeItemName}`}
                          </button>
                        );
                      })()}
                    </>
                  )}

                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="modal-footer-reward" style={{ display: 'flex', justifyContent: 'center' }}>
              {/*<button className="qty-pill-blue" onClick={closeModal} style={{ cursor: 'pointer', border: 'none', padding: '8px 24px' }}>
                <span className="text-white" style={{ fontWeight: 'bold' }}>{rewardData.isHistory ? 'CLOSE' : 'AWESOME!'}</span>
              </button>*/}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

