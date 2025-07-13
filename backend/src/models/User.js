import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  wallet: { type: String, unique: true, required: true },
  bio: String,
  avatarUrl: String,
  lensHandle: String,
  ens: String,
  preferences: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
