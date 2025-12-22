export const runtime = "nodejs"

import { NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/models/user-model"
import connectDB from "@/lib/connectdb"
import bcrypt from "bcryptjs"

export async function PUT(req, { params }) {
  try {
    await connectDB()

    const { id } = await params
    const body = await req.json()

    const updateData = {}

    // Only update provided fields
    if (body.fullName) updateData.fullName = body.fullName
    if (body.broker) updateData.broker = body.broker
    if (body.email) updateData.email = body.email.toLowerCase()

    // If password is provided, hash it
    if (body.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(body.password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
        select: "-password", // never return password
      }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    )

  } catch (error) {
    console.error("Profile update error:", error)

    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    )
  }
}
