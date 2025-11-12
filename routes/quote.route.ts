import express from "express";
import {
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuotePage,
  filterQuote,
} from "../controllers/quote.js";

const router = express.Router();

// Base routes that require quote_id
router.get("/", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.post("/", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.put("/", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.delete("/", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);

// Pagination and filtering routes
router.get("/page", getQuotePage);
router.get("/page/:page", getQuotePage);

router.get("/filter", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filter/:text", filterQuote);

// Routes with quote_id parameter
router.get("/:quote_id", getQuote);
router.post("/:quote_id", createQuote);
router.put("/:quote_id", updateQuote);
router.delete("/:quote_id", deleteQuote);

export default router;