export const runtime = "nodejs"
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Prevent multiple connections during development (Next.js hot reload)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, );

    isConnected = db.connections[0].readyState === 1;
    console.log("🚀 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.log("**********************************")
    console.log(error)
    console.log("**********************************")

    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
