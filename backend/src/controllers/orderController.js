import db from "../config/db.js";

export const getAllOrders = async (req, res) => {
  try {
    const { status, done_status, slot, date } = req.query;

    let query = `SELECT * FROM orders WHERE 1=1`;
    const params = [];

    if (status) {
      query += ` AND order_status = ?`;
      params.push(status);
    }

    if (done_status) {
      query += ` AND done_status = ?`;
      params.push(done_status);
    }

    if (slot) {
      query += ` AND time_slot_id = ?`;
      params.push(slot);
    }

    if (date) {
      query += ` AND DATE(order_date) = ?`;
      params.push(date);
    }

    query += ` ORDER BY order_date DESC`;

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch order
    const [orders] = await db.query(
      `SELECT o.*, u.user_name, u.email 
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       WHERE o.order_id = ?`,
      [id]
    );

    if (orders.length === 0)
      return res.status(404).json({ error: "Order not found" });

    // Fetch items
    const [items] = await db.query(
      `SELECT oi.*, m.item_name 
       FROM order_items oi
       JOIN menu m ON oi.menu_id = m.menu_id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      ...orders[0],
      items,
    });

  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const [result] = await db.query(
      `UPDATE orders SET order_status = ? WHERE order_id = ?`,
      [order_status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order status updated successfully" });

  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

export const updatePreparationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { done_status } = req.body;

    const [result] = await db.query(
      `UPDATE orders SET done_status = ? WHERE order_id = ?`,
      [done_status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Preparation status updated successfully" });

  } catch (err) {
    console.error("Error updating preparation status:", err);
    res.status(500).json({ error: "Failed to update preparation status" });
  }
};

export const getOrdersBySlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM orders 
       WHERE time_slot_id = ? 
       ORDER BY order_date DESC`,
      [slotId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching slot orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getTodayOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM orders 
       WHERE DATE(order_date) = CURDATE()
       ORDER BY order_date DESC`
    );

    res.json(rows);

  } catch (err) {
    console.error("Error fetching today's orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM orders 
       WHERE order_status = 'pending'
       ORDER BY order_date DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
