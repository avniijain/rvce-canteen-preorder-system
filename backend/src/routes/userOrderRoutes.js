
import express from "express";
import authUser from "../middleware/authUserMiddleware.js";
import {
  placeOrder,
  getUserOrders,
  getUserOrderDetails,
  cancelOrder
} from "../controllers/userOrderController.js";

import { getMenu } from "../controllers/menuController.js";

const router = express.Router();

router.get("/menu", getMenu);

router.post("/place", authUser, placeOrder);
router.get("/", authUser, getUserOrders);
router.patch("/:id/cancel", authUser, cancelOrder);
router.get("/:id", authUser, getUserOrderDetails);

export default router;