"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Calendar, DollarSign, Target, CheckCircle, XCircle, Activity, Brain, Sparkles } from "lucide-react"

export default function Page() {
    const [trades, setTrades] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
  const [session, setSession] = useState(null)


 useEffect(() => {
  loadData()
}, [])

const loadData = async () => {
  try {
    setLoading(true)

    // get session
    const sessionRes = await fetch("/api/session")
    const sessionData = await sessionRes.json()
    setSession(sessionData)

    // get trades
    const tradesRes = await fetch("/api/trades")
    const tradesData = await tradesRes.json()

    // filter by logged-in user
    const userTrades = tradesData.filter(
      trade => trade.user === sessionData.user.email
    )

    setTrades(userTrades)

  } catch (error) {
    console.error("Error loading data:", error)
  } finally {
    setLoading(false)
  }
}


  const [formData, setFormData] = useState({
    pair: "",
    date: "",
    user:`${session?.user?.email}`,
    entryPrice: "",
    pointOfInterest: "",
    confirmation: "",
    SL: "",
    TP: "",
    lotSize: "",
    feeling: "",
    result: "active"
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user:`${session?.user?.email}`,
          entryPrice: Number.parseFloat(formData.entryPrice),
          pointOfInterest: formData.pointOfInterest,
          SL: Number.parseFloat(formData.SL),
          TP: Number.parseFloat(formData.TP),
          lotSize: Number.parseFloat(formData.lotSize),
          result: null,
        }),
      })

      if (response.ok) {
        setFormData({
          pair: "",
          date: "",
          entryPrice: "",
          pointOfInterest: "",
          confirmation: "",
          SL: "",
          TP: "",
          lotSize: "",
          feeling: "",
        })
        loadData()
      }
    } catch (error) {
      console.error("Error creating trade:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-amber-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-secondary bg-clip-text text-transparent">
              Trade Journal
            </h1>
            <Sparkles className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-slate-400 text-lg">Document every trade and master the markets</p>
        </div>

        <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-700/50 mb-5 shadow shadow-secondary">
          <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-700/50">
            <div className="p-2.5 bg-amber-500/20 rounded-xl">
              <TrendingUp className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-secondary">Create New Trade</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Currency Pair
                  </span>
                </label>
                <input
                  type="text"
                  name="pair"
                  value={formData.pair}
                  onChange={handleChange}
                  placeholder="e.g., EUR/USD"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Date
                  </span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Entry Price
                  </span>
                </label>
                <input
                  type="number"
                  step="0.00001"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  placeholder="1.08500"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    Point of Interest
                  </span>
                </label>
                <input
                  type="text"
                  name="pointOfInterest"
                  value={formData.pointOfInterest}
                  onChange={handleChange}
                  placeholder="Key level or reason"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Stop Loss (SL)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.00001"
                  name="SL"
                  value={formData.SL}
                  onChange={handleChange}
                  placeholder="1.08300"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Take Profit (TP)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.00001"
                  name="TP"
                  value={formData.TP}
                  onChange={handleChange}
                  placeholder="1.08700"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Lot Size
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="lotSize"
                  value={formData.lotSize}
                  onChange={handleChange}
                  placeholder="0.10"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Confirmation
                  </span>
                </label>
                <input
                  type="text"
                  name="confirmation"
                  value={formData.confirmation}
                  onChange={handleChange}
                  placeholder="e.g., Bullish engulfing"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-300 font-medium">
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  Feeling / Notes <span className="text-slate-500 text-sm">(Optional)</span>
                </span>
              </label>
              <textarea
                name="feeling"
                value={formData.feeling}
                onChange={handleChange}
                placeholder="How do you feel about this trade?"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none h-28"
              />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="btn w-full h-14 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary border-0 text-slate-950 font-bold text-base sm:text-lg shadow shadow-secondary hover:secondary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Trade...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Trade
                  </span>
                )}
              </button>
          </form>

           
        </div>
        
        {loading ? (
                      <div className="text-center py-16 sm:py-20">
                        <span className="loading loading-spinner loading-lg text-amber-400"></span>
                        <p className="text-slate-400 mt-4 text-sm sm:text-base">Loading your trades...</p>
                      </div>
                    ) : trades.length === 0 ? (
                      <div className="text-center py-16 sm:py-20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50">
                        <div className="max-w-md mx-auto px-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600" />
                          </div>
                          <p className="text-slate-400 text-base sm:text-lg mb-2">No trades yet</p>
                          <p className="text-slate-500 text-sm">
                            Start documenting your trading journey by creating your first trade above!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {trades?.map((trade) => (
                          <a
                          href={`/trade/${trade._id}`}
                            key={trade._id}
                            className="group bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/50 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-500"
                          >
                            <div className="flex items-start justify-between mb-5 pb-4 border-b border-slate-700/50">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">
                                  {trade.pair}
                                </h3>
                                <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>
                                    {new Date(trade.date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                              {trade.result === "win" && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Win
                                </div>
                              )}
                              {trade.result === "loss" && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Loss
                                </div>
                              )}
                              {trade.result === null && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold animate-pulse">
                                  <Activity className="w-3.5 h-3.5" />
                                  Active
                                </div>
                              )}
                            </div>
          
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                                  <DollarSign className="w-4 h-4 text-emerald-400" />
                                  <span className="font-medium">Entry</span>
                                </div>
                                <span className="text-white font-semibold text-sm">{trade.entryPrice}</span>
                              </div>
          
                              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                                  <Target className="w-4 h-4 text-blue-400" />
                                  <span className="font-medium">POI</span>
                                </div>
                                <span className="text-white font-semibold text-sm">{trade.pointOfInterest}</span>
                              </div>
          
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-slate-800/50 rounded-xl">
                                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span className="font-medium">TP</span>
                                  </div>
                                  <span className="text-white font-semibold text-sm">{trade.TP}</span>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-xl">
                                  <div className="flex items-center gap-1.5 text-red-400 text-xs mb-1">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span className="font-medium">SL</span>
                                  </div>
                                  <span className="text-white font-semibold text-sm">{trade.SL}</span>
                                </div>
                              </div>
          
                              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                                  <Activity className="w-4 h-4 text-purple-400" />
                                  <span className="font-medium">Lot Size</span>
                                </div>
                                <span className="text-white font-semibold text-sm">{trade.lotSize}</span>
                              </div>
          
                              {trade.confirmation && (
                                <div className="p-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl">
                                  <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="font-medium">Confirmation</span>
                                  </div>
                                  <span className="text-slate-300 text-xs">{trade.confirmation}</span>
                                </div>
                              )}
          
                              {trade.feeling && (
                                <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                                  <div className="flex items-center gap-1.5 text-indigo-400 text-xs mb-1.5">
                                    <Brain className="w-3.5 h-3.5" />
                                    <span className="font-medium">Notes</span>
                                  </div>
                                  <p className="text-slate-400 text-xs leading-relaxed italic">{trade.feeling}</p>
                                </div>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
      </div>
    </div>
  )
}
