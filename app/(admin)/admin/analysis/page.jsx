"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AnalysisPage() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState(null)

  // Form state
  const [heading, setHeading] = useState("")
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Fetch user session and analyses on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user session
        const sessionRes = await fetch("/api/session")
        if (!sessionRes.ok) {
          router.push("/login")
          return
        }
        const sessionData = await sessionRes.json()
        setUserId(sessionData.user.id)

        // Fetch analyses
        const analysisRes = await fetch(`/api/analysis?userId=${sessionData.user.id}`)
        if (analysisRes.ok) {
          const data = await analysisRes.json()
          // Reverse to show newest first
          setAnalyses([...(data.analysis || [])].reverse())
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!heading.trim() || !text.trim()) {
      setError("Both heading and text are required")
      return
    }

    if (heading.length > 150) {
      setError("Heading must be 150 characters or less")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, heading, text }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Analysis added successfully!")
        setHeading("")
        setText("")
        // Add new analysis to the top of the list
        setAnalyses([{ heading, text }, ...analyses])

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message || "Failed to add analysis")
      }
    } catch (err) {
      console.error("Submit error:", err)
      setError("Failed to add analysis")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-theme="dark">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-secondary"></span>
          <p className="mt-4 text-base-content/70 font-medium">Loading analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" data-theme="dark">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
        style={{
          backgroundImage: "url('/bit2.jpeg')",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-neutral/98 via-base-300/95 to-neutral/98" />

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary mb-2 tracking-tight">Trading Analysis</h1>
          <p className="text-cyan-500 text-lg">Document your market insights and trading strategies</p>
        </div>

        <div className="mb-12">
          <div className="card bg-purple-900/20 backdrop-blur-md shadow-xl border border-base-content/10">
            <div className="card-body p-8">
              <h2 className="card-title text-2xl text-success mb-6">Create New Analysis</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/90 font-medium">Analysis Title</span>
                    <span className={`label-text-alt ${heading.length > 140 ? "text-error" : "text-base-content/50"}`}>
                      {heading.length}/150
                    </span>
                  </label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="EUR/USD Breakout Analysis - January 2024"
                    className="input input-bordered input-secondary w-full bg-base-300/80 text-white placeholder:text-base-content/40"
                    maxLength={150}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white/90 font-medium">Detailed Analysis</span>
                    <span className="label-text-alt text-base-content/50">
                      {text.length > 0 ? `${text.length} characters` : ""}
                    </span>
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your comprehensive trading analysis here...&#10;&#10;Include market conditions, entry/exit strategies, risk management, and lessons learned."
                    className="textarea textarea-bordered textarea-secondary w-full min-h-[180px] bg-base-300/80 text-white placeholder:text-base-content/40 leading-relaxed"
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                <div className="form-control pt-2">
                  <button type="submit" disabled={submitting} className="btn btn-secondary btn-lg w-full font-semibold">
                    {submitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Adding Analysis...
                      </>
                    ) : (
                      "Add Analysis"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-cyan-500">Your Analysis</h2>
            <div className="badge badge-secondary badge-lg gap-2 font-semibold">
              {analyses.length} {analyses.length === 1 ? "Entry" : "Entries"}
            </div>
          </div>

          {analyses.length === 0 ? (
            <div className="card bg-base-200/70 backdrop-blur-md border border-base-content/10">
              <div className="card-body items-center text-center py-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 text-secondary/50 mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-white mb-2">No Analysis Yet</h3>
                <p className="text-base-content/60 text-lg max-w-md mb-6">
                  Start documenting your trading insights and analysis. Create your first entry above.
                </p>
                <button
                  onClick={() => document.querySelector('input[type="text"]')?.focus()}
                  className="btn btn-secondary"
                >
                  Create First Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {analyses.map((analysis, index) => (
                <div
                  key={index}
                  className="card bg-base-200/70 backdrop-blur-md shadow-lg border border-base-content/10 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-3">
                      <div className="badge badge-secondary font-semibold">#{analyses.length - index}</div>
                      {index === 0 && <div className="badge badge-outline badge-secondary text-xs">Latest</div>}
                    </div>
                    <h3 className="card-title text-white text-lg mb-3 line-clamp-2">{analysis.heading}</h3>
                    <div className="divider my-0"></div>
                    <p className="text-base-content/70 whitespace-pre-wrap leading-relaxed line-clamp-6">
                      {analysis.text}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <div className="text-xs text-base-content/50">{index === 0 ? "Just now" : "Recently added"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
