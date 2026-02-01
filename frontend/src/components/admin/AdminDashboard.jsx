import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUpload, 
  FaGift,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaBullhorn 
} from 'react-icons/fa';
import { GrServices } from "react-icons/gr";
import AdminHeader from './AdminHeader';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    services: { total: 0, active: 0 },
    contacts: { total: 0, new: 0 },
    uploads: { total: 0, pending: 0 },
    offers: { total: 0, active: 0 },
    notifications: { total: 0, active: 0 } 
  });
  const [recentActivity, setRecentActivity] = useState({
    contacts: [],
    uploads: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data.data.stats);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Services',
      value: stats.services.total,
      icon: GrServices,
      color: 'green',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'New Contacts',
      value: stats.contacts.new,
      icon: FaUsers,
      color: 'blue',
      trend: '+8%',
      trendUp: true
    },
    // {
    //   title: 'Pending Uploads',
    //   value: stats?.uploads?.pending,
    //   icon: FaUpload,
    //   color: 'red',
    //   trend: '-3%',
    //   trendUp: false
    // },
    {
      title: 'Active Notifications',
      value: stats?.notifications?.active || 0, // Add this
      icon: FaBullhorn,
      color: 'purple',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Active Offers',
      value: stats.offers.active,
      icon: FaGift,
      color: 'yellow',
      trend: '+5%',
      trendUp: true
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <AdminHeader title="Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminHeader title="Dashboard" />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center text-sm font-semibold ${
                stat.trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trendUp ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Stats */}
        <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-2 text-primary-green" />
            Quick Statistics
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Total Service Views', value: '12,456', change: '+23%' },
              { label: 'Document Submissions', value: '3,245', change: '+15%' },
              { label: 'WhatsApp Enquiries', value: '1,867', change: '+42%' },
              { label: 'Offer Conversions', value: '456', change: '+8%' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-gray-700">{item.label}</span>
                <div className="text-right">
                  <div className="font-semibold">{item.value}</div>
                  <div className="text-sm text-green-600">{item.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity?.contacts.slice(0, 4).map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  contact.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
