import express from 'express';
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import adminAuth from "../middleware/authAdminMiddleware.js";

const router = express.Router();

// PUBLIC ROUTE
router.get('/', getMenu);

// ADMIN ROUTES
router.post('/add', adminAuth, addMenuItem);
router.put('/update/:id', adminAuth, updateMenuItem);
router.delete('/delete/:id', adminAuth, deleteMenuItem);

export default router;
