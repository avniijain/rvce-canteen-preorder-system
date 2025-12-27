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

// Public GET for all slots (no auth)
router.get("/", getAllSlots);

// Admin-only routes
router.get("/:id", adminAuth, getSlotById);
router.post("/", adminAuth, addSlot);
router.put("/:id", adminAuth, updateSlot);
router.delete("/:id", adminAuth, deleteSlot);

export default router;