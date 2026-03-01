import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUpload, 
  FaGift,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaBullhorn,
  FaCalendarAlt 
} from 'react-icons/fa';
import { GrServices } from "react-icons/gr";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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
  const [followUps, setFollowUps] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFollowUps, setSelectedFollowUps] = useState([]);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchFollowUps();
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

  const fetchFollowUps = async () => {
    try {
      // Fetch all records with follow-up dates
      const response = await adminApi.getRecordsFollowUp();
      
      // Check if response has the expected structure
      let allRecords = [];
      if (response && response.data && response.data.records) {
        allRecords = response.data.records;
      } else if (response && response.records) {
        allRecords = response.records;
      } else if (Array.isArray(response)) {
        allRecords = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        allRecords = response.data;
      }
      
      // Extract all follow-up dates from records
      const followUpList = [];
      allRecords.forEach(record => {
        if (record.details && record.details.length > 0) {
          record.details.forEach(detail => {
            if (detail.followUp) {
              // Parse the date without timezone conversion
              const followUpDate = detail.followUp;
              // Extract year, month, day from the ISO string
              const [year, month, day] = followUpDate.split('T')[0].split('-').map(Number);
              // Create a date at noon UTC to avoid timezone issues
              const localDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
              
              followUpList.push({
                id: detail._id,
                recordId: record._id,
                recordName: record.name,
                recordNumber: record.number,
                service: detail.service,
                refNo: detail.refNo,
                date: detail.date,
                followUp: detail.followUp,
                followUpLocal: localDate, // Store the local date for comparison
                followUpYear: year,
                followUpMonth: month - 1,
                followUpDay: day,
                remark: detail.remark
              });
            }
          });
        }
      });
      
      setFollowUps(followUpList);
      
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    
    // Filter follow-ups for the selected date using year, month, day comparison
    const followUpsOnDate = followUps.filter(followUp => {
      return followUp.followUpYear === date.getFullYear() &&
            followUp.followUpMonth === date.getMonth() &&
            followUp.followUpDay === date.getDate();
    });
    
    setSelectedFollowUps(followUpsOnDate);
    
    if (followUpsOnDate.length > 0) {
      setShowFollowUpModal(true);
    } else {
      toast.info('No follow-ups for this date');
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasFollowUp = followUps.some(followUp => {
        return followUp.followUpYear === date.getFullYear() &&
              followUp.followUpMonth === date.getMonth() &&
              followUp.followUpDay === date.getDate();
      });
      
      if (hasFollowUp) {
        return 'followup-date';
      }
    }
    return null;
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
    {
      title: 'Active Notifications',
      value: stats?.notifications?.active || 0,
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

      {/* Calendar and Activity Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaCalendarAlt className="mr-2 text-primary-green" />
            Follow-up Calendar
          </h3>
          <div className="calendar-container">
            <Calendar
              onChange={handleDateClick}
              value={selectedDate}
              tileClassName={tileClassName}
              className="w-full border-none"
            />
            <div className="mt-4 text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="inline-block w-3 h-3 bg-green-200 rounded-full mr-1 ml-2"></span>
              Days with follow-ups (green background)
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-2 text-primary-green" />
            Quick Statistics
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Total Follow-ups', value: followUps.length, change: '' },
              { label: 'This Month\'s Follow-ups', value: followUps.filter(f => {
                const now = new Date();
                return f.followUpMonth === now.getMonth() && 
                      f.followUpYear === now.getFullYear();
              }).length, change: '' },
              { label: 'Today\'s Follow-ups', value: followUps.filter(f => {
                const today = new Date();
                return f.followUpYear === today.getFullYear() &&
                      f.followUpMonth === today.getMonth() &&
                      f.followUpDay === today.getDate();
              }).length, change: '' },
              { label: 'Upcoming Follow-ups', value: followUps.filter(f => {
                const today = new Date();
                const followUpDate = new Date(f.followUpYear, f.followUpMonth, f.followUpDay);
                return followUpDate > today;
              }).length, change: '' },
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
      </div>

      {/* Follow-up Details Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Follow-ups for {selectedDate.toLocaleDateString()}
              </h3>
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedFollowUps.length > 0 ? (
                selectedFollowUps.map((followUp, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{followUp.recordName}</h4>
                        <p className="text-sm text-gray-600">Number: {followUp.recordNumber}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Follow-up
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                      <div>
                        <p className="text-gray-600">Service:</p>
                        <p className="font-medium">{followUp.service || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ref No:</p>
                        <p className="font-medium">{followUp.refNo || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Service Date:</p>
                        <p className="font-medium">
                          {followUp.date ? new Date(followUp.date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Follow-up Date:</p>
                        <p className="font-medium">
                          {new Date(followUp.followUp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {followUp.remark && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Remark:</span> {followUp.remark}
                        </p>
                      </div>
                    )}
                    
                    {/* <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => window.location.href = `/admin/records/${followUp.recordId}`}
                        className="text-primary-green hover:text-primary-green-dark text-sm font-medium"
                      >
                        View Record →
                      </button>
                    </div> */}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No follow-ups for this date</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .followup-date {
          position: relative;
          background-color: rgba(16, 185, 129, 0.2) !important;
          border-radius: 50%;
          font-weight: bold;
        }
        .followup-date::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background-color: #10b981;
          border-radius: 50%;
        }
        .followup-date:hover {
          background-color: rgba(16, 185, 129, 0.3) !important;
        }
        .calendar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .react-calendar {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
        }
        .react-calendar__tile {
          padding: 1em 0.5em;
          position: relative;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f3f4f6;
          border-radius: 8px;
        }
        .react-calendar__tile--active {
          background-color: #10b981 !important;
          color: white !important;
          border-radius: 8px;
        }
        .react-calendar__tile--now {
          background-color: #e5e7eb;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
