"use client"

import { useEffect, useState } from "react"
import {
  User,
  Edit2,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const Card = ({ children, className = "" }) => {
  return <div className={`card bg-base-200 shadow-xl ${className}`}>{children}</div>
}

const CardHeader = ({ children, className = "" }) => {
  return <div className={`card-body pb-2 ${className}`}>{children}</div>
}

const CardTitle = ({ children, className = "" }) => {
  return <h2 className={`card-title text-base ${className}`}>{children}</h2>
}

const CardDescription = ({ children, className = "" }) => {
  return <p className={`text-sm opacity-60 ${className}`}>{children}</p>
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`card-body pt-2 ${className}`}>{children}</div>
}

export default function TradingOverviewPage() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [isEditingBroker, setIsEditingBroker] = useState(false)
  const [brokerInput, setBrokerInput] = useState("")
  const [savingBroker, setSavingBroker] = useState(false)
  const [broker, setBroker] = useState("")


  const [stats, setStats] = useState({
    totalTrades: 0,
    activeTrades: 0,
    wonTrades: 0,
    loseTrades: 0,
    breakevenTrades: 0,
    totalPnL: 0,
    winRate: 0,
    monthlyPnL: 0,
    averageWin: 0,
    averageLoss: 0,
  })

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/session")
      const data = await res.json()
      console.log(data);
      setSession(data)
      setBrokerInput(data?.user?.broker || "")
      setLoading(false)
    }
    loadSession()
  }, [])

  const fetchTrades = async () => {
    try {
      const response = await fetch("/api/trades")
      if (response.ok) {
        const data = await response.json()

        // Filter trades for logged-in user
        const userTrades = data.filter((trade) => trade.user === session?.user?.email)
        setTrades(userTrades)
        calculateStats(userTrades)
      }
    } catch (error) {
      console.error("Error fetching trades:", error)
    } finally {
      setLoading(false)
    }
  }

