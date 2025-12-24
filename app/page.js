"use client"

import { TrendingUp, BarChart3, LineChart, Zap, Shield, Target, DollarSign } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const [isVisible, setIsVisible] = useState(false)
    const [session, setSession] = useState(null)
    const path = usePathname()

  useEffect(() => {
    setIsVisible(true)
    loadData()
  }, [])

  const loadData = async () => {
  try {
    const sessionRes = await fetch("/api/session")
    const sessionData = await sessionRes.json()
    setSession(sessionData)

  } catch (error) {
    console.error("Error loading data:", error)
  } 
}

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral">
      {/* Background Image with Low Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('bit2.jpeg')",
        }}
      />

      {/* Animated Trading Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <TrendingUp
          className="absolute top-20 left-10 text-secondary w-12 h-12 animate-bounce opacity-20"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <BarChart3
          className="absolute top-40 right-20 text-secondary w-16 h-16 animate-pulse opacity-20"
          style={{ animationDelay: "1s" }}
        />
        <LineChart
          className="absolute bottom-40 left-20 text-secondary w-14 h-14 animate-bounce opacity-20"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        />
        <DollarSign
          className="absolute top-60 right-40 text-secondary w-10 h-10 animate-ping opacity-10"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">

        {/* Hero Section */}
        <div className="hero h-[80vh]">
          <div className="hero-content text-center">
            <div
              className={`max-w-4xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="mb-6 relative">
                <div className="absolute inset-0 blur-3xl bg-secondary/20 animate-pulse" />
                <h1 className="text-5xl md:text-6xl font-bold mb-4 relative bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Transform Your Trading Journey
                </h1>
              </div>

              <p className="text-lg md:text-xl mb-6 text-neutral-content/90">
                Your partner in building a successful trading career with advanced tools and proven strategies.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a href={`${session?.user ? "trade" : "signin"}`} className="btn btn-secondary btn-lg gap-2 hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                  Start Journaling Now
                </a>
              </div>

              {/* Stats */}
              <div className="stats stats-vertical lg:stats-horizontal shadow-2xl bg-neutral-focus/90 backdrop-blur-md">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Success Rate</div>
                  <div className="stat-value text-secondary">98%</div>
                </div>

                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Average ROI</div>
                  <div className="stat-value text-secondary">247%</div>
                </div>

                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Active Traders</div>
                  <div className="stat-value text-secondary">50K+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-secondary">
              Your Success Is Our Mission
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="card bg-neutral-focus/90 backdrop-blur-md shadow-xl hover:shadow-secondary/20 hover:scale-105 transition-all duration-300">
                <div className="card-body items-center text-center">
                  <div className="p-4 bg-secondary/20 rounded-full mb-3">
                    <BarChart3 className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="card-title text-xl">Advanced Analytics</h3>
                  <p className="text-neutral-content/80 text-sm">
                    Real-time market analysis powered by AI to give you the edge.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card bg-neutral-focus/90 backdrop-blur-md shadow-xl hover:shadow-secondary/20 hover:scale-105 transition-all duration-300">
                <div className="card-body items-center text-center">
                  <div className="p-4 bg-secondary/20 rounded-full mb-3">
                    <Shield className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="card-title text-xl">Risk Management</h3>
                  <p className="text-neutral-content/80 text-sm">
                    Intelligent controls that protect your capital while maximizing returns.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card bg-neutral-focus/90 backdrop-blur-md shadow-xl hover:shadow-secondary/20 hover:scale-105 transition-all duration-300">
                <div className="card-body items-center text-center">
                  <div className="p-4 bg-secondary/20 rounded-full mb-3">
                    <Zap className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="card-title text-xl">Lightning Fast</h3>
                  <p className="text-neutral-content/80 text-sm">
                    Execute trades in milliseconds and never miss an opportunity.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA - Inline */}
            <div className="mt-12 text-center">
              <div className="card bg-gradient-to-br from-secondary/20 to-primary/20 backdrop-blur-md shadow-2xl max-w-3xl mx-auto">
                <div className="card-body items-center p-8">
                  <h2 className="card-title text-3xl md:text-4xl mb-4 text-warning">Ready to Change Your Life?</h2>
                  <p className="text-lg mb-6 text-neutral-content/90">
                    Join thousands of successful traders who have transformed their financial future with TradersHub.
                  </p>
                  <a href={`${session?.user ? "trade" : "signin"}`} className="btn btn-secondary btn-lg gap-2 hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                    Begin Your Journey
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer footer-center p-6 bg-neutral-focus/90 backdrop-blur-md text-neutral-content">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-8 h-8 text-secondary" />
              <span className="text-2xl font-bold text-secondary">TradersHub</span>
            </div>
            <p className="text-sm">Empowering Traders Since 2024 | Copyright © 2025</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
