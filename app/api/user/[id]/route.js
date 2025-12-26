export const runtime = "nodejs"

import { NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/models/user-model" // adjust path if needed
import connectDB from "@/lib/connectdb" // your DB connection helper

// GET → Fetch single user by ID
export async function GET(req, { params }) {
  try {
    await connectDB()

    const { id } = await  params
    console.log(id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      )
    }

    const user = await User.findById(id).select("-password")

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("GET USER ERROR:", error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}

// PUT → Update user by ID
export async function PUT(req, { params }) {
  try {
    await connectDB()

    const { id } = await params
    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      )
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error("UPDATE USER ERROR:", error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}
