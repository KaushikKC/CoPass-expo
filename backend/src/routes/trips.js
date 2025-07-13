import express from "express";
import { createTrip, getTrips } from "../controllers/tripController.js";
const router = express.Router();

router.get("/", getTrips);
router.post("/", createTrip);

export default router;
