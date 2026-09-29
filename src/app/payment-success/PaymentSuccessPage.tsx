"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "../store/cartStore";


export default function PaymentSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id"); // Mollie usually appends ?id=tr_xxx

  const [trackingToken, setTrackingToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    // Clear cart once when this page loads
    clearCart();

    if (!paymentId) {
      setStatus("success"); // fallback: show success if no id
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    // Fetch payment status from Django backend
    //fetch(`http://127.0.0.1:8000/order/check-payment/?payment_id=${paymentId}`)
    fetch(`${API_URL}/order/check-payment/${paymentId}/`)
      .then((res) => res.json())
      .then((data) => {

        if (data.status === "paid") {
          setStatus("success");
          setTrackingToken(data.tracking_token);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [paymentId]);

  return (
    <div className="flex flex-col mt-8 items-center justify-center min-h-screen bg-gray-50">
      {status === "loading" && <p className="text-lg">Checking your payment...</p>}

      {status === "success" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600"> Payment Successful!</h1>
            <p className="mt-2">Thanks for your order. We’re getting it ready for you.</p>

            {trackingToken && (
              <a
                href={`/track/${trackingToken}`}
              className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Track Your Order
              </a>
            )}

        </div>
      )}

      {status === "failed" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600"> Payment Failed</h1>
          <p className="mt-2">Something went wrong. Please try again.</p>
        </div>
      )}
    </div>
  );
}
//
// Prevents static generation errors
export const dynamic = "force-dynamic";


