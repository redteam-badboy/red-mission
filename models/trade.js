import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    pair: {
      type: String,
      required: true, // e.g., "EUR/USD"
    },
    date: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    entryPrice: {
      type: Number,
      required: true,
    },
    pointOfInterest: {
      type: String,
      required: true, // e.g., "Support zone", "Supply area"
    },
    confirmation: {
      type: String,
      required: true, // e.g., "Break of structure", "Candle pattern"
    },
    SL: {
      type: Number, // Stop Loss
      required: true,
    },
    TP: {
      type: Number, // Take Profit
      required: true,
    },
    totalPL: {
      type: Number, // Total profit/loss
      default: 0,
    },
    result: {
      type: String, // e.g., "Win", "Loss", "Breakeven"
      enum: ["Win", "Loss", "Breakeven"],
    },
    lotSize: {
      type: Number, // Size of the trade
      required: true,
    },
    feeling: {
      type: String, // Trader's feeling, e.g., "Confident", "Uncertain"
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Avoid recompiling the model when using hot reload in Next.js
const TradeModel =
  mongoose.models.Trade || mongoose.model("Trade", tradeSchema);

export default TradeModel;
