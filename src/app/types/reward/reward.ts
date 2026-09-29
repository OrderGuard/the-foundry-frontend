// types/reward.ts

export type FreeItemReward = {
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

