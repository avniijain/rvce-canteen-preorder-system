import express from "express";
import adminAuth from "../middleware/authAdminMiddleware.js";

import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  updatePreparationStatus,
  getOrdersBySlot,
  getTodayOrders,
  getPendingOrders
} from "../controllers/orderController.js";

const router = express.Router();

// All routes protected by admin JWT
router.get("/", adminAuth, getAllOrders);
router.get("/today", adminAuth, getTodayOrders);
router.get("/pending", adminAuth, getPendingOrders);
router.get("/slot/:slotId", adminAuth, getOrdersBySlot);

router.get("/:id", adminAuth, getOrderDetails);

router.patch("/:id/status", adminAuth, updateOrderStatus);
router.patch("/:id/preparation", adminAuth, updatePreparationStatus);

export default router;
