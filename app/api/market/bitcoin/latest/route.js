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

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No Bitcoin data available" },
        { status: 503 }
      )
    }

    const lastCandle = data[data.length - 1]
    const [timestamp, open, high, low, close] = lastCandle

    return NextResponse.json({
      time: toUnixSeconds(timestamp),
      open,
      high,
      low,
      close,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch latest Bitcoin candle" },
      { status: 500 }
    )
  }
}
