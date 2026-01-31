import Service from '../models/Service.js';
import cloudinary from '../config/cloudinary.js';

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Get single service by ID or slug
export const getService = async (req, res) => {
  try {
    const { id } = req.params;
    
    let service;
    if (mongoose.Types.ObjectId.isValid(id)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Increment view count
    service.meta.views += 1;
    await service.save();
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Create new service (Admin only)
export const createService = async (req, res) => {
  try {
    const { title, description, fullDescription, processingTime, documents } = req.body;
    
    // Check if service already exists
    const existingService = await Service.findOne({ 
      $or: [
        { title: { $regex: new RegExp(`^${title}$`, 'i') } }
      ]
    });
    
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service with this title already exists'
      });
    }
    
    // Handle image upload
    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'jmd-internet/services',
        width: 800,
        height: 400,
        crop: 'fill'
      });
      
      imageData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }
    
    const service = await Service.create({
      title,
      description,
      fullDescription,
      processingTime,
      documents: JSON.parse(documents),
      icon: req.body.icon || 'file',
      image: imageData,
      createdBy: req.admin._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Update service (Admin only)
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    let service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (service.image?.publicId) {
        await cloudinary.uploader.destroy(service.image.publicId);
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'jmd-internet/services',
        width: 800,
        height: 400,
        crop: 'fill'
      });
      
      updates.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }
    
    // Parse documents if present
    if (updates.documents) {
      updates.documents = JSON.parse(updates.documents);
    }
    
    service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service (Admin only)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Delete image from Cloudinary
    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId);
    }
    
    // Soft delete (set isActive to false)
    service.isActive = false;
    await service.save();
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};
