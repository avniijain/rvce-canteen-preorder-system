import express from 'express';
import db from './src/config/db.js';
import dotenv from 'dotenv';
import authAdminRoutes from './src/routes/authAdminRoutes.js';
import menuRoutes from './src/routes/menuRoutes.js';
import slotRoutes from "./src/routes/slotRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use('/api/admin/auth', authAdminRoutes);
app.use('/api/admin/menu', menuRoutes);
app.use("/api/admin/slots", slotRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);


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
