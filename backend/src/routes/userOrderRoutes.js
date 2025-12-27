
import express from "express";
import authUser from "../middleware/authUserMiddleware.js";
import {
  placeOrder,
  getUserOrders,
  getUserOrderDetails
} from "../controllers/userOrderController.js";

import { getMenu } from "../controllers/menuController.js";

const router = express.Router();

router.get("/menu", getMenu);

router.post("/place", authUser, placeOrder);
router.get("/", authUser, getUserOrders);
router.get("/:id", authUser, getUserOrderDetails);

export default router;