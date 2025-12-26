"use client"

import { useState, useEffect } from "react"

export default function AdminFinancePage() {
  const [userId, setUserId] = useState(null)
  const [finance, setFinance] = useState({ deposit: 0, withdrawal: 0, equity: 0 })
  const [transactions, setTransactions] = useState([])
  const [totalPnL, setTotalPnL] = useState(0)
  const [type, setType] = useState("deposit")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/session")
      const data = await res.json()
      console.log(data?.user?.id)
      setUserId(data?.user?.id)
      if (data?.user?.id) {
        fetchFinance(data.user.id)
        fetchTrades(data.user.email)
      }
    }
    loadSession()
  }, [])

  const fetchFinance = async (id) => {
    try {
      const response = await fetch(`/api/finance/${id}`)
      const data = await response.json()
      if (response.ok) {
        setFinance({
          deposit: data.deposit || 0,
          withdrawal: data.withdrawal || 0,
          equity: data.equity || 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch finance:", error)
    }
  }

  const fetchTrades = async (currentUserId) => {
    try {
      const response = await fetch("/api/trades")
      const allTrades = await response.json()
      
      if (response.ok && Array.isArray(allTrades)) {
       const userTrades = allTrades.filter(
  (trade) => trade.user=== currentUserId
)

      console.log(userTrades);

        const pnlSum = userTrades.reduce((sum, trade) => {
          return sum + (trade.totalPL || 0)
        }, 0)
        
        setTotalPnL(pnlSum)
      }
    } catch (error) {
      console.error("Failed to fetch trades:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const parsedAmount = Number.parseFloat(amount)

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage({ type: "error", text: "Amount must be a positive number" })
      return
    }

    if (type === "withdrawal" && parsedAmount > finance.equity) {
      setMessage({ type: "error", text: "Insufficient equity for withdrawal" })
      return
    }

    if (!userId) {
      setMessage({ type: "error", text: "User not authenticated" })
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch(`/api/finance/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type,
          amount: parsedAmount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: `${type === "deposit" ? "Deposit" : "Withdrawal"} successful!`,
        })
        setAmount("")

        setTransactions([
          {
            type,
            amount: parsedAmount,
            timestamp: new Date().toISOString(),
          },
          ...transactions,
        ])

        await fetchFinance(userId)
        await fetchTrades(userId)
      } else {
        setMessage({ type: "error", text: data.error || "Transaction failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{
          backgroundImage: "url('/bit2.jpeg')",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-white/10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warning mb-3 tracking-tight">
              Finance Management
            </h1>
            <p className="text-gray-300 text-base md:text-lg">Manage your deposits, withdrawals, and equity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl border border-green-500/30 p-6 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-green-200 text-sm md:text-base font-semibold uppercase tracking-wider">
                  Total Deposit
                </h3>
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                ${finance.deposit.toLocaleString()}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl border border-red-500/30 p-6 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-red-200 text-sm md:text-base font-semibold uppercase tracking-wider">
                  Total Withdrawal
                </h3>
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                ${finance.withdrawal.toLocaleString()}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl border border-blue-500/30 p-6 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-blue-200 text-sm md:text-base font-semibold uppercase tracking-wider">
                  Current Equity
                </h3>
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                ${finance.equity.toLocaleString()}
              </p>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl border border-purple-500/30 p-6 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-purple-200 text-sm md:text-base font-semibold uppercase tracking-wider">
                  Total Account
                </h3>
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                ${(finance.equity + totalPnL).toLocaleString()}
              </p>
              <p
                className={`text-sm md:text-base mt-2 font-semibold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toLocaleString()} PnL
              </p>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-black/40 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-8 md:p-10 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">New Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label pb-3">
                    <span className="label-text text-white text-lg font-semibold">Transaction Type</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setType("deposit")}
                      className={`btn btn-lg ${
                        type === "deposit" ? "btn-secondary" : "bg-white/5 border-white/20 hover:bg-white/10 text-white"
                      } transition-all duration-200`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Deposit
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("withdrawal")}
                      className={`btn btn-lg ${
                        type === "withdrawal"
                          ? "btn-secondary"
                          : "bg-white/5 border-white/20 hover:bg-white/10 text-white"
                      } transition-all duration-200`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      Withdrawal
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label pb-3">
                    <span className="label-text text-white text-lg font-semibold">Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className="input input-lg w-full bg-white/5 border-white/20 focus:border-secondary focus:bg-white/10 text-white placeholder:text-gray-500 text-2xl backdrop-blur-sm transition-all duration-200"
                    required
                  />
                </div>

                {message.text && (
                  <div
                    className={`backdrop-blur-md rounded-xl p-4 border ${
                      message.type === "success"
                        ? "bg-green-500/20 border-green-500/40 text-green-200"
                        : "bg-red-500/20 border-red-500/40 text-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {message.type === "success" ? (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      <span className="text-sm md:text-base font-medium">{message.text}</span>
                    </div>
                  </div>
                )}

                <div className="form-control pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-secondary btn-lg w-full text-base md:text-lg font-semibold backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-md"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Process {type === "deposit" ? "Deposit" : "Withdrawal"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 backdrop-blur-md bg-secondary/10 rounded-2xl p-5 border border-secondary/30">
            <div className="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-secondary shrink-0 w-6 h-6 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                All transactions are securely processed and recorded. Your equity is updated in real-time after each
                transaction. Ensure sufficient equity before making withdrawals.
              </p>
            </div>
          </div>

          {transactions.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center backdrop-blur-sm bg-black/20 rounded-2xl p-4 border border-white/10">
                Transaction History
              </h2>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-xl rounded-2xl border overflow-hidden hover:scale-[1.01] transition-all duration-300 ${
                      transaction.type === "deposit"
                        ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50"
                        : "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                    }`}
                  >
                    <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            transaction.type === "deposit" ? "bg-green-500/20" : "bg-red-500/20"
                          }`}
                        >
                          {transaction.type === "deposit" ? (
                            <svg
                              className="w-6 h-6 text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white capitalize">{transaction.type}</h3>
                          <p className="text-gray-400 text-sm md:text-base">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-2xl md:text-3xl font-bold ${
                            transaction.type === "deposit" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
