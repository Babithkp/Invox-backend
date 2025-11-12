import express from "express";
import {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensePage,
  filterExpense,
} from "../controllers/expense.js";

const router = express.Router();

// Base routes that require expense_id
router.get("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid expense_id" })
);
router.post("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid expense_id" })
);
router.put("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid expense_id" })
);
router.delete("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid expense_id" })
);

// Pagination and filtering routes
router.get("/page", (req, res) =>
  res.status(400).json({ message: "Please provide valid page" })
);
router.get("/page/:page", getExpensePage);

router.get("/filter", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filter/:text", filterExpense);

// Routes with expense_id parameter
router.get("/:expense_id", getExpense);
router.post("/:expense_id", createExpense);
router.put("/:expense_id", updateExpense);
router.delete("/:expense_id", deleteExpense);

export default router;