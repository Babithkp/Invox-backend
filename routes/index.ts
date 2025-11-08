import express from "express";
import authRouter from "./auth.route.js";
import companyRouter from "./company.route.js";
import itemRouter from "./item.route.js";
import { getItemPage, filterItem } from "../controllers/item.js";

const router = express.Router();

// Mount modular routers
router.use("/auth", authRouter);
router.use("/company", companyRouter);
router.use("/item", itemRouter);

// Keep top-level helpers for missing params on itemPage/filterItem
router.get("/itemPage", (req, res) => res.status(400).json({ message: "Please provide valid page" }));
router.get("/filterItem", (req, res) => res.status(400).json({ message: "Invalid search text" }));

// Preserve original itemPage/filterItem endpoints
router.get("/itemPage/:page", getItemPage);
router.get("/filterItem/:test", filterItem);

export default router;
