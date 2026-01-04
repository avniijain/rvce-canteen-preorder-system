import React, { useState, useEffect } from 'react';
import api from "../../api/axios";
import { TrendingUp, ShoppingBag, Users, DollarSign, Clock, CheckCircle, Package, LogOut } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CanteenDashboard = () => {
  const [summary, setSummary] = useState({
    total_orders: 0,
    today_orders: 0,
    pending_orders: 0,
    prepared_orders: 0,
    total_users: 0,
    total_revenue: 0
  });
  const [ordersBySlot, setOrdersBySlot] = useState([]);
  const [revenueDaily, setRevenueDaily] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3F7D58', '#EF9651', '#EC5228', '#2c5f45', '#d97d3f'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { data: summaryData } = await api.get("/admin/dashboard/summary");
      setSummary(summaryData);

      const { data: slotData } = await api.get("/admin/dashboard/orders-by-slot");
      setOrdersBySlot(slotData);

      const { data: revenueData } = await api.get("/admin/dashboard/revenue-daily");
      setRevenueDaily(revenueData);

      const { data: topItemsData } = await api.get("/admin/dashboard/top-items");
      setTopItems(topItemsData);

      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#3F7D58' }}></div>
          <p style={{ color: '#6c757d' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #e9ecef' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#2c3e50' }}>Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6c757d' }}>Total Orders</p>
                <p className="text-3xl font-bold" style={{ color: '#2c3e50' }}>{summary.total_orders}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                <ShoppingBag size={24} style={{ color: '#3F7D58' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6c757d' }}>Today's Orders</p>
                <p className="text-3xl font-bold" style={{ color: '#2c3e50' }}>{summary.today_orders}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fff3e0' }}>
                <TrendingUp size={24} style={{ color: '#EF9651' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6c757d' }}>Total Revenue</p>
                <p className="text-3xl font-bold" style={{ color: '#2c3e50' }}>₹{Number(summary.total_revenue).toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                <DollarSign size={24} style={{ color: '#3F7D58' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6c757d' }}>Pending Orders</p>
                <p className="text-3xl font-bold" style={{ color: '#2c3e50' }}>{summary.pending_orders}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#ffebee' }}>
                <Clock size={24} style={{ color: '#EC5228' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6c757d' }}>Prepared Orders</p>
                <p className="text-3xl font-bold" style={{ color: '#2c3e50' }}>{summary.prepared_orders}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                <CheckCircle size={24} style={{ color: '#3F7D58' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#6c757d' }}>Total Users</p>
                <p className="text-3xl font-bold" style={{ color: '#2c3e50' }}>{summary.total_users}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fff3e0' }}>
                <Users size={24} style={{ color: '#EF9651' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders by Slot */}
          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>Orders by Time Slot</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersBySlot}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="slot_name" stroke="#6c757d" />
                <YAxis stroke="#6c757d" />
                <Tooltip />
                <Bar dataKey="order_count" fill="#3F7D58" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>Daily Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="date" stroke="#6c757d" />
                <YAxis stroke="#6c757d" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#EF9651" strokeWidth={3} dot={{ fill: '#EF9651', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '1px solid #e9ecef' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#2c3e50' }}>Top Items List</h3>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#2c3e50' }}>{item.item_name}</p>
                    <p className="text-sm" style={{ color: '#6c757d' }}>Sold: {item.total_sold} units</p>
                  </div>
                </div>
                <Package size={20} style={{ color: '#6c757d' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;