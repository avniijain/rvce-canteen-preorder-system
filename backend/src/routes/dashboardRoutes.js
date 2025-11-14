import express from "express";
import adminAuth from "../middleware/authAdminMiddleware.js";
import {
  getDashboardSummary,
  getOrdersBySlot,
  getRevenueDaily,
  getTopSellingItems
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", adminAuth, getDashboardSummary);
router.get("/orders-by-slot", adminAuth, getOrdersBySlot);
router.get("/revenue-daily", adminAuth, getRevenueDaily);
router.get("/top-items", adminAuth, getTopSellingItems);

export default router;
