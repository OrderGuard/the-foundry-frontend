import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "No address provided" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          "User-Agent": "uplandsfishbar.com (your@email.com)", // required by Nominatim
          "Accept-Language": "en", // optional, improves results
        },
      }
    );


    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch coordinates" }, { status: 500 });
    }

    const data = await res.json();

    if (!data?.length) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const { lat, lon } = data[0];
    return NextResponse.json({ lat: parseFloat(lat), lng: parseFloat(lon) });
  } catch (err) {
    console.error("Geocoding error:", err);
    return NextResponse.json({ error: "Failed to fetch coordinates" }, { status: 500 });
  }
}


