import db from "../config/db.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const [[totalOrders]] = await db.query(
      `SELECT COUNT(*) AS total_orders FROM orders`
    );

    const [[todayOrders]] = await db.query(
      `SELECT COUNT(*) AS today_orders 
       FROM orders WHERE DATE(order_date) = CURDATE()`
    );

    const [[pending]] = await db.query(
      `SELECT COUNT(*) AS pending_orders 
       FROM orders WHERE order_status = 'pending'`
    );

    const [[prepared]] = await db.query(
      `SELECT COUNT(*) AS prepared_orders 
       FROM orders WHERE done_status = 'prepared'`
    );

    const [[totalUsers]] = await db.query(
      `SELECT COUNT(*) AS total_users FROM users`
    );

    const [[totalRevenue]] = await db.query(
      `SELECT IFNULL(SUM(total_amount),0) AS total_revenue FROM orders`
    );

    res.json({
      total_orders: totalOrders.total_orders,
      today_orders: todayOrders.today_orders,
      pending_orders: pending.pending_orders,
      prepared_orders: prepared.prepared_orders,
      total_users: totalUsers.total_users,
      total_revenue: totalRevenue.total_revenue,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
};


export const getOrdersBySlot = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ts.slot_name, COUNT(o.order_id) AS order_count
       FROM time_slots ts
       LEFT JOIN orders o ON ts.time_slot_id = o.time_slot_id
       GROUP BY ts.time_slot_id
       ORDER BY ts.start_time`
    );

    res.json(rows);
  } catch (err) {
    console.error("Orders by slot error:", err);
    res.status(500).json({ error: "Failed to load slot chart" });
  }
};

export const getRevenueDaily = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DATE(order_date) AS date,
              SUM(total_amount) AS revenue
       FROM orders
       GROUP BY DATE(order_date)
       ORDER BY DATE(order_date)`
    );

    res.json(rows);
  } catch (err) {
    console.error("Revenue daily error:", err);
    res.status(500).json({ error: "Failed to load revenue chart" });
  }
};

export const getTopSellingItems = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.item_name, SUM(oi.quantity) AS total_sold
       FROM order_items oi
       JOIN menu m ON oi.menu_id = m.menu_id
       GROUP BY oi.menu_id
       ORDER BY total_sold DESC
       LIMIT 5`
    );

    res.json(rows);
  } catch (err) {
    console.error("Top items error:", err);
    res.status(500).json({ error: "Failed to load top items" });
  }
};
