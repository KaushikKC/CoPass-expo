import express from "express";
import { suggestedMatches } from "../services/matchService.js";
const router = express.Router();

router.post("/suggested", async (req, res) => {
  const matches = await suggestedMatches(req.body);
  res.json(matches);
});

export default router;
