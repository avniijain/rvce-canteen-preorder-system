import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import api from "../../api/axios";   // axios instance

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentSlot, setCurrentSlot] = useState(null);
  const [deleteSlotId, setDeleteSlotId] = useState(null);

  const [formData, setFormData] = useState({
    slot_name: "",
    start_time: "",
    end_time: "",
    is_active: true,
    order_count: 0
  });

  // ---------------------------------
  // FETCH SLOTS FROM BACKEND
  // ---------------------------------
  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/slots/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSlots(res.data.slots || res.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  };

  // ---------------------------------
  // OPEN ADD MODAL
  // ---------------------------------
  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      slot_name: "",
      start_time: "",
      end_time: "",
      is_active: true,
      order_count: 0
    });
    setShowModal(true);
  };

  // ---------------------------------
  // OPEN EDIT MODAL
  // ---------------------------------
  const openEditModal = (slot) => {
    setModalMode("edit");
    setCurrentSlot(slot);
    setFormData({
      slot_name: slot.slot_name,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_active: slot.is_active,
      order_count: slot.order_count
    });
    setShowModal(true);
  };

  // ---------------------------------
  // SUBMIT FORM (ADD / UPDATE)
  // ---------------------------------
  const handleSubmit = async () => {
    if (!formData.slot_name || !formData.start_time || !formData.end_time) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.start_time >= formData.end_time) {
      alert("End time must be after start time");
      return;
    }

    const token = localStorage.getItem("adminToken");

    try {
      if (modalMode === "add") {
        await api.post("/admin/slots/", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.put(`/admin/slots/${currentSlot.time_slot_id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowModal(false);
      fetchSlots();
    } catch (err) {
      console.error("Slot save failed:", err);
      alert("Error saving slot");
    }
  };

  // ---------------------------------
  // OPEN DELETE CONFIRMATION
  // ---------------------------------
  const openDeleteConfirm = (id) => {
    setDeleteSlotId(id);
    setShowDeleteConfirm(true);
  };

  // ---------------------------------
  // DELETE SLOT
  // ---------------------------------
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      await api.delete(`/admin/slots/${deleteSlotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowDeleteConfirm(false);
      setDeleteSlotId(null);
      fetchSlots();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting slot");
    }
  };

  // ---------------------------------
  // FRONTEND UI (unchanged)
  // ---------------------------------
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#EFEFEF" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#3F7D58" }}>
                Slot Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage delivery and service time slots
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium shadow-md"
              style={{ backgroundColor: "#3F7D58" }}
            >
              <Plus size={20} />
              Add Slot
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-gray-600 text-sm font-medium">Total Slots</p>
            <p className="text-3xl font-bold mt-1" style={{ color: "#3F7D58" }}>{slots.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-gray-600 text-sm font-medium">Active Slots</p>
            <p className="text-3xl font-bold mt-1" style={{ color: "#EF9651" }}>
              {slots.filter(s => s.is_active).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold mt-1" style={{ color: "#3F7D58" }}>
              {slots.reduce((sum, slot) => sum + (slot.order_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Table */}
        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#3F7D58" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Slot Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Start Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">End Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Order Count</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {slots.map((slot, index) => (
                  <tr key={slot.time_slot_id} style={{ backgroundColor: index % 2 === 0 ? "white" : "#FAFAFA" }}>

                    <td className="px-6 py-4 text-sm font-semibold">{slot.slot_name}</td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} style={{ color: "#EF9651" }} /> {slot.start_time}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} style={{ color: "#EF9651" }} /> {slot.end_time}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: '#FDF6F0', color: '#EF9651' }}>
                        {slot.order_count || 0} orders
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: slot.is_active ? "#E8F5E9" : "#FFEBEE",
                          color: slot.is_active ? "#3F7D58" : "#EC5228"
                        }}>
                        {slot.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEditModal(slot)}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "#FDF6F0", color: "#EF9651" }}>
                          <Edit2 size={18} />
                        </button>

                        <button
                          onClick={() => openDeleteConfirm(slot.time_slot_id)}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "#FFEBEE", color: "#EC5228" }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {slots.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No slots found.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            <div className="px-6 py-4 border-b flex justify-between items-center"
                 style={{ borderColor: "#EF9651" }}>
              <h2 className="text-xl font-bold" style={{ color: "#3F7D58" }}>
                {modalMode === "add" ? "Add New Slot" : "Edit Slot"}
              </h2>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Slot Name */}
              <div>
                <label>Slot Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  value={formData.slot_name}
                  onChange={(e) =>
                    setFormData({ ...formData, slot_name: e.target.value })
                  }
                />
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Start Time *</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border rounded"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label>End Time *</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border rounded"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Active Toggle */}
              {modalMode === "edit" && (
                <div className="flex items-center gap-3 p-4 rounded-lg"
                     style={{ backgroundColor: "#E8F5E9" }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                  <span>Active Slot</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 rounded-lg text-white"
                  style={{ backgroundColor: "#3F7D58" }}
                >
                  {modalMode === "add" ? "Add Slot" : "Update Slot"}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg"
                  style={{ backgroundColor: "#EF9651", color: "white" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-center mb-4" style={{ color: "#EC5228" }}>
              Delete Slot?
            </h3>
            <p className="text-center text-gray-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-2 rounded-lg text-white"
                style={{ backgroundColor: "#EC5228" }}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagement;
