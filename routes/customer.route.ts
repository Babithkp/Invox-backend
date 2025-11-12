import express from "express";
import {
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerPage,
  filterCustomer,
} from "../controllers/customer.js";

const router = express.Router();

// Base routes that require customer_id
router.get("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid customer_id" })
);
router.post("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid customer_id" })
);
router.put("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid customer_id" })
);
router.delete("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid customer_id" })
);

// Pagination and filtering routes
router.get("/page", (req, res) =>
  res.status(400).json({ message: "Please provide valid page" })
);
router.get("/page/:page", getCustomerPage);

router.get("/filter", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filter/:text", filterCustomer);

// Routes with customer_id parameter
router.get("/:customer_id", getCustomer);
router.post("/:customer_id", createCustomer);
router.put("/:customer_id", updateCustomer);
router.delete("/:customer_id", deleteCustomer);

export default router;