

export default function DistanceNotice({ distance }: { distance: number | null }) {
  if (distance == null) return null; // covers both null and undefined

  const formatted = distance.toFixed(2);

  return (
    <div className="text-sm mt-2">
      {distance > 5 ? (
      <>
          <span className="notice-red">Distance: {formatted} km{" " }</span>
        <p>
          <span className="notice-red">Out of range: Delivery available only within 8 km</span>
        </p>
        <p>
          <span className="notice-red">(Your&apos;e unable to order)</span>
        </p>
      </>
      ) : (
      <>
          <span className="notice-green">Distance: {formatted} km{" " }</span>
        <p>
          <span className="notice-green">Within 8km</span>
        </p>
      </>
      )}
    </div>
  );
}


