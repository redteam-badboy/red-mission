import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(
      "https://www.goldapi.io/api/XAU/USD",
      {
        headers: {
          "x-access-token": process.env.GOLDAPI_KEY,
        },
        cache: "no-store",
      }
    )

    const data = await res.json()

    if (!data?.price) {
      return NextResponse.json(
        { error: "Gold data unavailable", raw: data },
        { status: 503 }
      )
    }

    return NextResponse.json({
      symbol: "XAUUSD",
      price: data.price,
      high: data.high_price,
      low: data.low_price,
      updatedAt: data.timestamp,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Gold API failure" },
      { status: 500 }
    )
  }
}
