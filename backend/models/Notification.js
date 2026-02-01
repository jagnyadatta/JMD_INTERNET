// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Notification text is required'],
    trim: true
  },
  whatsappMessage: {
    type: String,
    default: 'Hello! I want to know more about this offer.'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
}, {
  timestamps: true
});

// Check if notification is currently active
notificationSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now;
});

export default mongoose.model('Notification', notificationSchema);
