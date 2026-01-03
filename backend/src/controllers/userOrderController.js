import db from "../config/db.js";
import { sendSMS } from "../utils/twilio.js";

export const placeOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const user_id = req.user.user_id;
    const { time_slot_id, items } = req.body;

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

    const slotStartTime = slotExists[0].start_time; // "12:00:00"

    // Current server time
    const now = new Date();

    // Today date in local time
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Slot datetime for today
    const [hh, mm, ss] = slotStartTime.split(':').map(Number);
    const slotDateTime = new Date(today);
    slotDateTime.setHours(hh, mm, ss || 0);

    // If slot time already passed, move to next day
    if (now >= slotDateTime) {
      slotDateTime.setDate(slotDateTime.getDate() + 1);
    }

    const pad = (n) => n.toString().padStart(2, '0');

    const pickup_time = `${slotDateTime.getFullYear()}-${pad(
      slotDateTime.getMonth() + 1
    )}-${pad(slotDateTime.getDate())} ${pad(
      slotDateTime.getHours()
    )}:${pad(slotDateTime.getMinutes())}:${pad(
      slotDateTime.getSeconds()
    )}`;


    // Calculate total amount
    let total_amount = 0;
    items.forEach((item) => {
      total_amount += item.unit_price * item.quantity;
    });

    await connection.beginTransaction();

    // Insert into orders (Subtotal removed)
    const [orderRes] = await connection.query(
      `INSERT INTO orders 
       (user_id, order_date, pickup_time, time_slot_id, order_status, food_status, total_amount)
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
      pickup_time
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

// ================================
// Cancel order (30 min before pickup)
// ================================
export const cancelOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const user_id = req.user.user_id;
    const { id: order_id } = req.params;

    // 1️⃣ Fetch order
    const [orders] = await connection.query(
      `SELECT order_status, pickup_time
       FROM orders
       WHERE order_id = ? AND user_id = ?`,
      [order_id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = orders[0];

    // 2️⃣ Check order status
    if (order.order_status !== "pending") {
      return res.status(400).json({
        message: `Order cannot be cancelled (status: ${order.order_status}).`
      });
    }

    // 3️⃣ Check time constraint (30 minutes before pickup)
    const now = new Date();
    const pickupTime = new Date(order.pickup_time);

    const diffMs = pickupTime - now;
    const diffMinutes = diffMs / (1000 * 60);

    if (diffMinutes < 30) {
      return res.status(400).json({
        message: "Order cannot be cancelled within 30 minutes of pickup time."
      });
    }

    // 4️⃣ Cancel order
    await connection.beginTransaction();

    await connection.query(
      `UPDATE orders
       SET order_status = 'cancelled'
       WHERE order_id = ?`,
      [order_id]
    );

    await connection.commit();

        // 🔹 Fetch user phone number
    const [[user]] = await connection.query(
      `SELECT phone 
      FROM users 
      WHERE user_id = ?`,
      [user_id]
    );

    // 🔹 Send cancellation SMS (non-blocking)
    if (user?.phone) {
      try {
        const cleanPhone = user.phone.replace(/\D/g, "");
        const formattedPhone = `+91${cleanPhone.slice(-10)}`;

        await sendSMS(
          formattedPhone,
          `❌ Order Cancelled
    Order ID: ${order_id}
    Your order has been cancelled successfully.
    If paid, refund will be processed.
    `
        );

        console.log(`📩 Cancellation SMS sent for order ${order_id}`);
      } catch (err) {
        console.error("Cancellation SMS failed:", err.message);
      }
    }

    res.json({
      message: "Order cancelled successfully."
    });
  } catch (err) {
    await connection.rollback();
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order." });
  } finally {
    connection.release();
  }
};
