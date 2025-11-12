import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserPage,
  filterUser,
} from "../controllers/user.js";

const router = express.Router();

// Base routes that require user_id
router.get("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid user_id" })
);
router.post("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid user_id" })
);
router.put("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid user_id" })
);
router.delete("/", (req, res) =>
  res.status(400).json({ message: "Please provide valid user_id" })
);

// Pagination and filtering routes
router.get("/page", (req, res) =>
  res.status(400).json({ message: "Please provide valid page" })
);
router.get("/page/:page", getUserPage);

router.get("/filter", (req, res) =>
  res.status(400).json({ message: "Invalid search text" })
);
router.get("/filter/:text", filterUser);

// Routes with user_id parameter
router.get("/:user_id", getUser);
router.post("/:user_id", createUser);
router.put("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

export default router;