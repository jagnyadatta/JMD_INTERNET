import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  serviceInterest: {
    type: String,
    default: 'General Inquiry'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved', 'spam'],
    default: 'new'
  },
  adminNotes: String,
  response: String,
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  respondedAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Contact', contactSchema);
