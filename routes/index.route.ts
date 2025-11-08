import express from "express";
import {
  register,
  login,
} from "../controllers/auth.controller.js";
import {
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import {
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemPage,
  filterItem,
} from "../controllers/item.controller.js";

import {
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuotePage,
  filterQuote,
} from "../controllers/quote.controller.js";

import {
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoicePage,
  filterInvoice,
} from '../controllers/invoice.controller.js';

const router = express.Router();

router.get("/company", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));
router.post("/company", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));
router.put("/company", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));
router.delete("/company", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));

router.post("/auth/register", register);
router.post("/auth/login", login);

router.get("/company/:company_id", getCompany);
router.post("/company/:company_id", createCompany);
router.put("/company/:company_id", updateCompany);
router.delete("/company/:company_id", deleteCompany);

router.get("/item", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);
router.post("/item", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);
router.put("/item", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);
router.delete("/item", (req, res) =>
  res.status(400).json({ message: "Please provide valid item_id" })
);

router.get("/itemPage", (req, res) =>
  res.status(400).json({ message: "Please provide valid page" })
);
router.get("/filterItem", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);

router.get("/item/:item_id", getItem);
router.post("/item/:item_id", createItem);
router.put("/item/:item_id", updateItem);
router.delete("/item/:item_id", deleteItem);

router.get("/itemPage/:page", getItemPage);
router.get("/filterItem/:test", filterItem);

router.get("/quote", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.post("/quote", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.put("/quote", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.delete("/quote", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);

router.get("/quotePage", getQuotePage);
router.get("/quotePage/:page", getQuotePage);
router.get("/filterQuote", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);

router.get("/quote/:quote_id", getQuote);
router.post("/quote/:quote_id", createQuote);
router.put("/quote/:quote_id", updateQuote);
router.delete("/quote/:quote_id", deleteQuote);
router.get("/filterQuote/:text", filterQuote);

router.get("/invoice", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.post("/invoice", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.put("/invoice", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.delete("/invoice", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);

// ---- invoicePage: middleware validates page & limit then forwards to controller ----
router.get("/invoicePage", (req, res, next) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return res.status(400).json({ message: "Invalid request or bad parameters" });
  }
  next();
}, getInvoicePage);

// Keep path-style if needed (won't conflict)
router.get("/invoicePage/:page", getInvoicePage);

router.get("/filterInvoice", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/invoice/:invoice_id", getInvoice);
router.post("/invoice/:invoice_id", createInvoice);
router.put("/invoice/:invoice_id", updateInvoice);
router.delete("/invoice/:invoice_id", deleteInvoice);
router.get("/filterInvoice/:text", filterInvoice);

export default router;
