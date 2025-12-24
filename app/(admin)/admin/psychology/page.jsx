"use client"

import {
  Brain,
  TrendingUp,
  Shield,
  Clock,
  Target,
  AlertTriangle,
  Award,
  BookOpen,
  Heart,
  Eye,
  Repeat,
  CheckCircle2,
  CheckCircle,
} from "lucide-react"

export default function PsychologyPage() {
  const chapters = [
    {
      icon: Brain,
      title: "The Identity Shift",
      subtitle: "From Retail to Professional",
      points: [
        "A professional trader does not need to trade every day",
        "Does not need to be right - only needs to execute correctly",
        "You are a risk manager first, trader second",
        "Profits are a byproduct of correct risk behavior",
      ],
    },
    {
      icon: Target,
      title: "Probability Thinking",
      subtitle: "The Core Mental Edge",
      points: [
        "Every trade is random - one trade means nothing",
        "A series of trades defines performance",
        "You cannot control outcomes, only execution",
        "Detach from results - your job is to execute rules",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Fear Management",
      subtitle: "Why Good Setups Are Missed",
      points: [
        "Fear appears when risk is too high or confidence is low",
        "FOMO causes late entries and chasing candles",
        "If you missed the move, you missed the trade",
        "Solution: Reduce risk, trade smaller, build data not hope",
      ],
    },
    {
      icon: TrendingUp,
      title: "Greed Control",
      subtitle: "The Silent Account Killer",
      points: [
        "Greed disguises itself as 'opportunity'",
        "Overtrading: Max trades per day, max daily risk",
        "Never cancel take profits or hold without structure",
        "Your plan exits the trade - not your emotions",
      ],
    },
    {
      icon: Shield,
      title: "Loss Management",
      subtitle: "Where Traders Break",
      points: [
        "Losses are expected, planned, and necessary",
        "Never attempt to 'make back' a loss",
        "After a loss: Step away, review rules, reset mentally",
        "A trader who avoids losses avoids growth",
      ],
    },
    {
      icon: Eye,
      title: "Ego & Being Right",
      subtitle: "The Market Is Always Right",
      points: [
        "Ego says 'It must reverse' - Market says 'Prove it with structure'",
        "The chart is always right, not your opinion",
        "Trading to impress others destroys discipline",
        "Professionals trade quietly without validation",
      ],
    },
    {
      icon: Repeat,
      title: "Consistency Engineering",
      subtitle: "Same Process Every Day",
      points: [
        "Same session, same model, same rules, same risk",
        "Changing strategies after losses is emotional behavior",
        "Daily routine: HTF analysis → Mark liquidity → Define bias → Wait → Execute",
        "Routine builds discipline",
      ],
    },
    {
      icon: Clock,
      title: "Patience",
      subtitle: "The Rarest Skill",
      points: [
        "Waiting is a position - most time should be spent not trading",
        "No trade is a valid trade",
        "Quality over quantity: One A+ setup beats 10 random trades",
        "Professional scalpers wait for perfection",
      ],
    },
    {
      icon: Award,
      title: "Confidence",
      subtitle: "Built, Not Assumed",
      points: [
        "Confidence comes from backtesting and journaling",
        "It's not belief - it's data-driven certainty",
        "Process confidence: Follow rules = Win long-term",
        "Even after losing streaks, trust the process",
      ],
    },
    {
      icon: BookOpen,
      title: "Trading Journal",
      subtitle: "The Mind Mirror",
      points: [
        "Journal: Setup quality, rule compliance, emotional state",
        "Review for behavior, not money",
        "Ask: Did I follow rules? Did emotions interfere?",
        "The journal reveals patterns you can't see live",
      ],
    },
    {
      icon: Heart,
      title: "Drawdowns & Recovery",
      subtitle: "Every Pro Experiences Them",
      points: [
        "Drawdowns are normal and expected",
        "During drawdown: Reduce size, trade less, focus on execution",
        "Do not strategy-hop - stick to your system",
        "Most traders fail because they abandon edge too early",
      ],
    },
    {
      icon: CheckCircle2,
      title: "The Final Mental Edge",
      subtitle: "The Trader's Oath",
      points: [
        "I do not predict, I do not chase, I do not revenge",
        "I execute my rules consistently",
        "Discipline is the edge, psychology protects it",
        "When strategy and psychology align, consistency becomes inevitable",
      ],
    },
  ]

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/bit3.jpeg')" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-secondary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">THE TRADER'S MIND</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            A Professional Psychology Rulebook for Smart Money Traders
          </p>
        </div>

        <div className="card bg-neutral/30 backdrop-blur-md border border-secondary/30 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-secondary" />
              <h2 className="card-title text-2xl text-secondary">Why Most Traders Fail</h2>
            </div>
            <div className="text-slate-300 space-y-3">
              <p className="text-lg">
                Markets do not defeat traders.{" "}
                <span className="text-secondary font-bold">Traders defeat themselves.</span>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {["Emotional Interference", "Ego-Driven Decisions", "Inconsistency", "Rule Violations"].map((item) => (
                  <div
                    key={item}
                    className="p-3 bg-neutral/40 backdrop-blur-sm rounded-lg text-center border border-slate-700"
                  >
                    <p className="text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-lg font-bold text-secondary mt-4">
                "The market rewards discipline, not intelligence."
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className="card bg-neutral/20 backdrop-blur-md border border-slate-700 hover:border-secondary/50 transition-all duration-300 shadow-lg"
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                    <chapter.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="card-title text-lg text-secondary">{chapter.title}</h3>
                    <p className="text-xs text-slate-400">{chapter.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {chapter.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 mt-1 text-secondary flex-shrink-0" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card bg-gradient-to-r from-secondary/10 to-neutral/20 backdrop-blur-md border border-secondary/30">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-secondary mb-4">The Ultimate Truth</h2>
            <div className="space-y-2">
              <p className="text-lg text-slate-300">
                <span className="font-bold text-secondary">Discipline</span> is the edge
              </p>
              <p className="text-lg text-slate-300">
                <span className="font-bold text-secondary">Psychology</span> protects the edge
              </p>
              <p className="text-lg text-slate-300">
                <span className="font-bold text-secondary">Execution</span> compounds the edge
              </p>
            </div>
            <p className="text-xl font-semibold text-secondary mt-4">
              When strategy and psychology align, consistency becomes inevitable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
