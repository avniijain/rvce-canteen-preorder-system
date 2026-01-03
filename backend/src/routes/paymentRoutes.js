import express from "express";
import {confirmPayment} from "../controllers/paymentController.js";
import authUser from "../middleware/authUserMiddleware.js";

const router = express.Router();

router.post("/confirm",authUser, confirmPayment);

export default router;
