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

// ✅ Actual endpoints
router.get("/item/:item_id", getItem);
router.post("/item/:item_id", createItem);
router.put("/item/:item_id", updateItem);
router.delete("/item/:item_id", deleteItem);

router.get("/itemPage/:page", getItemPage);
router.get("/filterItem/:test", filterItem);

export default router;
