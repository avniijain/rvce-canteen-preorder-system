import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import api from "../../api/axios";   // <-- your axios instance

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    status: 'all',
    stockBased: 'all',
    category: 'all'
  });

  const [formData, setFormData] = useState({
    item_name: '',
    price: '',
    category: 'South Indian',
    is_stock_based: false,
    available_qty: 0,
    is_active: true
  });

  const categories = [
    'South Indian', 'North Indian', 'Snacks', 'Beverages',
    'Ice Cream', 'Chinese', 'Non-Veg'
  ];

  // ------------------------------------------
  // FETCH MENU FROM BACKEND
  // ------------------------------------------
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/menu/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMenuItems(res.data.menu || res.data); // adjust if backend format differs
    } catch (err) {
      console.error("Menu fetch failed:", err);
    }
  };

  // ------------------------------------------
  // OPEN ADD MODAL
  // ------------------------------------------
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      item_name: '',
      price: '',
      category: 'South Indian',
      is_stock_based: false,
      available_qty: 0,
      is_active: true
    });
    setShowModal(true);
  };

  // ------------------------------------------
  // OPEN EDIT MODAL
  // ------------------------------------------
  const openEditModal = (item) => {
    setModalMode('edit');
    setCurrentItem({ ...item, id: item.menu_id });
    setFormData({
      item_name: item.item_name,
      price: item.price,
      category: item.category,
      is_stock_based: item.is_stock_based,
      available_qty: item.available_qty,
      is_active: item.is_active
    });
    setShowModal(true);
  };

  // ------------------------------------------
  // ADD OR UPDATE API CALL
  // ------------------------------------------
  const handleSubmit = async () => {
    if (!formData.item_name || !formData.price) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      if (modalMode === "add") {
        await api.post("/admin/menu/add", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.put(`/admin/menu/update/${currentItem.menu_id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowModal(false);
      fetchMenu(); // reload from DB
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Error saving item");
    }
  };

  // ------------------------------------------
  // DELETE API CALL
  // ------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await api.delete(`/admin/menu/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchMenu();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting item");
    }
  };

  // ------------------------------------------
  // FILTER + SEARCH LOGIC
  // ------------------------------------------
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.item_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && item.is_active) ||
      (filters.status === "inactive" && !item.is_active);

    const matchesStock =
      filters.stockBased === "all" ||
      (filters.stockBased === "stock" && item.is_stock_based) ||
      (filters.stockBased === "nonstock" && !item.is_stock_based);

    const matchesCategory =
      filters.category === "all" || item.category === filters.category;

    return matchesSearch && matchesStatus && matchesStock && matchesCategory;
  });

  // ------------------------------------------
  // FRONTEND UI (UNCHANGED)
  // ------------------------------------------
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#EFEFEF' }}>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#3F7D58' }}>
                Menu Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your restaurant menu items
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium shadow-md"
              style={{ backgroundColor: '#3F7D58' }}
            >
              <Plus size={20} />
              Add Menu Item
            </button>
          </div>
          {/* Search and Filter */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50"
                  style={{ focusBorderColor: '#EF9651' }}
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all"
              style={{ 
                backgroundColor: showFilters ? '#EF9651' : 'white',
                color: showFilters ? 'white' : '#3F7D58',
                border: showFilters ? 'none' : '2px solid #3F7D58'
              }}
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-5 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4" style={{ backgroundColor: '#FDF6F0', border: '2px solid #EF9651' }}>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3F7D58' }}>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#EF9651' }}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3F7D58' }}>Stock Type</label>
                <select
                  value={filters.stockBased}
                  onChange={(e) => setFilters({...filters, stockBased: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#EF9651' }}
                >
                  <option value="all">All</option>
                  <option value="stock">Stock Based</option>
                  <option value="nonstock">Non-Stock Based</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3F7D58' }}>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#EF9651' }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#3F7D58' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Item Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Stock Based</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Available Qty</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className="transition-colors" style={{ backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA' }}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.item_name}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#EF9651' }}>₹{item.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E8F5E9', color: '#3F7D58' }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.is_stock_based ? (
                        <span className="font-medium" style={{ color: '#3F7D58' }}>Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.is_stock_based ? (
                        <span className={item.available_qty < 10 ? 'font-bold' : 'text-gray-900'} style={{ color: item.available_qty < 10 ? '#EC5228' : '#333' }}>
                          {item.available_qty}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium`} style={{
                        backgroundColor: item.is_active ? '#E8F5E9' : '#FFEBEE',
                        color: item.is_active ? '#3F7D58' : '#EC5228'
                      }}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg transition-all hover:opacity-80"
                          style={{ backgroundColor: '#FDF6F0', color: '#EF9651' }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.menu_id)}
                          className="p-2 rounded-lg transition-all hover:opacity-80"
                          style={{ backgroundColor: '#FFEBEE', color: '#EC5228' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No menu items found
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-6 py-4 border-b-2 flex justify-between items-center" style={{ borderColor: '#EF9651' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#3F7D58' }}>
                {modalMode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3F7D58' }}>Item Name *</label>
                <input
                  type="text"
                  value={formData.item_name}
                  onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                  style={{ focusBorderColor: '#EF9651' }}
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3F7D58' }}>Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3F7D58' }}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FDF6F0' }}>
                <input
                  type="checkbox"
                  id="stock_based"
                  checked={formData.is_stock_based}
                  onChange={(e) => setFormData({...formData, is_stock_based: e.target.checked, available_qty: e.target.checked ? formData.available_qty : 0})}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#EF9651' }}
                />
                <label htmlFor="stock_based" className="text-sm font-semibold" style={{ color: '#3F7D58' }}>
                  Stock Based Item
                </label>
              </div>

              {formData.is_stock_based && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3F7D58' }}>Available Quantity *</label>
                  <input
                    type="number"
                    value={formData.available_qty}
                    onChange={(e) => setFormData({...formData, available_qty: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                    placeholder="Enter quantity"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: '#3F7D58' }}
                />
                <label htmlFor="is_active" className="text-sm font-semibold" style={{ color: '#3F7D58' }}>
                  Active Item
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 shadow-md"
                  style={{ backgroundColor: '#3F7D58' }}
                >
                  {modalMode === 'add' ? 'Add Item' : 'Update Item'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 shadow-md"
                  style={{ backgroundColor: '#EF9651', color: 'white' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
