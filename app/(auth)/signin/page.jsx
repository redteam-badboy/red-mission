"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, signIn } from "next-auth/react" // use next-auth/react, not "@/auth"

export default function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.target)
    const email = formData.get("email")
    const password = formData.get("password")

const res = await signIn("credentials", {
  redirect: false,
  email,
  password,
})

setLoading(false)

if (res?.error) {
  setError("Invalid email or password")
  return
}

setSuccess(true)

// 🔄 Refresh NextAuth session
await getSession()

setTimeout(() => {
  router.push("/dashboard")
}, 500)

  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {success && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl border bg-green-900 border-green-700 text-green-200">
          Signed in successfully!
        </div>
      )}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl border bg-red-900 border-red-700 text-red-200">
          {error}
        </div>
      )}

      <div className="w-full max-w-md bg-gray-800 rounded-3xl border border-gray-700 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-sm md:text-base">Sign in to continue to your account</p>
        </div>

        {/* Client-side handleSubmit */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={loading || success}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={loading || success}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg"
          >
            {loading ? "Signing in..." : success ? "Redirecting..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
