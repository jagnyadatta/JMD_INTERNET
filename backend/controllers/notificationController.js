// controllers/notificationController.js
import Notification from '../models/Notification.js';

// Get active notifications
export const getActiveNotifications = async (req, res) => {
  try {
    const now = new Date();
    
    const notifications = await Notification.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ priority: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    });
  }
};

// Create notification (Admin only)
export const createNotification = async (req, res) => {
  try {
    const { text, whatsappMessage, priority, startDate, endDate } = req.body;
    
    const notification = await Notification.create({
      text,
      whatsappMessage: whatsappMessage || 'Hello! I want to know more about this offer.',
      priority: priority || 1,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(+new Date() + 30 * 24 * 60 * 60 * 1000)
    });
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
    
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
};

// Update notification (Admin only)
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    });
    
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
};

// Delete notification (Admin only)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndDelete(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

// Get all notifications (Admin only)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
    
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    });
  }
};
