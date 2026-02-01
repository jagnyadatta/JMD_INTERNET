// models/Visitor.js
import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Visitor', visitorSchema);