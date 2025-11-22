import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const adminSignup = async (req, res) => {
  try {
    const { username, email, password, staff_role } = req.body;

    if (!username || !email || !password || !staff_role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const [existing] = await db.query(
      "SELECT * FROM admin_user WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    

    // Insert admin
    await db.query(
      `INSERT INTO admin_user (username, password_hash, email, staff_role, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [username, password_hash, email, staff_role]
    );

    return res.status(201).json({ message: "Admin account created successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    // Find admin by email
    const [result] = await db.query(
      "SELECT * FROM admin_user WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const admin = result[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { admin_id: admin.admin_id, role: admin.staff_role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update last login
    await db.query(
      "UPDATE admin_user SET last_login = NOW() WHERE admin_id = ?",
      [admin.admin_id]
    );

    return res.json({
      message: "Login successful",
      token,
      admin: {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email,
        role: "staff",
        staff_role: admin.staff_role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};
