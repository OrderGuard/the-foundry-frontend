import { useState } from 'react';

export function useCoupon() {
  const [discount, setDiscount] = useState<number>(0);
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  const applyCoupon = async (code: string, subtotal: number) => {
    if (!code) return;

    setStatus("loading");
    setError("");
    setDiscount(0);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupon/validate/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setStatus("error");
        setError(data.message || "Invalid coupon");
        return;
      }

      const value = parseFloat(data.value);
      const minOrder = parseFloat(data.min_order_amount);

      if (subtotal < minOrder) {
        setStatus("error");
        setError(`Minimum order amount £${minOrder.toFixed(2)} required`);
        return;
      }

      let calculatedDiscount = 0;

      if (data.type === "percent") {
        calculatedDiscount = (subtotal * value) / 100;
      } else {
        calculatedDiscount = Math.min(value, subtotal);
      }

      setDiscount(calculatedDiscount);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong");
    }
  };

  // ✅ THIS IS THE KEY PART
  const resetCoupon = () => {
    setDiscount(0);
    setStatus("idle");
    setError("");
  };

  return {
    discount,
    status,
    error,
    applyCoupon,
    resetCoupon,
  };
}

