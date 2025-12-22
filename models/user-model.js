export const runtime = "nodejs"
import mongoose from "mongoose"

const AnalysisSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false } // prevents extra _id for each analysis item
)

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    broker: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // 🔹 Financial fields
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },

    withdrawal: {
      type: Number,
      default: 0,
      min: 0,
    },

    equity: {
      type: Number,
      default: 0,
    },

    // 🔹 General notes
    notes: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔹 Analysis entries (heading + text)
    analysis: {
      type: [AnalysisSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model overwrite error in Next.js
export default mongoose.models.User || mongoose.model("User", UserSchema)
