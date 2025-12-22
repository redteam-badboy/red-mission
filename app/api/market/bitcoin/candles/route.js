import { NextResponse } from "next/server"

// Convert ms → Unix seconds
const toUnixSeconds = (ms) => Math.floor(ms / 1000)

export async function GET() {
  try {
    // Fetch last 24h OHLC data for Bitcoin from CoinGecko
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=1"
    )
    const data = await res.json()

    // Transform data to lightweight-charts format
    const candles = data.map(([timestamp, open, high, low, close]) => ({
      time: toUnixSeconds(timestamp),
      open,
      high,
      low,
      close,
    }))

    return NextResponse.json(candles)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch Bitcoin candles" },
      { status: 500 }
    )
  }
}
