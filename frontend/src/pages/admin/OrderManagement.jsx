import React, { useState, useEffect } from "react";
import {
  X,
  Eye,
  Clock,
  User,
  Package,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import api from "../../api/axios"; // your axios instance

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [slots, setSlots] = useState([]);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    dateFilter: "all",
    status: "all",
    doneStatus: "all",
    slot: "all",
    customDate: "",
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB");
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const getTodayISO = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(t.getDate()).padStart(2, "0")}`;
  };

  const getSlotName = (id) => {
    const s = slots.find((slot) => slot.time_slot_id === id);
    return s ? s.slot_name : `Slot #${id}`;
  };

  // Fetch orders & slots
  useEffect(() => {
    fetchOrders();
    fetchSlots();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/admin/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data.slots || res.data || []);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  };

  const openDetailsModal = async (order) => {
    setShowDetailsModal(true);
    setSelectedOrder(null);
    setDetailsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get(`/admin/orders/${order.order_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(res.data);
    } catch (err) {
      console.error("Failed:", err);
      alert("Error fetching details");
      setShowDetailsModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.patch(
        `/admin/orders/${orderId}/status`,
        { order_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, order_status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status");
    }
  };

  const updateDoneStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.patch(
        `/admin/orders/${orderId}/preparation`,
        { done_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, done_status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update preparation:", err);
      alert("Error updating preparation");
    }
  };

  const todayISO = getTodayISO();

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase().trim();
    const orderDateISO = formatDate(order.order_date)
      .split("/")
      .reverse()
      .join("-");

    return (
      (!search ||
        order.order_id.toString().includes(search) ||
        order.user_id.toString().includes(search)) &&
      (filters.dateFilter === "all" ||
        (filters.dateFilter === "today" && orderDateISO === todayISO) ||
        (filters.dateFilter === "custom" &&
          orderDateISO === filters.customDate)) &&
      (filters.status === "all" || filters.status === order.order_status) &&
      (filters.doneStatus === "all" ||
        filters.doneStatus === order.done_status) &&
      (filters.slot === "all" ||
        Number(filters.slot) === Number(order.time_slot_id))
    );
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.order_status === "pending").length,
    today: orders.filter(
      (o) =>
        formatDate(o.order_date).split("/").reverse().join("-") ===
        todayISO
    ).length,
    prepared: orders.filter(
      (o) => o.done_status === "prepared" && o.order_status === "pending"
    ).length,
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#EFEFEF" }}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION (unchanged) */}
        {/* -------------------------------------------------------------- */}
        {/* ... HEADER + FILTERS + STATS (same as original code) ... */}
        {/* -------------------------------------------------------------- */}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#3F7D58" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Pickup Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Slot
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Amount
                  </th>

                  {/* 🔥 UPDATED UI */}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Preparation
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.order_id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "white" : "#FAFAFA",
                    }}
                  >
                    <td className="px-6 py-4 font-semibold" style={{ color: "#3F7D58" }}>
                      {order.order_id}
                    </td>

                    <td className="px-6 py-4">User #{order.user_id}</td>
                    <td className="px-6 py-4">{formatDate(order.order_date)}</td>

                    <td className="px-6 py-4 flex items-center gap-2">
                      <Clock size={16} style={{ color: "#EF9651" }} />
                      {formatTime(order.pickup_time)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "#E8F5E9",
                          color: "#3F7D58",
                        }}
                      >
                        {getSlotName(order.time_slot_id)}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold" style={{ color: "#EF9651" }}>
                      ₹{order.total_amount}
                    </td>

                    {/* 🔥 UPDATED DROPDOWN: ORDER STATUS */}
                    <td className="px-6 py-4">
                      {order.order_status === "expired" ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-500">
                          Expired
                        </span>
                      ) : (
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            updateOrderStatus(order.order_id, e.target.value)
                          }
                          className="px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="pickedup">Picked Up</option>
                        </select>
                      )}
                    </td>

                    {/* 🔥 UPDATED DROPDOWN: PREPARATION */}
                    <td className="px-6 py-4">
                      <select
                        value={order.done_status}
                        onChange={(e) =>
                          updateDoneStatus(order.order_id, e.target.value)
                        }
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="prepared">Prepared</option>
                        <option value="not-prepared">Not Prepared</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="px-4 py-2 rounded-lg"
                        style={{ backgroundColor: "#FDF6F0", color: "#EF9651" }}
                      >
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No orders found.
            </div>
          )}
        </div>
      </div>

      {/* MODAL (unchanged) */}
      {/* ... FULL MODAL CODE IS SAME AS ORIGINAL ... */}
    </div>
  );
};

export default OrderManagement;
