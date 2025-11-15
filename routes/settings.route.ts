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
router.get("/company", (req, res) => {
  // Check if the URL ends with a trailing slash
  if (req.originalUrl.endsWith('/')) {
    return res.status(400).json({ message: "Invalid request or bad input" });
  }
  return getCompanySettings(req, res);
});
router.post("/company", createCompanySettings);
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