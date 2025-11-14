// controllers/menuController.js
import db from '../config/db.js';

//GET ALL MENU ITEMS (PUBLIC)
export const getMenu = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM menu ORDER BY menu_id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ message: "Error fetching menu" });
  }
};

// ADD MENU ITEM (ADMIN ONLY)
export const addMenuItem = async (req, res) => {
  try {
    const { item_name, price, category, is_stock_based, available_qty, is_active } = req.body;

    if (!item_name || !price) {
      return res.status(400).json({ message: "Item name and price are required" });
    }

    await db.query(
      `INSERT INTO menu (item_name, price, category, is_stock_based, available_qty, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item_name,
        price,
        category || null,
        is_stock_based || 0,
        available_qty || 0,
        is_active ?? 1 // default active
      ]
    );

    res.status(201).json({ message: "Menu item added successfully" });

  } catch (err) {
    console.error("Add menu error:", err);
    res.status(500).json({ message: "Error adding menu item" });
  }
};

// UPDATE MENU ITEM (ADMIN ONLY)
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, price, category, is_stock_based, available_qty, is_active } = req.body;

    const [item] = await db.query("SELECT * FROM menu WHERE menu_id = ?", [id]);
    if (item.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await db.query(
      `UPDATE menu SET 
        item_name = ?, 
        price = ?, 
        category = ?, 
        is_stock_based = ?, 
        available_qty = ?, 
        is_active = ? 
        WHERE menu_id = ?`,
      [
        item_name,
        price,
        category,
        is_stock_based,
        available_qty,
        is_active,
        id
      ]
    );

    res.json({ message: "Menu item updated successfully" });

  } catch (err) {
    console.error("Update menu error:", err);
    res.status(500).json({ message: "Error updating menu" });
  }
};

// DELETE MENU ITEM (ADMIN ONLY)
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [item] = await db.query("SELECT * FROM menu WHERE menu_id = ?", [id]);
    if (item.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await db.query("DELETE FROM menu WHERE menu_id = ?", [id]);

    res.json({ message: "Menu item deleted successfully" });

  } catch (err) {
    console.error("Delete menu error:", err);
    res.status(500).json({ message: "Error deleting menu item" });
  }
};