import express from 'express';
import cors from 'cors'; 
import db from './src/config/db.js';
import dotenv from 'dotenv';
import authAdminRoutes from './src/routes/authAdminRoutes.js';
import menuRoutes from './src/routes/menuRoutes.js';
import slotRoutes from "./src/routes/slotRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";

import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import cron from "node-cron";

import userAuthRoutes from "./src/routes/userAuthRoutes.js";
import userOrderRoutes from "./src/routes/userOrderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS MIDDLEWARE - MUST BE BEFORE ROUTES
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body parser MUST come after CORS
app.use(express.json());

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const [result] = await db.query(
      `UPDATE orders 
       SET order_status = 'expired' 
       WHERE order_status != 'pickedup'
       AND pickup_time < DATE_SUB(NOW(), INTERVAL 15 MINUTE)`
    );

    if (result.affectedRows > 0) {
      console.log(`⏰ Auto-expired ${result.affectedRows} orders`);
    }
  } catch (err) {
    console.error("Auto-expire error:", err);
  }
});

// Routes
app.use('/api/admin/auth', authAdminRoutes);
app.use('/api/admin/menu', menuRoutes);
app.use("/api/admin/slots", slotRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/user/slots", slotRoutes);

app.use("/api/user/auth", userAuthRoutes);
app.use("/api/user/orders", userOrderRoutes);

// Test route
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS currentTime');
    res.json({ message: 'Server is running!', time: rows[0].currentTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));