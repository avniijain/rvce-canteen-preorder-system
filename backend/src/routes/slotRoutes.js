import express from "express";
import {
  getAllSlots,
  getSlotById,
  addSlot,
  updateSlot,
  deleteSlot
} from "../controllers/slotController.js";
import adminAuth from "../middleware/authAdminMiddleware.js";

const router = express.Router();

router.get("/", adminAuth, getAllSlots);
router.get("/:id", adminAuth, getSlotById);
router.post("/", adminAuth, addSlot);
router.put("/:id", adminAuth, updateSlot);
router.delete("/:id", adminAuth, deleteSlot); // Hard delete now

export default router;
