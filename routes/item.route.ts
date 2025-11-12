import express from "express";
import {
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemPage,
  filterItem,
} from "../controllers/item.js";

const router = express.Router();

// Base routes that require item_id
router.get("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);
router.post("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);
router.put("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);
router.delete("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);

// Pagination and filtering routes
router.get("/page", (req, res) =>
  res.status(400).json({ message: "Please provide valid page" })
);
router.get("/page/:page", getItemPage);

router.get("/filter", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filter/:test", filterItem);

// Routes with item_id parameter
router.get("/:item_id", getItem);
router.post("/:item_id", createItem);
router.put("/:item_id", updateItem);
router.delete("/:item_id", deleteItem);

export default router;