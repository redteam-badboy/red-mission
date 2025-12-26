"use client"

import { useState, useEffect } from "react"

export default function AdminNotesPage() {
  const [userId, setUserId] = useState(null)
  const [notes, setNotes] = useState([])
  const [heading, setHeading] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/session")
      const data = await res.json()
      console.log(data?.user?.id)
      setUserId(data?.user?.id)
      if (data?.user?.id) {
        fetchNotes(data.user.id)
      }
    }
    loadSession()
  }, [])

  const fetchNotes = async (id) => {
    try {
      const response = await fetch(`/api/user/${id}`)
      const data = await response.json()
      if (response.ok && data.notes) {
        setNotes(data.notes)
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!heading.trim() || !text.trim()) {
      setMessage({ type: "error", text: "Both heading and text are required" })
      return
    }

    if (heading.length > 150) {
      setMessage({ type: "error", text: "Heading must be 150 characters or less" })
      return
    }

    if (!userId) {
      setMessage({ type: "error", text: "User not authenticated" })
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const newNote = {
        heading: heading.trim(),
        text: text.trim(),
      }

      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: [...notes, newNote],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Note added successfully!" })
        setHeading("")
        setText("")
        await fetchNotes(userId)
      } else {
        setMessage({ type: "error", text: data.message || "Failed to add note" })
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12 backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-white/10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warning mb-3 tracking-tight">Admin Notes</h1>
            <p className="text-secondary text-base md:text-lg">Create and manage your personal notes</p>
          </div>

          <div className="backdrop-blur-xl bg-black/40 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-8 md:p-10 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label pb-3">
                    <span className="label-text text-white text-lg font-semibold">Note Heading</span>
                    <span className="label-text-alt text-secondary text-sm font-medium">{heading.length}/150</span>
                  </label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="Enter a descriptive heading..."
                    className="input w-full bg-white/5 border-white/20 focus:border-secondary focus:bg-white/10 text-white placeholder:text-gray-500 text-base backdrop-blur-sm transition-all duration-200"
                    maxLength={150}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-3">
                    <span className="label-text text-white text-lg font-semibold">Note Content</span>
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your note content here..."
                    className="textarea w-full h-48 md:h-56 bg-white/5 border-white/20 focus:border-secondary focus:bg-white/10 text-white placeholder:text-gray-500 text-base backdrop-blur-sm transition-all duration-200 resize-none"
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
                        Adding Note...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Note
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
                Notes are securely saved to your account and can be accessed anytime from your dashboard. All data is
                encrypted and stored safely.
              </p>
            </div>
          </div>

          {notes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center backdrop-blur-sm bg-black/20 rounded-2xl p-4 border border-white/10">
                Your Notes
              </h2>
              <div className="space-y-6">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-xl bg-black/30 rounded-2xl border border-white/10 overflow-hidden hover:bg-black/40 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/40"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-xl md:text-2xl font-bold text-white flex-1 break-words">{note.heading}</h3>
                        <span className="badge badge-secondary badge-lg shrink-0">Note {index + 1}</span>
                      </div>
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
                        {note.text}
                      </p>
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
