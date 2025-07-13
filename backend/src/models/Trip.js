import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: String,
  dates: { start: Date, end: Date },
  budget: Number,
  purpose: String,
  preferences: Object,
  seats: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Trip", TripSchema);
