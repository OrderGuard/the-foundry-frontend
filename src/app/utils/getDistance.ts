export const restaurantCoords = { lat: 51.613329, lng: -3.981437 };

interface DistanceResult {
  distanceKm: number | null;
  deliveryFee: number | null;
  error?: string;
}

// Haversine formula
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

//function calculateDeliveryFee(distanceKm: number | null) {
  //if (distanceKm === null) return null;
  //return distanceKm <= 2.5 ? 2.99 : 3.99;
//}

function calculateDeliveryFee(distanceKm: number | null): number | null {
  if (distanceKm === null) return null;

  if (distanceKm > 8) return null; // optional: not deliverable

  if (distanceKm > 6.5) return 4.5;

  if (distanceKm >= 4) return 4.0;

  return 3.5;
}

export async function getDistance(address: string): Promise<DistanceResult> {
  if (!address) return { distanceKm: null, deliveryFee: null, error: "Address is empty" };

  try {
    const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
    if (!res.ok) {
      const errData = await res.json();
      return { distanceKm: null, deliveryFee: null, error: errData.error || "Geocoding failed" };
    }

    const coords = await res.json(); // { lat, lng }

    const distanceKm = Math.round(
      haversineDistance(
        restaurantCoords.lat,
        restaurantCoords.lng,
        coords.lat,
        coords.lng
      ) * 100
    ) / 100;

    const deliveryFee = calculateDeliveryFee(distanceKm);

    return { distanceKm, deliveryFee };
  } catch (err: any) {
    console.error("Distance calculation failed:", err);
    return { distanceKm: null, deliveryFee: null, error: "Failed to calculate distance" };
  }
}
