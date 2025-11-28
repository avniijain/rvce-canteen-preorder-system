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
import api from "../../api/axios";

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

  // Helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
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

  // Fetch data
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

  // VIEW DETAILS
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
      alert("Error fetching order details");
      setShowDetailsModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Status updates
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
      alert("Error updating preparation");
    }
  };

  // Filtering
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
        order.user_name?.toLowerCase().includes(search)) &&
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

  // Dashboard stats
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
        {/* ------------------------- HEADER + FILTERS ------------------------- */}

        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#3F7D58" }}>
            Orders Management
          </h1>

          {/* Search + Filter Toggle */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 py-2 border rounded-lg"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-2 border rounded-lg"
              style={{
                backgroundColor: showFilters ? "#EF9651" : "white",
                color: showFilters ? "white" : "#3F7D58",
                borderColor: "#3F7D58",
              }}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* FILTER BOX */}
          {showFilters && (
            <div className="mt-4 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Date Filter */}
              <div>
                <label>Date</label>
                <select
                  value={filters.dateFilter}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFilter: e.target.value })
                  }
                  className="w-full border px-2 py-2 rounded"
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {filters.dateFilter === "custom" && (
                <div>
                  <label>Select Date</label>
                  <input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) =>
                      setFilters({ ...filters, customDate: e.target.value })
                    }
                    className="w-full border px-2 py-2 rounded"
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full border px-2 py-2 rounded"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="pickedup">Picked Up</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Preparation */}
              <div>
                <label>Preparation</label>
                <select
                  value={filters.doneStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, doneStatus: e.target.value })
                  }
                  className="w-full border px-2 py-2 rounded"
                >
                  <option value="all">All</option>
                  <option value="prepared">Prepared</option>
                  <option value="not-prepared">Not Prepared</option>
                </select>
              </div>

              {/* Slot */}
              <div>
                <label>Slot</label>
                <select
                  value={filters.slot}
                  onChange={(e) =>
                    setFilters({ ...filters, slot: e.target.value })
                  }
                  className="w-full border px-2 py-2 rounded"
                >
                  <option value="all">All</option>
                  {slots.map((slot) => (
                    <option key={slot.time_slot_id} value={slot.time_slot_id}>
                      {slot.slot_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------- ORDERS TABLE ------------------------- */}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#3F7D58" }}>
              <tr>
                <th className="px-6 py-4 text-left text-white">Order ID</th>
                <th className="px-6 py-4 text-left text-white">User</th>
                <th className="px-6 py-4 text-left text-white">Date</th>
                <th className="px-6 py-4 text-left text-white">Pickup</th>
                <th className="px-6 py-4 text-left text-white">Slot</th>
                <th className="px-6 py-4 text-left text-white">Amount</th>
                <th className="px-6 py-4 text-left text-white">Status</th>
                <th className="px-6 py-4 text-left text-white">Prepared</th>
                <th className="px-6 py-4 text-center text-white">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.order_id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "white" : "#F9F9F9",
                  }}
                >
                  <td className="px-6 py-4 font-semibold text-green-800">
                    {order.order_id}
                  </td>
                  <td className="px-6 py-4">{order.user_name}</td>
                  <td className="px-6 py-4">{formatDate(order.order_date)}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    {formatTime(order.pickup_time)}
                  </td>
                  <td className="px-6 py-4">{getSlotName(order.time_slot_id)}</td>
                  <td className="px-6 py-4 font-bold text-orange-500">
                    ₹{order.total_amount}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {order.order_status === "expired" ? (
                      <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full text-xs">
                        Expired
                      </span>
                    ) : (
                      <select
                        className="border px-2 py-1 rounded"
                        value={order.order_status}
                        onChange={(e) =>
                          updateOrderStatus(order.order_id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="pickedup">Picked Up</option>
                      </select>
                    )}
                  </td>

                  {/* Preparation */}
                  <td className="px-6 py-4">
                    <select
                      className="border px-2 py-1 rounded"
                      value={order.done_status}
                      onChange={(e) =>
                        updateDoneStatus(order.order_id, e.target.value)
                      }
                    >
                      <option value="prepared">Prepared</option>
                      <option value="not-prepared">Not Prepared</option>
                    </select>
                  </td>

                  {/* View */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openDetailsModal(order)}
                      className="px-4 py-2 rounded bg-orange-100 text-orange-600 flex items-center gap-2"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No matching orders
            </div>
          )}
        </div>
      </div>

      {/* ------------------------- VIEW DETAILS MODAL ------------------------- */}

      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-green-700">Order Details</h2>
              <button onClick={() => setShowDetailsModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {detailsLoading ? (
                <p className="text-center py-10">Loading...</p>
              ) : (
                selectedOrder && (
                  <>
                    {/* User Info */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold flex items-center gap-2 mb-3">
                        <User size={20} /> Customer Info
                      </h3>
                      <p>User ID: {selectedOrder.user_id}</p>
                      <p>Name: {selectedOrder.user_name || "N/A"}</p>
                      <p>Phone: {selectedOrder.phone || "N/A"}</p>
                      <p>Email: {selectedOrder.email || "N/A"}</p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-3">Items</h3>
                      <table className="w-full border rounded">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Price</th>
                            <th className="px-4 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items?.map((item, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-4 py-2">{item.item_name}</td>
                              <td className="px-4 py-2 text-center">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">₹{item.unit_price}</td>
                              <td className="px-4 py-2 text-right">
                                ₹{item.unit_price * item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Total */}
                    <div className="text-right text-xl font-bold text-green-800">
                      Total: ₹{selectedOrder.total_amount}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
