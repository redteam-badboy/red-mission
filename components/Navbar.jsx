"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, LogIn, UserPlus, LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import UserAvatar from "@/components/user-avatar"
import { signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/session")
      const data = await res.json()
      setSession(data)
      setLoading(false)
    }
    loadSession()
  }, [pathname])

  const handleSignOut = async () => {
    try {
      await signOut()
      setSession(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-100 shadow-secondary">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold hover:text-secondary transition-colors duration-200"
          >
            <span className="text-secondary">The Mission Trader</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
            >
              <Home className="w-4 h-4 text-secondary" />
              <span>Home</span>
            </Link>

            {!session ? (
              <>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4 text-secondary" />
                  <span>Sign Up</span>
                </Link>
                <Link
                  href="/signin"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-content hover:opacity-90 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 text-secondary" />
                  <span>Sign In</span>
                </Link>
              </>
            ) : (
              <>
              <Link
                  href="/trade"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-secondary" />
                  <span>Trade</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-secondary" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 text-secondary" />
                  <span>Sign Out</span>
                </button>
                {/* User avatar section */}
                <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-700">
                  <UserAvatar  fullName={session?.user?.fullName} />
                  <span className="text-sm font-medium text-secondary">{session?.user?.fullName}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary hover:text-secondary-content transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col gap-2">
              {session && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-800 rounded-lg">
                  <UserAvatar fullName={session?.user?.fullName} />
                  <span className="text-sm font-medium">{session?.user?.fullName}</span>
                </div>
              )}

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              {!session ? (
                <>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary text-secondary-content hover:opacity-90 transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/trade"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Trade</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary hover:text-secondary-content transition-all duration-200 text-left w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
