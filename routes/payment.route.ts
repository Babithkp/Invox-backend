import express from "express";
import {
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentPage,
  filterPayment,
} from "../controllers/payment.js";

const router = express.Router();

// Base routes that require payment_id
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
}, getPaymentPage);

router.get("/page/:page", getPaymentPage);

router.get("/filter", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filter/:text", filterPayment);

// Routes with payment_id parameter
router.get("/:payment_id", getPayment);
router.post("/:payment_id", createPayment);
router.put("/:payment_id", updatePayment);
router.delete("/:payment_id", deletePayment);

export default router;