import express from "express";
import authUser from "../middleware/authUserMiddleware.js";
import {
  placeOrder,
  getUserOrders,
  getUserOrderDetails
} from "../controllers/userOrderController.js";

const router = express.Router();

router.post("/place", authUser, placeOrder);
router.get("/", authUser, getUserOrders);
router.get("/:id", authUser, getUserOrderDetails);

export default router;
