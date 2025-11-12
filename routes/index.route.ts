import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import companyRoutes from "./company.route.js";
import customerRoutes from "./customer.route.js";
import expenseRoutes from "./expense.route.js";
import itemRoutes from "./item.route.js";
import quoteRoutes from "./quote.route.js";
import invoiceRoutes from "./invoice.route.js";

const router = express.Router();
// Mount route modules
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/userPage", userRoutes); // For backward compatibility with /userPage routes
router.use("/filterUser", userRoutes); // For backward compatibility with /filterUser routes
router.use("/company", companyRoutes);
router.use("/customer", customerRoutes);
router.use("/customerPage", customerRoutes); // For backward compatibility with /customerPage routes
router.use("/filterCustomer", customerRoutes); // For backward compatibility with /filterCustomer routes
router.use("/expense", expenseRoutes);
router.use("/expensePage", expenseRoutes); // For backward compatibility with /expensePage routes
router.use("/filterExpense", expenseRoutes); // For backward compatibility with /filterExpense routes
router.use("/item", itemRoutes);
router.use("/itemPage", itemRoutes); // For backward compatibility with /itemPage routes
router.use("/filterItem", itemRoutes); // For backward compatibility with /filterItem routes
router.use("/quote", quoteRoutes);
router.use("/quotePage", quoteRoutes); // For backward compatibility with /quotePage routes
router.use("/filterQuote", quoteRoutes); // For backward compatibility with /filterQuote routes
router.use("/invoice", invoiceRoutes);
router.use("/invoicePage", invoiceRoutes); // For backward compatibility with /invoicePage routes
router.use("/filterInvoice", invoiceRoutes); // For backward compatibility with /filterInvoice routes

export default router;