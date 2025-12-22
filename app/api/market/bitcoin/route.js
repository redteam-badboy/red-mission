import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY

    const url =
      `https://www.alphavantage.co/query` +
      `?function=DIGITAL_CURRENCY_DAILY` +
      `&symbol=BTC` +
      `&market=USD` +
      `&apikey=${apiKey}`

    const res = await fetch(url, { cache: "no-store" })
    const data = await res.json()

    const timeSeries = data["Time Series (Digital Currency Daily)"]
    const latestDate = Object.keys(timeSeries)[0]
    const latest = timeSeries[latestDate]

    return NextResponse.json({
      symbol: "BTCUSD",
      price: Number(latest["4. close"]),
      high: Number(latest["2. high"]),
      low: Number(latest["3. low"]),
      updatedAt: latestDate,
    })
  } catch (err) {
    return NextResponse.json({ error: "Bitcoin API error" }, { status: 500 })
  }
}
