import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// =========================
// User Signup
// =========================
export const registerUser = async (req, res) => {
  try {
    const { user_name, email, phone, password, user_type } = req.body;

    if (!user_name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (user_name, email, phone, password_hash, user_type, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_name, email, phone, password_hash, user_type || "student"]
    );

    res.json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// =========================
// User Login
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await db.query(
      "UPDATE users SET last_login = NOW() WHERE user_id = ?",
      [user.user_id]
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        phone: user.phone,
        role:"user",
        user_type: user.user_type
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
