import express from "express";

import {
  createOrder,
  getMyOrders,
} from "../controllers/orderController.js";

import {
  optionalAuth,
  requireAuth,
} from "../middleware/orderAuth.js";

const router = express.Router();

router.post("/", optionalAuth, createOrder);

router.get("/my", optionalAuth, requireAuth, getMyOrders);

export default router;