import express from 'express';
import db from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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
