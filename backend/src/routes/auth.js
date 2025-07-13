import express from "express";
import { siwe } from "../controllers/authController.js";
const router = express.Router();

router.post("/siwe", siwe);

export default router;
