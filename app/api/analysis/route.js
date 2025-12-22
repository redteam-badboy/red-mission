export const runtime = "nodejs"

import { NextResponse } from "next/server"
import connectDB from "@/lib/connectdb"
import User from "@/models/user-model"

/* ---------------- CREATE ANALYSIS ---------------- */
export async function POST(req) {
  try {
    await connectDB()

    const { userId, heading, text } = await req.json()

    if (!userId || !heading || !text) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    user.analysis.push({ heading, text })
    await user.save()

    return NextResponse.json(
      {
        message: "Analysis added successfully",
        analysis: user.analysis,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create analysis error:", error)
    return NextResponse.json(
      { message: "Failed to create analysis", error: error.message },
      { status: 500 }
    )
  }
}

/* ---------------- GET ALL ANALYSIS ---------------- */
export async function GET(req) {
  try {
    await connectDB()

    // userId passed as query param → /api/analysis?userId=123
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      )
    }

    const user = await User.findById(userId).select("analysis")

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { analysis: user.analysis },
      { status: 200 }
    )
  } catch (error) {
    console.error("Fetch analysis error:", error)
    return NextResponse.json(
      { message: "Failed to fetch analysis", error: error.message },
      { status: 500 }
    )
  }
}
