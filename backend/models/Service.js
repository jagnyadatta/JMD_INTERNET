import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  icon: {
    type: String,
    required: [true, 'Service icon is required']
  },
  image: {
    url: String,
    publicId: String
  },
  description: {
    type: String,
    required: [true, 'Short description is required']
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required']
  },
  processingTime: {
    type: String,
    required: [true, 'Processing time is required']
  },
  documents: [{
    type: String,
    required: [true, 'Documents are required']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  meta: {
    views: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
serviceSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Service', serviceSchema);
