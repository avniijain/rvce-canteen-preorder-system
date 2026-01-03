import db from "../config/db.js";
import { sendSMS } from "../utils/twilio.js";

export const confirmPayment = async (req, res) => {
  console.log("🔥 CONFIRM PAYMENT HIT:", req.body);

  const { order_id, transaction_id } = req.body;

  // 1️⃣ Basic validation
  if (!order_id || !transaction_id || transaction_id.length < 8) {
    return res.status(400).json({ error: "Invalid input data" });
  }

   const connection = await db.getConnection();

   try {
    await connection.beginTransaction();

    // 1️⃣ Check order
    const [orders] = await connection.query(
      "SELECT payment_status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (orders.length === 0) {
      throw new Error("Order not found");
    }

    if (orders[0].payment_status === "paid") {
      throw new Error("Order already paid");
    }

    // 2️⃣ Insert payment
    await connection.query(
      "INSERT INTO payment (order_id, transaction_id, payment_status) VALUES (?, ?, 'paid')",
      [order_id, transaction_id]
    );

    // 3️⃣ Update order
    await connection.query(
      "UPDATE orders SET payment_status='paid' WHERE order_id=?",
      [order_id]
    );

    await connection.commit();

    console.log(`📩 SMS SENT: Order ${order_id} confirmed`);

    // 🔹 Get user's phone number
    const [[user]] = await connection.query(
      `SELECT phone 
      FROM users 
      WHERE user_id = (
        SELECT user_id FROM orders WHERE order_id = ?
      )`,
      [order_id]
    );

    // 🔹 Send SMS (non-blocking)
    if (user?.phone) {
      try {
        const cleanPhone = user.phone.replace(/\D/g, "");
        const formattedPhone = `+91${cleanPhone.slice(-10)}`;

        // 🔹 Fetch order details for SMS
        const [[order]] = await connection.query(
          `SELECT pickup_time 
          FROM orders 
          WHERE order_id = ?`,
          [order_id]
        );

    const pickup_time = order.pickup_time;
        await sendSMS(
          formattedPhone,
          `✅ Order Confirmed!
    Order ID: ${order_id}
    Pickup Time: ${pickup_time}
    Please collect within 15 minutes.
    Thank you!`
        );
        console.log("📩 SMS sent via Twilio");
      } catch (err) {
        console.error("Twilio error:", err.message);
      }
    }

    res.json({
      message: "Payment successful. Order confirmed."
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);

    res.status(400).json({
      error: err.message || "Payment confirmation failed"
    });
  } finally {
    connection.release();
  }
};
