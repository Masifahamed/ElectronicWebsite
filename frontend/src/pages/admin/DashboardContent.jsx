// DashboardContent.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, Package, Users, ShoppingCart, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const DashboardContent = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // ------- 1. Load Product Count --------
      const productRes = await fetch("http://localhost:3500/api/product");
      const productData = await productRes.json();
      const products = productData?.data ?? [];

      // ------- 2. Load All Users --------
      const userRes = await fetch("http://localhost:3500/api/user/getuser");
      const userData = await userRes.json();
      const users = userData?.data ?? [];

      // ------- 3. Load All Orders --------
      const orderRes = await fetch("http://localhost:3500/api/order/orderlist");
      const orderData = await orderRes.json();
      const orders = orderData?.data ?? [];

      // ------- 4. Calculate Revenue --------
      const totalRevenue = orders.reduce(
        (sum, o) => sum + (o.totalprice || 500),
        0
      );

      // ------- 5. Recent 5 orders --------
      setRecentOrders(orders.slice(-5).reverse());

      // ------- 6. Update Stats --------
      setStats({
        revenue: totalRevenue,
        orders: orders.length,
        products: Array.isArray(products) ? products.length : 0,
        users: users.length
      });

    } catch (error) {
      console.error("Dashboard loading error:", error);
    }
  };

  const statsData = [
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString('en-IN')}`,
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: stats.orders.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Products',
      value: stats.products.toString(),
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Users',
      value: stats.users.toString(),
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Here's what's happening in your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>

        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">User: {order.userId?.first}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{order.totalprice}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>

        <div className="space-y-3 flex flex-col">
          <NavLink to='/adminpage/productcontent'>
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              <span>Add New Product</span>
              <Plus size={20} />
            </button>
          </NavLink>

          <NavLink to='/adminpage/ordercontent'>
            <button className="w-full flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
              <span>View All Orders</span>
              <ShoppingCart size={20} />
            </button>
          </NavLink>

          <NavLink to='/adminpage/usercontent'>
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
              <span>Manage Users</span>
              <Users size={20} />
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
