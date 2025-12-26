export const runtime = "nodejs"

import { NextResponse } from "next/server"
import connectDB from "@/lib/connectdb"
import User from "@/models/user-model"

// ------------------------------------
// POST → Deposit / Withdraw (by user id)
// ------------------------------------
export async function POST(req, { params }) {
  try {
    await connectDB()

    const { id } = await params
    const { type, amount } = await req.json()

    // 🔒 Validation
    if (!type || !amount) {
      return NextResponse.json(
        { error: "type and amount are required" },
        { status: 400 }
      )
    }

    if (!["deposit", "withdrawal"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      )
    }

    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // -----------------------------
    // 💰 DEPOSIT
    // -----------------------------
    if (type === "deposit") {
      user.deposit += amount
      user.equity += amount
    }

    // -----------------------------
    // 💸 WITHDRAWAL
    // -----------------------------
    if (type === "withdrawal") {
      if (amount > user.equity) {
        return NextResponse.json(
          { error: "Insufficient equity" },
          { status: 400 }
        )
      }

      user.withdrawal += amount
      user.equity -= amount
    }

    await user.save()

    return NextResponse.json(
      {
        message: `${type} successful`,
        finance: {
          deposit: user.deposit,
          withdrawal: user.withdrawal,
          equity: user.equity,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("FINANCE POST ERROR:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

// ------------------------------------
// GET → Fetch finance info by user id
// ------------------------------------
export async function GET(req, { params }) {
  try {
    await connectDB()

    const { id } = await params

    const user = await User.findById(id).select(
      "deposit withdrawal equity"
    )

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        deposit: user.deposit,
        withdrawal: user.withdrawal,
        equity: user.equity,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("FINANCE GET ERROR:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
