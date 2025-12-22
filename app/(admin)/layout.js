"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  FileText,
  BarChart3,
  Brain,
  Target,
  Shield,
  Menu,
  X,
} from "lucide-react"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = [
    { title: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "Financial Summary", href: "/admin/financial-summary", icon: <DollarSign className="w-5 h-5" /> },
    { title: "Trades", href: "/admin/trades", icon: <TrendingUp className="w-5 h-5" /> },
    { title: "Notes", href: "/admin/notes", icon: <FileText className="w-5 h-5" /> },
    { title: "Analysis", href: "/admin/analysis", icon: <BarChart3 className="w-5 h-5" /> },
    { title: "Psychology", href: "/admin/psychology", icon: <Brain className="w-5 h-5" /> },
    { title: "Mission", href: "/admin/mission", icon: <Target className="w-5 h-5" /> },
    { title: "Rules", href: "/admin/rules", icon: <Shield className="w-5 h-5" /> },
  ]

  const [session, setSession] = useState(null)

  const router = useRouter()
  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/session")
      const data = await res.json()
      setSession(data)
    }
    loadSession()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="drawer lg:drawer-open  bg-slate-950">
      <input
        id="admin-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isMobileMenuOpen}
        onChange={toggleMobileMenu}
      />
      <div className="drawer-content flex flex-col bg-slate-950">
        {/* Navbar */}
        <div className="w-full navbar bg-slate-900 border-b border-slate-800 lg:hidden">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost text-secondary hover:bg-slate-800">
              <Menu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold text-warning">Trading Dashboard</span>
          </div>
        </div>
        {/* Page content */}
        <div className="p-4 min-h-screen">{children}</div>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <aside className="w-64 bg-slate-900 border-r border-slate-800 text-base-content h-full">
          <div className="p-4 flex justify-between items-center border-b border-slate-800 lg:hidden">
            <span className="text-xl font-bold text-secondary">Menu</span>
            <button onClick={toggleMobileMenu} className="btn btn-square btn-ghost text-secondary hover:bg-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="hidden lg:block p-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-warning">Trading Dashboard</h2>
          </div>
          <ul className="menu p-4 w-full">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    pathname === link.href
                      ? "bg-secondary/20 text-secondary border-l-4 border-secondary"
                      : "text-slate-300 hover:bg-slate-800 hover:text-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={pathname === link.href ? "text-secondary" : "text-slate-400"}>{link.icon}</span>
                  <span className="font-medium">{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
