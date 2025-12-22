export const runtime = "nodejs"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/connectdb"
import userModel from "@/models/user-model"

export async function POST(req) {
  try {
    await connectDB()

    const { fullName, email, password } = await req.json()

    // Basic validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("REGISTER ERROR:", error)
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}
