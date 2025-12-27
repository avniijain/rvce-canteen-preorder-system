import db from "../config/db.js";

export const placeOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const user_id = req.user.user_id;
    const { pickup_time, time_slot_id, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided." });
    }

    // Validate slot existence
    const [slotExists] = await connection.query(
      "SELECT * FROM time_slots WHERE time_slot_id = ?",
      [time_slot_id]
    );

    if (slotExists.length === 0) {
      return res.status(400).json({ message: "Invalid time slot selected." });
    }

    // Calculate total amount
    let total_amount = 0;
    items.forEach((item) => {
      total_amount += item.unit_price * item.quantity;
    });

    await connection.beginTransaction();

    // Insert into orders (Subtotal removed)
    const [orderRes] = await connection.query(
      `INSERT INTO orders 
       (user_id, order_date, pickup_time, time_slot_id, order_status, done_status, total_amount)
       VALUES (?, NOW(), ?, ?, 'pending', 'not-prepared', ?)`,
      [user_id, pickup_time, time_slot_id, total_amount]
    );

    const order_id = orderRes.insertId;

    // Insert order items (DO NOT insert subtotal because it's generated)
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [order_id, item.menu_id, item.quantity, item.unit_price]
      );

      // Reduce stock only if stock-based
      if (item.is_stock_based === 1) {
        await connection.query(
          `UPDATE menu 
           SET available_qty = available_qty - ?
           WHERE menu_id = ?`,
          [item.quantity, item.menu_id]
        );
      }
    }

    // Update slot order count
    await connection.query(
      `UPDATE time_slots 
       SET order_count = order_count + 1
       WHERE time_slot_id = ?`,
      [time_slot_id]
    );

    await connection.commit();

    res.json({
      message: "Order placed successfully",
      order_id,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Place order error:", err.message, err);
    res.status(500).json({ message: "Failed to place order" });
  } finally {
    connection.release();
  }
};

// ================================
// Get user order history
// ================================
export const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [rows] = await db.query(
      `SELECT * FROM orders 
       WHERE user_id = ?
       ORDER BY order_date DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("User orders fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// ================================
// Get single order + items
// ================================
export const getUserOrderDetails = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE order_id = ? AND user_id = ?`,
      [id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    const [items] = await db.query(
      `SELECT oi.order_item_id, oi.menu_id, oi.quantity, oi.unit_price, 
              m.item_name, (oi.quantity * oi.unit_price) AS subtotal
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
    console.error("Order detail error:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};