const fetchUserById = async () => {
  try {
    if (!session?.user?.id) return null

    const res = await fetch(`/api/user/${session.user.id}`, {
      method: "GET",
      cache: "no-store",
    })
    
    if (!res.ok) {
      throw new Error("Failed to fetch user")
    }

    const user = await res.json()

    setBroker(user?.broker)
    console.log("FETCHED USER:", user)

    return user
  } catch (error) {
    console.error("FETCH USER ERROR:", error)
    return null
  }
}

  useEffect(() => {
    if (session?.user?.email) {
      fetchTrades()
      fetchUserById()
    }


  }, [session])

  const handleBrokerUpdate = async () => {
    if (!session?.user?.id) return

    setSavingBroker(true)
    try {
      const response = await fetch(`/api/profile/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ broker: brokerInput }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        console.log(updatedUser);
        
        const res = await fetch("/api/session")
       const data = await res.json()
       setSession(data)
      setBrokerInput(data?.user?.broker)
        setIsEditingBroker(false)

      } else {
        console.error("Failed to update broker")
      }
    } catch (error) {
      console.error("Error updating broker:", error)
    } finally {
      setSavingBroker(false)
    }
  }

  const handleCancelBrokerEdit = () => {
    setBrokerInput(session?.user?.broker || "")
    setIsEditingBroker(false)
  }

  const calculateStats = (tradesData) => {
    const total = tradesData.length
    const active = tradesData.filter((t) => !t.result || t.result === "Active").length
    const won = tradesData.filter((t) => t.result === "Win").length
    const lose = tradesData.filter((t) => t.result === "Loss").length
    const breakeven = tradesData.filter((t) => t.result === "Breakeven").length

    // Calculate total PnL (only for Win and Loss trades)
    const totalPnL = tradesData.reduce((sum, trade) => {
      if (trade.result === "Win") {
        return sum + (trade.totalPL || 0)
      } else if (trade.result === "Loss") {
        return sum - Math.abs(trade.totalPL || 0)
      }
      return sum
    }, 0)

    // Calculate monthly PnL (current month)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyPnL = tradesData.reduce((sum, trade) => {
      const tradeDate = new Date(trade.date)
      if (tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear) {
        if (trade.result === "Win") {
          return sum + (trade.totalPL || 0)
        } else if (trade.result === "Loss") {
          return sum - Math.abs(trade.totalPL || 0)
        }
      }
      return sum
    }, 0)

    // Win rate
    const completedTrades = won + lose
    const winRate = completedTrades > 0 ? ((won / completedTrades) * 100).toFixed(1) : 0

    // Average win/loss
    const winTrades = tradesData.filter((t) => t.result === "Win")
    const lossTrades = tradesData.filter((t) => t.result === "Loss")
    const avgWin = winTrades.length > 0 ? winTrades.reduce((sum, t) => sum + (t.totalPL || 0), 0) / winTrades.length : 0
    const avgLoss =
      lossTrades.length > 0 ? lossTrades.reduce((sum, t) => sum + Math.abs(t.totalPL || 0), 0) / lossTrades.length : 0

    setStats({
      totalTrades: total,
      activeTrades: active,
      wonTrades: won,
      loseTrades: lose,
      breakevenTrades: breakeven,
      totalPnL: totalPnL,
      winRate: winRate,
      monthlyPnL: monthlyPnL,
      averageWin: avgWin,
      averageLoss: avgLoss,
    })
  }

  // Prepare chart data
  const pieChartData = [
    { name: "Wins", value: stats.wonTrades, fill: "#06b6d4" },
    { name: "Losses", value: stats.loseTrades, fill: "#ef4444" },
    { name: "Breakeven", value: stats.breakevenTrades, fill: "#f59e0b" },
    { name: "Active", value: stats.activeTrades, fill: "#8b5cf6" },
  ]

  // Monthly performance (last 6 months)
  const getMonthlyData = () => {
    const monthlyData = []
    const currentDate = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const month = date.toLocaleString("default", { month: "short" })
      const year = date.getFullYear()
      const monthNum = date.getMonth()

      const monthPnL = trades.reduce((sum, trade) => {
        const tradeDate = new Date(trade.date)
        if (tradeDate.getMonth() === monthNum && tradeDate.getFullYear() === year) {
          if (trade.result === "Win") {
            return sum + (trade.totalPL || 0)
          } else if (trade.result === "Loss") {
            return sum - Math.abs(trade.totalPL || 0)
          }
        }
        return sum
      }, 0)

      monthlyData.push({ month: `${month}`, pnl: Number.parseFloat(monthPnL.toFixed(2)) })
    }

    return monthlyData
  }

  const monthlyChartData = getMonthlyData()

  // Win/Loss comparison
  const comparisonData = [
    { category: "Avg Win", value: Number.parseFloat(stats.averageWin.toFixed(2)), fill: "#06b6d4" },
    { category: "Avg Loss", value: Number.parseFloat(stats.averageLoss.toFixed(2)), fill: "#ef4444" },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="text-sm text-slate-200">{label}</p>
          <p className="text-sm font-semibold text-cyan-400">
            {payload[0].name}: ${payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="text-sm text-slate-200">{payload[0].name}</p>
          <p className="text-sm font-semibold text-cyan-400">Count: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/bit2.jpeg')",
        }}
      />
      <div className="relative p-4 md:p-6 lg:p-8 space-y-6">
        {/* User Profile Card */}
        <Card className="bg-slate-900 border-2 border-warning backdrop-blur-sm">
  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
    
    {/* Left: Avatar + Name */}
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/20">
        <User className="w-7 h-7 text-purple-600" />
      </div>

      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-secondary to-secondary bg-clip-text text-transparent leading-tight">
          {session?.user?.fullName || "User"}
        </h2>
        <p className="text-xs text-cyan-400">{session?.user?.email}</p>
      </div>
    </div>

    {/* Right: Broker */}
    <div className="flex items-center gap-2 sm:justify-end">
      {!isEditingBroker ? (
        <>
          <p className="text-sm text-slate-300 whitespace-nowrap">
            Broker:
            <span className="ml-1 font-semibold text-secondary">
              {broker.length >1 ? broker : "Not set"}
            </span>
          </p>

          <button
            onClick={() => setIsEditingBroker(true)}
            className="p-1.5 hover:bg-slate-700/50 rounded-md transition-all hover:scale-110"
            aria-label="Edit broker"
          >
            <Edit2 className="w-4 h-4 text-slate-400 hover:text-cyan-400 transition-colors" />
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={brokerInput}
            onChange={(e) => setBrokerInput(e.target.value)}
            placeholder="Broker"
            className="w-36 px-2 py-1 text-sm bg-slate-800/80 border border-slate-600 rounded-md focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
            disabled={savingBroker}
          />

          <button
            onClick={handleBrokerUpdate}
            disabled={savingBroker}
            className="p-1.5 hover:bg-green-900/40 rounded-md transition-all hover:scale-110 disabled:opacity-50"
            aria-label="Save broker"
          >
            <Check className="w-4 h-4 text-green-400" />
          </button>

          <button
            onClick={handleCancelBrokerEdit}
            disabled={savingBroker}
            className="p-1.5 hover:bg-red-900/40 rounded-md transition-all hover:scale-110 disabled:opacity-50"
            aria-label="Cancel"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </>
      )}
    </div>

  </CardContent>
</Card>


        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance bg-secondary to-purple-400 bg-clip-text text-transparent">
            Trading Overview
          </h1>
          <p className="text-muted-foreground text-pretty text-lg">
            Monitor your trading performance and statistics in real-time
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-900/50 border-2 border-secondary backdrop-blur-sm hover:border-cyan-400/60 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Trades</CardTitle>
              <Activity className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.totalTrades}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.activeTrades} currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-2 border-warning backdrop-blur-sm  transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-warning">Total P&L</CardTitle>
              <DollarSign className={`h-5 w-5 ${stats.totalPnL >= 0 ? "text-green-400" : "text-red-400"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stats.totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                ${stats.totalPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-warning">
                {stats.totalPnL >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                All-time performance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-2 border-purple-500/40 backdrop-blur-sm hover:border-purple-400/60 transition-all hover:shadow-lg hover:shadow-purple-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Win Rate</CardTitle>
              <Target className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{stats.winRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.wonTrades} wins / {stats.loseTrades} losses
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-2 border-cyan-400 backdrop-blur-sm hover:border-blue-400/60 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Monthly P&L</CardTitle>
              <Calendar className={`h-5 w-5 ${stats.monthlyPnL >= 0 ? "text-green-400" : "text-red-400"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stats.monthlyPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                ${stats.monthlyPnL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="">
          {/* Trade Distribution Pie Chart */}
          <Card className="border-2 border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-slate-600/60 transition-all md:h-100">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-bold text-lg">Trade Distribution</CardTitle>
              <CardDescription>Breakdown of trade results</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Performance Line Chart */}
        </div>

        {/* Charts Row 2 */}
        <div className="">
          {/* Win/Loss Comparison */}
        

          {/* Performance Insights */}
          <Card className="border-2 border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-slate-600/60 transition-all md:h-100">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-bold text-lg">Performance Insights</CardTitle>
              <CardDescription>Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <Award className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-cyan-400">Risk-Reward Ratio</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.averageLoss > 0 ? `${(stats.averageWin / stats.averageLoss).toFixed(2)}:1` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-400">Total Wins</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.wonTrades} winning trades with avg ${stats.averageWin.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <TrendingDown className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-400">Total Losses</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.loseTrades} losing trades with avg ${stats.averageLoss.toFixed(2)}
                  </p>
                </div>
              </div>

              {stats.winRate < 50 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-950/20 border border-amber-900/50">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-400">Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Your win rate is below 50%. Review your strategy and risk management.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
        

        {/* Recent Activity Summary */}
        <Card className="border-2 border-secondary bg-slate-900/60 backdrop-blur-sm hover:border-cyan-400/60 transition-all">
          <CardHeader>
            <CardTitle className="text-cyan-400 font-bold text-lg">Quick Stats</CardTitle>
            <CardDescription>At a glance overview of your trading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-muted-foreground">Profit Factor</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {stats.averageLoss > 0 && stats.wonTrades > 0
                    ? ((stats.averageWin * stats.wonTrades) / (stats.averageLoss * stats.loseTrades)).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-muted-foreground">Total Completed</p>
                <p className="text-3xl font-bold text-purple-400">
                  {stats.wonTrades + stats.loseTrades + stats.breakevenTrades}
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-muted-foreground">Best Month</p>
                <p className="text-3xl font-bold text-green-400">
                  ${Math.max(...monthlyChartData.map((d) => d.pnl), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
