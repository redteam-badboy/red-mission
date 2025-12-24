"use client"
import {
  Shield,
  Clock,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
  Brain,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react"

export default function RulesPage() {
  const rulesSections = [
    {
      id: 1,
      title: "Market & Session Rules",
      icon: <Clock className="w-6 h-6" />,
      items: [
        "Trade only high liquidity markets: Indices, Major FX, Gold, Bitcoin",
        "London Session: 08:00 – 11:00 UTC",
        "New York Session: 13:00 – 16:00 UTC",
        "No low-liquidity pairs or random altcoins",
      ],
    },
    {
      id: 2,
      title: "Market Structure",
      icon: <TrendingUp className="w-6 h-6" />,
      items: [
        "Define HTF bias using Daily & H4 timeframes",
        "Higher Highs/Lows = Bullish, Lower Highs/Lows = Bearish",
        "Trade with BOS (Break of Structure)",
        "Countertrend only after HTF liquidity sweep + CHoCH",
      ],
    },
    {
      id: 3,
      title: "Liquidity Rules",
      icon: <Target className="w-6 h-6" />,
      items: [
        "Identify liquidity at equal highs/lows, session extremes, PDH/PDL",
        "Price must sweep liquidity, reject with displacement, shift structure",
        "No entries without liquidity taken",
        "No chasing candles",
      ],
    },
    {
      id: 4,
      title: "Entry Model",
      icon: <CheckCircle className="w-6 h-6" />,
      items: [
        "HTF bias aligned",
        "Liquidity taken + Displacement confirmed",
        "CHoCH or BOS present",
        "FVG or Order Block identified",
        "Entry at 50% of FVG or 50-75% of OB",
      ],
    },
    {
      id: 5,
      title: "Risk Management",
      icon: <DollarSign className="w-6 h-6" />,
      items: [
        "Risk 0.5% – 1% per trade",
        "Max daily risk: 2%",
        "Max 2 trades per day",
        "Minimum R:R 1:3 (scalps), 1:5+ (intraday)",
        "Never move SL to avoid loss",
      ],
    },
    {
      id: 6,
      title: "News & Fundamentals",
      icon: <AlertTriangle className="w-6 h-6" />,
      items: [
        "No entries 5 min before/after high impact news",
        "CPI, NFP, FOMC = no trade zone",
        "Liquidity events ≠ trade signals",
      ],
    },
    {
      id: 7,
      title: "Psychology & Discipline",
      icon: <Brain className="w-6 h-6" />,
      items: [
        "No trading when angry, tired, or chasing losses",
        "Losses are business expenses and data points",
        "Accept losses as statistically necessary",
        "No revenge trading",
      ],
    },
    {
      id: 8,
      title: "Journaling & Review",
      icon: <BookOpen className="w-6 h-6" />,
      items: [
        "Record HTF bias, liquidity level, entry model, R:R",
        "Take screenshots before & after",
        "Weekly review: win rate, avg R:R, rule violations",
        "Remove low-quality setups from system",
      ],
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Low Opacity */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/bit.jpeg')" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-secondary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">Trading Rulebook</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">Smart Money Concepts + Price Action Trading System</p>
        </div>

        {/* Edge Definition Card */}
        <div className="card bg-neutral/30 backdrop-blur-md border border-secondary/30 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-secondary" />
              <h2 className="card-title text-2xl text-secondary">Your Trading Edge</h2>
            </div>
            <div className="text-slate-300 space-y-2">
              <p className="text-lg">Your edge is NOT prediction. Your edge is:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Trading where liquidity is taken</li>
                <li>Entering after institutions reveal intent</li>
                <li>Risking small to gain big</li>
                <li>Repeating the same model with discipline</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rulesSections.map((section) => (
            <div
              key={section.id}
              className="card bg-neutral/20 backdrop-blur-md border border-slate-700 hover:border-secondary/50 transition-all duration-300 shadow-lg"
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-secondary/20 text-secondary">{section.icon}</div>
                  <h3 className="card-title text-xl text-secondary">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 mt-1 text-secondary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 card bg-gradient-to-r from-secondary/10 to-neutral/20 backdrop-blur-md border border-secondary/30">
          <div className="card-body text-center">
            <p className="text-xl font-semibold text-secondary">
              Discipline + Consistency + Risk Management = Long-term Success
            </p>
            <p className="text-slate-400 mt-2">Review these rules daily and journal every trade</p>
          </div>
        </div>
      </div>
    </div>
  )
}
