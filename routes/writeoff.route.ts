import express from "express";
import {
  getWriteoff,
  createWriteoff,
  updateWriteoff,
  deleteWriteoff
} from "../controllers/writeoff.js";

const router = express.Router();

// Base routes that require write_off_id
router.get("/", (req, res) => res.status(400).json({ message: "Invalid request or bad input" }));
router.post("/", (req, res) => res.status(400).json({ message: "Invalid request or bad input" }));
router.put("/", (req, res) => res.status(400).json({ message: "Invalid request or bad input" }));
router.delete("/", (req, res) => res.status(400).json({ message: "Invalid request or bad input" }));

// GET /writeoff/:write_off_id
router.get("/:write_off_id", getWriteoff);

// POST /writeoff/:write_off_id
router.post("/:write_off_id", createWriteoff);

// PUT /writeoff/:write_off_id
router.put("/:write_off_id", updateWriteoff);

// DELETE /writeoff/:write_off_id
router.delete("/:write_off_id", deleteWriteoff);

export default router;