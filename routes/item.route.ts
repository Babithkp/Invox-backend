import express from "express";
import {
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/item.js";

const router = express.Router();

// Return 400 when no item_id is provided
router.get("/", (req, res) => res.status(400).json({ message: "Please provide valid item_id" }));
router.post("/", (req, res) => res.status(400).json({ message: "Please provide valid item_id" }));
router.put("/", (req, res) => res.status(400).json({ message: "Please provide valid item_id" }));
router.delete("/", (req, res) => res.status(400).json({ message: "Please provide valid item_id" }));

// Actual endpoints
router.get("/:item_id", getItem);
router.post("/:item_id", createItem);
router.put("/:item_id", updateItem);
router.delete("/:item_id", deleteItem);

export default router;
