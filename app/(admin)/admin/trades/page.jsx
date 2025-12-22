"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  Activity,
  Sparkles,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react"

export default function TradesPage() {
  const router = useRouter()
  const [trades, setTrades] = useState([])
  const [filteredTrades, setFilteredTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAndSortTrades()
  }, [trades, searchTerm, filterStatus, sortBy, sortOrder])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get session
      const sessionRes = await fetch("/api/session")
      const sessionData = await sessionRes.json()
      setSession(sessionData)

      // Get trades
      const tradesRes = await fetch("/api/trades")
      const tradesData = await tradesRes.json()

      // Filter by logged-in user
      const userTrades = tradesData.filter((trade) => trade.user === sessionData.user.email)

      setTrades(userTrades)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePnL = (trade) => {
    if (trade.result === "win") {
      return ((trade.TP - trade.entryPrice) * trade.lotSize * 10).toFixed(2)
    } else if (trade.result === "loss") {
      return ((trade.SL - trade.entryPrice) * trade.lotSize * 10).toFixed(2)
    }
    return 0
  }

  const filterAndSortTrades = () => {
    let result = [...trades]

    // Filter by search term (currency pair)
    if (searchTerm) {
      result = result.filter((trade) => trade.pair.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by status
    if (filterStatus !== "all") {
      if (filterStatus === "active") {
        result = result.filter((trade) => trade.result === null)
      } else {
        result = result.filter((trade) => trade.result === filterStatus)
      }
    }

    // Sort trades
    result.sort((a, b) => {
      let compareValue = 0

      switch (sortBy) {
        case "date":
          compareValue = new Date(a.date) - new Date(b.date)
          break
        case "pair":
          compareValue = a.pair.localeCompare(b.pair)
          break
        case "pnl":
          compareValue = calculatePnL(a) - calculatePnL(b)
          break
        default:
          compareValue = 0
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })

    setFilteredTrades(result)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const getStatusBadge = (result) => {
    if (result === "Win") {
      return (
        <div className="badge badge-success gap-1 text-xs font-semibold py-3">
          <CheckCircle className="w-3 h-3" />
          Win
        </div>
      )
    } else if (result === "Loss") {
      return (
        <div className="badge badge-error gap-1 text-xs font-semibold py-3">
          <XCircle className="w-3 h-3" />
          Loss
        </div>
      )
    } else {
      return (
        <div className="badge badge-warning gap-1 text-xs font-semibold py-3 animate-pulse">
          <Activity className="w-3 h-3" />
          Active
        </div>
      )
    }
  }

  const stats = {
    total: trades.length,
    active: trades.filter((t) => t.result === null).length,
    wins: trades.filter((t) => t.result === "Win").length,
    losses: trades.filter((t) => t.result === "Loss").length,
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative">
        <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/bit2.jpeg')",
        }}
      />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              My Trades
            </h1>
            <p className="text-slate-400 mt-2">Manage and analyze your trading history</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
            <div className="card-body p-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Total Trades</h3>
              <p className="text-2xl sm:text-3xl font-bold text-secondary">{stats.total}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
            <div className="card-body p-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Active</h3>
              <p className="text-2xl sm:text-3xl font-bold text-warning">{stats.active}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
            <div className="card-body p-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Wins</h3>
              <p className="text-2xl sm:text-3xl font-bold text-success">{stats.wins}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-xl">
            <div className="card-body p-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Losses</h3>
              <p className="text-2xl sm:text-3xl font-bold text-error">{stats.losses}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card bg-slate-900 border border-slate-700/50 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="form-control flex-1">
                <div className="input-group">
                  <span className="bg-slate-800 border-slate-700">
                    <Search className="w-5 h-5 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search currency pair..."
                    className="input input-bordered border-slate-700 bg-slate-800 text-white flex-1 focus:border-secondary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control w-full lg:w-48">
                <select
                  className="select select-bordered border-slate-700 bg-slate-800 text-white focus:border-secondary"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="win">Wins</option>
                  <option value="loss">Losses</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="form-control w-full lg:w-48">
                <select
                  className="select select-bordered border-slate-700 bg-slate-800 text-white focus:border-secondary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="pair">Currency Pair</option>
                  <option value="pnl">PnL</option>
                </select>
              </div>

              {/* Sort Order */}
              <button className="btn btn-secondary btn-outline w-full lg:w-auto" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? (
                  <>
                    <SortAsc className="w-5 h-5" />
                    Ascending
                  </>
                ) : (
                  <>
                    <SortDesc className="w-5 h-5" />
                    Descending
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Trades List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary"></span>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="card bg-slate-900 border border-slate-700/50 shadow-xl">
            <div className="card-body items-center text-center py-20">
              <TrendingUp className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-400">No trades found</h3>
              <p className="text-slate-500">Try adjusting your filters or add new trades</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTrades.map((trade) => (
              <div
                key={trade._id}
                onClick={() => router.push(`/trade/${trade._id}`)}
                className="card bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 hover:border-secondary/50 shadow-xl hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="card-body p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-700/50">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-secondary transition-colors duration-300">
                        {trade.pair}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
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
                    {getStatusBadge(trade.result)}
                  </div>

                  {/* Trade Details */}
                  <div className="space-y-3">
                    {/* Entry Price */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <DollarSign className="w-4 h-4 text-success" />
                        <span className="font-medium">Entry</span>
                      </div>
                      <span className="text-white font-semibold">{trade.entryPrice}</span>
                    </div>

                    {/* POI */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Target className="w-4 h-4 text-info" />
                        <span className="font-medium">POI</span>
                      </div>
                      <span className="text-white font-semibold">{trade.pointOfInterest}</span>
                    </div>

                    {/* TP and SL */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-1.5 text-success text-xs mb-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="font-medium">TP</span>
                        </div>
                        <span className="text-white font-semibold text-sm">{trade.TP}</span>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-1.5 text-error text-xs mb-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="font-medium">SL</span>
                        </div>
                        <span className="text-white font-semibold text-sm">{trade.SL}</span>
                      </div>
                    </div>

                    {/* Lot Size */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Activity className="w-4 h-4 text-secondary" />
                        <span className="font-medium">Lot Size</span>
                      </div>
                      <span className="text-white font-semibold">{trade.lotSize}</span>
                    </div>

                    {/* PnL if trade is closed */}
                    {(trade.result === "win" || trade.result === "loss") && (
                      <div className="p-3 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-secondary text-sm font-medium">PnL</span>
                          <span
                            className={`font-bold text-lg ${trade.result === "win" ? "text-success" : "text-error"}`}
                          >
                            {trade.result === "win" ? "+" : ""}${calculatePnL(trade)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Confirmation if available */}
                    {trade.confirmation && (
                      <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-1.5 text-warning text-xs mb-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="font-medium">Confirmation</span>
                        </div>
                        <span className="text-slate-300 text-xs line-clamp-2">{trade.confirmation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
