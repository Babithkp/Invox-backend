import express from "express";
import {
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/company.js";

const router = express.Router();

// Base routes that require company_id
router.get("/", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));
router.post("/", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));
router.put("/", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));
router.delete("/", (req, res) => res.status(400).json({ message: "Please provide valid company_id" }));

// Routes with company_id parameter
router.get("/:company_id", getCompany);
router.post("/:company_id", createCompany);
router.put("/:company_id", updateCompany);
router.delete("/:company_id", deleteCompany);

export default router;