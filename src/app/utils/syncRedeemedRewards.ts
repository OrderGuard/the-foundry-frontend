// utils/syncRedeemedRewards.ts

import { useCartStore } from "@/store/cartStore";

export async function syncRedeemedRewards(access: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rewards/history/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    if (!res.ok) return;

    const rewards = await res.json();
    const cartStore = useCartStore.getState();

    rewards.forEach((reward: any) => {
      if (
        reward.status === "redeemed" &&
        reward.type === "free_item" &&
        reward.free_item
      ) {
        cartStore.addFreeItem(
          reward.free_item,
          reward.id
        );
      }
    });
  } catch (error) {
    console.error("Failed to sync redeemed rewards:", error);
  }
}

