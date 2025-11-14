import express from "express";
import {
  getCompanySettings,
  createCompanySettings,
  getCompanySettingsById,
  updateCompanySettings,
  deleteCompanySettings,
} from "../controllers/settings.js";

const router = express.Router();

// Company settings routes
router.get("/company", getCompanySettings);
router.post("/company", createCompanySettings);

// Base routes that require company_id - these should redirect to the main company route
router.get("/company/", getCompanySettings);
router.put("/company/", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);
router.delete("/company/", (req, res) =>
  res.status(400).json({ message: "Invalid request or bad input" })
);

// Routes with company_id parameter
router.get("/company/:company_id", getCompanySettingsById);
router.put("/company/:company_id", updateCompanySettings);
router.delete("/company/:company_id", deleteCompanySettings);

export default router;