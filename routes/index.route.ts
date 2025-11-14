import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import companyRoutes from "./company.route";
import customerRoutes from "./customer.route";
import expenseRoutes from "./expense.route";
import itemRoutes from "./item.route";
import quoteRoutes from "./quote.route";
import invoiceRoutes from "./invoice.route";
import paymentRoutes from "./payment.route";
import writeoffRoutes from "./writeoff.route";
import settingsRoutes from "./settings.route";

const router = express.Router();

// Mount route modules
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/company", companyRoutes);

// Import controller functions for direct calls
import { getItemPage, filterItem } from "../controllers/item";
import { getQuotePage, filterQuote } from "../controllers/quote";
import { getInvoicePage, filterInvoice } from "../controllers/invoice";
import { getPaymentPage, filterPayment } from "../controllers/payment";
import { getCustomerPage, filterCustomer } from "../controllers/customer";
import { getExpensePage, filterExpense } from "../controllers/expense";

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
  req.url = '/page';
  customerRoutes(req, res);
});

router.get("/filterCustomer", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterCustomer/:text", (req, res) => {
  req.url = '/filter/' + req.params.text;
  customerRoutes(req, res);
});

// Expense page and filter routes with specific handlers
router.get("/expensePage", (req, res) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  req.url = '/page';
  expenseRoutes(req, res);
});

router.get("/filterExpense", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filterExpense/:text", (req, res) => {
  req.url = '/filter/' + req.params.text;
  expenseRoutes(req, res);
});

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