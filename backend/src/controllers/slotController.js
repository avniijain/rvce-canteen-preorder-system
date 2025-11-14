import db from "../config/db.js";

// Get all slots
export const getAllSlots = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM time_slots ORDER BY start_time ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

// Get single slot
export const getSlotById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM time_slots WHERE time_slot_id = ?", [id]);

    if (rows.length === 0) return res.status(404).json({ error: "Slot not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching slot:", err);
    res.status(500).json({ error: "Failed to fetch slot" });
  }
};

// Add new slot
export const addSlot = async (req, res) => {
  try {
    const { slot_name, start_time, end_time, is_active } = req.body;

    const [result] = await db.query(
      `INSERT INTO time_slots (slot_name, start_time, end_time, is_active, order_count)
       VALUES (?, ?, ?, ?, 0)`,
      [slot_name, start_time, end_time, is_active ?? 1]
    );

    res.json({ message: "Slot added successfully", slot_id: result.insertId });
  } catch (err) {
    console.error("Error adding slot:", err);
    res.status(500).json({ error: "Failed to add slot" });
  }
};

// Update slot (including order_count & is_active)
export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { slot_name, start_time, end_time, is_active, order_count } = req.body;

    const [result] = await db.query(
      `UPDATE time_slots
       SET slot_name = ?, start_time = ?, end_time = ?, is_active = ?, order_count = ?
       WHERE time_slot_id = ?`,
      [slot_name, start_time, end_time, is_active, order_count, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Slot not found" });

    res.json({ message: "Slot updated successfully" });
  } catch (err) {
    console.error("Error updating slot:", err);
    res.status(500).json({ error: "Failed to update slot" });
  }
};

// Delete slot (hard delete)
export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM time_slots WHERE time_slot_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Slot not found" });

    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error("Error deleting slot:", err);
    res.status(500).json({ error: "Failed to delete slot" });
  }
};
