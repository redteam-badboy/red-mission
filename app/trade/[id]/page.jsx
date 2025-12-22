"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  Activity,
  Brain,
  Sparkles,
  ArrowLeft,
  Clock,
  Edit2,
  Save,
  X,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

export default function TradePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const [trade, setTrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    result: "",
    totalPL: 0,
  })

  useEffect(() => {
    if (!id) return

    const fetchTrade = async () => {
      try {
        const response = await fetch(`/api/trades/${id}`)
        const data = await response.json()
        setTrade(data)
        setEditForm({
          result: data.result || "",
          totalPL: data.totalPL || 0,
        })
      } catch (error) {
        console.error("Failed to fetch trade:", error)
        toast.error("Failed to load trade details")
      } finally {
        setLoading(false)
      }
    }

    fetchTrade()
  }, [id])

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        throw new Error("Failed to update trade")
      }

      const updatedTrade = await response.json()
      setTrade(updatedTrade)
      setIsEditing(false)
      toast.success("Trade updated successfully!")
    } catch (error) {
      console.error("Error updating trade:", error)
      toast.error("Failed to update trade")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trade?")) {
      return
    }

    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete trade")
      }

      toast.success("Trade deleted successfully!")
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      console.error("Error deleting trade:", error)
      toast.error("Failed to delete trade")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-lg">Loading trade details...</p>
        </div>
      </div>
    )
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Trade not found</h2>
          <Link href="/" className="text-amber-400 hover:text-amber-300">
            Return to trades
          </Link>
        </div>
      </div>
    )
  }

  const riskReward =
    trade.TP && trade.SL && trade.entryPrice
      ? (
          Math.abs(Number.parseFloat(trade.TP) - Number.parseFloat(trade.entryPrice)) /
          Math.abs(Number.parseFloat(trade.entryPrice) - Number.parseFloat(trade.SL))
        ).toFixed(2)
      : "N/A"

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Image with Low Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: "url('/bit3.jpeg')",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header with Back Button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Trades</span>
            </Link>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-2xl">
                  <TrendingUp className="w-10 h-10 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">{trade.pair}</h1>
                  <p className="text-slate-400">Trade ID: {trade._id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditForm({
                          result: trade.result || "",
                          totalPL: trade.totalPL || 0,
                        })
                      }}
                      className="px-4 py-2 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded-lg hover:bg-slate-500/30 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Trade Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Levels Card */}
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-amber-400" />
                  Price Levels
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-400 text-sm font-medium">Entry Price</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{trade.entryPrice}</p>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-slate-400 text-sm font-medium">Stop Loss</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{trade.SL}</p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-400 text-sm font-medium">Take Profit</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{trade.TP}</p>
                  </div>
                </div>
              </div>

              {/* Trade Details Card */}
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-purple-400" />
                  Trade Details
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-800/60 rounded-xl">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-1">Point of Interest</p>
                      <p className="text-white font-medium">{trade.pointOfInterest}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-800/60 rounded-xl">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-1">Confirmation</p>
                      <p className="text-white font-medium">{trade.confirmation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-slate-800/60 rounded-xl">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-400 text-sm mb-1">Lot Size</p>
                        <p className="text-white font-bold text-xl">{trade.lotSize}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-800/60 rounded-xl">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-400 text-sm mb-1">Total PnL</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.totalPL}
                            onChange={(e) => setEditForm({ ...editForm, totalPL: Number(e.target.value) })}
                            className="w-full bg-slate-700/50 text-white font-bold text-xl px-2 py-1 rounded border border-amber-500/30 focus:outline-none focus:border-amber-400"
                          />
                        ) : (
                          <p className="text-white font-bold text-xl">{trade.totalPL} USD</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-800/60 rounded-xl">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-1">Result</p>
                      {isEditing ? (
                        <select
                          value={editForm.result}
                          onChange={(e) => setEditForm({ ...editForm, result: e.target.value })}
                          className="w-full bg-slate-700/50 text-white font-medium px-3 py-2 rounded border border-indigo-500/30 focus:outline-none focus:border-indigo-400"
                        >
                          <option value="">Select Result</option>
                          <option value="Win">Win</option>
                          <option value="Loss">Loss</option>
                          <option value="Breakeven">Breakeven</option>
                        </select>
                      ) : (
                        <p className="text-white font-medium">{trade.result || "Not set"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              {trade.feeling && (
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-indigo-400" />
                    Notes & Feelings
                  </h2>
                  <p className="text-slate-300 leading-relaxed">{trade.feeling}</p>
                </div>
              )}
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">
              {/* Date & Time Card */}
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-amber-400" />
                  Timeline
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Trade Date</p>
                      <p className="text-white font-semibold">
                        {new Date(trade.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {trade.createdAt && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <Clock className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Created</p>
                        <p className="text-white font-semibold">
                          {new Date(trade.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  Quick Stats
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Pips to SL</span>
                    <span className="text-white font-bold">
                      {(Math.abs(Number.parseFloat(trade.entryPrice) - Number.parseFloat(trade.SL)) * 1).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Pips to TP</span>
                    <span className="text-white font-bold">
                      {(Math.abs(Number.parseFloat(trade.TP) - Number.parseFloat(trade.entryPrice)) * 1).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-amber-500/30">
                    <span className="text-slate-300">Total PnL</span>
                    <span className="text-amber-400 font-bold text-lg">{trade.totalPL} USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
