export async function createPaymentIntent(amount: number) {
  const res = await fetch('http://localhost:8000/api/create-payment-intent/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) {
    throw new Error('Failed to create PaymentIntent');
  }

  return res.json(); // { clientSecret }
}

