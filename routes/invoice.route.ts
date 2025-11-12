import express from "express";
import {
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoicePage,
  filterInvoice,
} from "../controllers/invoice.js";

const router = express.Router();

// Base routes that require invoice_id
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

// Pagination routes with middleware validation
router.get("/page", (req, res, next) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  next();
}, getInvoicePage);

router.get("/page/:page", getInvoicePage);

router.get("/filter", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filter/:text", filterInvoice);

// Routes with invoice_id parameter
router.get("/:invoice_id", getInvoice);
router.post("/:invoice_id", createInvoice);
router.put("/:invoice_id", updateInvoice);
router.delete("/:invoice_id", deleteInvoice);

export default router;