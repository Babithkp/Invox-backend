import express from "express";
import {
  getWriteoff,
  createWriteoff,
  updateWriteoff,
  deleteWriteoff
} from "../controllers/writeoff";

const router = express.Router();

// GET /writeoff/:write_off_id
router.get("/:write_off_id", getWriteoff);

// POST /writeoff/:write_off_id
router.post("/:write_off_id", createWriteoff);

// PUT /writeoff/:write_off_id
router.put("/:write_off_id", updateWriteoff);

// DELETE /writeoff/:write_off_id
router.delete("/:write_off_id", deleteWriteoff);

export default router;