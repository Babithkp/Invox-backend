import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import companyRoutes from "./company.route.js";
import customerRoutes from "./customer.route.js";
import expenseRoutes from "./expense.route.js";
import itemRoutes from "./item.route.js";
import quoteRoutes from "./quote.route.js";
import invoiceRoutes from "./invoice.route.js";
import paymentRoutes from "./payment.route.js";
import writeoffRoutes from "./writeoff.route.js";
import settingsRoutes from "./settings.route.js";

const router = express.Router();

// Mount route modules
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/company", companyRoutes);

// Import controller functions for direct calls
import { getItemPage, filterItem } from "../controllers/item.js";
import { getQuotePage, filterQuote } from "../controllers/quote.js";
import { getInvoicePage, filterInvoice } from "../controllers/invoice.js";
import { getPaymentPage, filterPayment } from "../controllers/payment.js";
import { getCustomerPage, filterCustomer } from "../controllers/customer.js";
import { getExpensePage, filterExpense } from "../controllers/expense.js";

// Item page and filter routes with specific handlers
router.get("/itemPage", (req, res) =>
  res.status(400).json({ message: "Please provide valid page" })
);
router.get("/itemPage/:page", getItemPage);

router.get("/filterItem", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterItem/:test", filterItem);

// Quote page and filter routes with specific handlers
router.get("/quotePage", (req, res) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  getQuotePage(req, res);
});

router.get("/filterQuote", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterQuote/:text", filterQuote);

// Invoice page and filter routes with specific handlers
router.get("/invoicePage", (req, res) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  getInvoicePage(req, res);
});

router.get("/filterInvoice", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterInvoice/:text", filterInvoice);

// Payment page and filter routes with specific handlers
router.get("/paymentPage", (req, res) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  getPaymentPage(req, res);
});

router.get("/filterPayment", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterPayment/:text", filterPayment);

// Customer page and filter routes with specific handlers
router.get("/customerPage", (req, res) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  getCustomerPage(req, res);
});

router.get("/filterCustomer", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterCustomer/:text", filterCustomer);

// Expense page and filter routes with specific handlers
router.get("/expensePage", (req, res) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  getExpensePage(req, res);
});

router.get("/filterExpense", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterExpense/:text", filterExpense);

// Mount the main route modules
router.use("/item", itemRoutes);
router.use("/quote", quoteRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/payment", paymentRoutes);
router.use("/customer", customerRoutes);
router.use("/expense", expenseRoutes);
router.use("/writeoff", writeoffRoutes);
router.use("/settings", settingsRoutes);

export default router;