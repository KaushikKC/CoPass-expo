import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import matchRoutes from "./routes/match.js";
import tripRoutes from "./routes/trips.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/matches", matchRoutes);

export default app;
