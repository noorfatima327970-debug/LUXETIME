import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  optionalAuth,
  requireAuth,
  requireAdmin,
} from "../middleware/orderAuth.js";

const router = express.Router();

router.post("/", optionalAuth, createOrder);

router.get("/my", optionalAuth, requireAuth, getMyOrders);

router.get(
  "/admin",
  optionalAuth,
  requireAuth,
  requireAdmin,
  getAllOrders
);

router.patch(
  "/:id/status",
  optionalAuth,
  requireAuth,
  requireAdmin,
  updateOrderStatus
);

export default router;