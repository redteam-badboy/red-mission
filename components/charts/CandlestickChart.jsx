"use client"

import { useEffect, useRef } from "react"
import { createChart, CandlestickSeries } from "lightweight-charts"

export default function CandlestickChart({ symbol }) {
  const chartContainerRef = useRef(null)
  const candleSeriesRef = useRef(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: "#020617",
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2933" },
        horzLines: { color: "#1f2933" },
      },
      crosshair: {
        mode: 1, // normal crosshair
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    })

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    })

    candleSeriesRef.current = candleSeries

    // Resize observer
    const resizeObserver = new ResizeObserver(entries => {
      chart.applyOptions({ width: entries[0].contentRect.width })
    })
    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [])

  // 🔁 Auto-update every 5 seconds
  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const res = await fetch(`/api/market/${symbol}/candles`)
        const data = await res.json()

        if (!data || !Array.isArray(data)) return

        // First load or update full data
        if (!candleSeriesRef.current) return
        candleSeriesRef.current.setData(data)
      } catch (err) {
        console.error("Failed to fetch candlestick data", err)
      }
    }

    fetchAndUpdate() // initial load
    const intervalId = setInterval(fetchAndUpdate, 5000) // update every 5s

    return () => clearInterval(intervalId)
  }, [symbol])

  return (
    <div
      ref={chartContainerRef}
      className="w-full rounded-xl border border-gray-800"
    />
  )
}
