"use client"
import {
  Target,
  TrendingUp,
  User,
  BarChart3,
  Calendar,
  Shield,
  AlertCircle,
  BookOpen,
  Heart,
  Compass,
  Award,
  CheckCircle,
} from "lucide-react"

export default function MissionPage() {
  const missionSections = [
    {
      id: 1,
      title: "The Mission Statement",
      icon: <Target className="w-6 h-6" />,
      items: [
        "Master myself through the markets",
        "Capital growth is the measurement — discipline is the objective",
        "Build skill, consistency, and freedom through competence",
        "Think in decades, not days",
      ],
    },
    {
      id: 2,
      title: "The Trader's Identity",
      icon: <User className="w-6 h-6" />,
      items: [
        "Calm under pressure",
        "Patient by default",
        "Ruthless with rules",
        "Detached from outcomes",
        "Not impulsive, reactive, or emotional",
      ],
    },
    {
      id: 3,
      title: "Progress Stages",
      icon: <TrendingUp className="w-6 h-6" />,
      items: [
        "Observer: Understanding structure and journaling",
        "Executor: Trading one model with consistency",
        "Risk Manager: Protecting capital and reducing drawdowns",
        "Professional: Process-driven and emotionally neutral",
        "Master: Effortless execution with minimal screen time",
      ],
    },
    {
      id: 4,
      title: "Mission Metrics",
      icon: <BarChart3 className="w-6 h-6" />,
      items: [
        "Primary: Rule adherence, emotional control, patience",
        "Primary: Journal quality and discipline during losses",
        "Secondary: Monthly expectancy and drawdown control",
        "If discipline improves, money will follow",
      ],
    },
    {
      id: 5,
      title: "Daily Mission Practice",
      icon: <Calendar className="w-6 h-6" />,
      items: [
        "Was I patient today?",
        "Did I wait for confirmation?",
        "Did I follow risk rules?",
        "Did emotions interfere?",
        "No trade is allowed to violate the mission",
      ],
    },
    {
      id: 6,
      title: "The Trader's Code",
      icon: <Shield className="w-6 h-6" />,
      items: [
        "I protect capital above all",
        "I do not chase markets",
        "I trade only my model",
        "I accept losses professionally",
        "I never trade emotionally",
        "I value discipline over money",
      ],
    },
    {
      id: 7,
      title: "Failure & Mission Reset",
      icon: <AlertCircle className="w-6 h-6" />,
      items: [
        "Failure is breaking rules, not taking losses",
        "After drawdowns: reduce size, revisit rules",
        "Trade less and re-anchor mission",
        "Never abandon the mission — only refine it",
      ],
    },
    {
      id: 8,
      title: "Life Integration",
      icon: <Heart className="w-6 h-6" />,
      items: [
        "Trading is part of life, not life itself",
        "Maintain health, relationships, and balance",
        "Burnout kills edge",
        "Freedom is the end goal: time autonomy and mental clarity",
      ],
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Low Opacity */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/bit2.jpeg')" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="w-12 h-12 text-secondary" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">The Trader's Mission Book</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            A Lifetime Framework for Mastery, Progress, and Purpose
          </p>
        </div>

        {/* Core Mission Card */}
        <div className="card bg-neutral/30 backdrop-blur-md border border-secondary/30 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-secondary" />
              <h2 className="card-title text-2xl text-secondary">The Core Truth</h2>
            </div>
            <div className="text-slate-300 space-y-2">
              <p className="text-lg font-semibold">
                Trading is not a job. Trading is not a hustle. Trading is a craft.
              </p>
              <p className="text-md italic">
                "A trader without a mission will always trade emotionally. A trader with a mission is never rushed."
              </p>
              <p className="text-md mt-4">
                This mission exists to track growth beyond money, anchor discipline through all market conditions, and
                turn trading into a lifelong mission of mastery.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missionSections.map((section) => (
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

        {/* Final Mission Statement */}
        <div className="mt-12 card bg-gradient-to-r from-secondary/10 to-neutral/20 backdrop-blur-md border border-secondary/30">
          <div className="card-body text-center">
            <BookOpen className="w-10 h-10 text-secondary mx-auto mb-4" />
            <p className="text-xl font-semibold text-secondary mb-2">The Final Mission Statement</p>
            <p className="text-lg text-slate-300">
              I trade to master discipline. I master discipline to gain freedom. I gain freedom to live deliberately.
            </p>
            <p className="text-md text-slate-400 mt-4 italic">A disciplined trader with a mission is timeless.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
