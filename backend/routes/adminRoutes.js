import express from "express";

import {
  getDashboardStats,
  updateProduct,
} from "../controllers/adminController.js";

import {
  optionalAuth,
  requireAuth,
  requireAdmin,
} from "../middleware/orderAuth.js";

const router = express.Router();

router.use(optionalAuth, requireAuth, requireAdmin);

router.get("/stats", getDashboardStats);

router.patch("/products/:id", updateProduct);

export default router;