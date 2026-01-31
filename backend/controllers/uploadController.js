import Upload from '../models/Upload.js';
import Service from '../models/Service.js';
import cloudinary from '../config/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';

// Upload documents
export const uploadDocuments = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Generate unique user ID (in production, use actual user authentication)
    const userId = req.userId || uuidv4();
    
    // Upload files to Cloudinary
    const uploadPromises = files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: `jmd-internet/documents/${serviceId}/${userId}`,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
      })
    );
    
    const results = await Promise.all(uploadPromises);
    
    // Prepare files data
    const uploadedFiles = results.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      fileName: files[index].originalname,
      fileType: files[index].mimetype,
      size: files[index].size
    }));
    
    // Create upload record
    const upload = await Upload.create({
      serviceId,
      userId,
      files: uploadedFiles,
      status: 'pending'
    });
    
    // Increment service submissions count
    service.meta.submissions += 1;
    await service.save();
    
    res.status(201).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: {
        uploadId: upload._id,
        files: uploadedFiles.length,
        service: service.title
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading documents',
      error: error.message
    });
  }
};

// Get uploads by service (Admin only)
export const getUploadsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { status, limit = 100, page = 1 } = req.query;
    
    const query = { serviceId };
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const uploads = await Upload.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('serviceId', 'title')
      .populate('processedBy', 'name email');
    
    const total = await Upload.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: uploads.length,
      total,
      pages: Math.ceil(total / limit),
      data: uploads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching uploads',
      error: error.message
    });
  }
};

// Update upload status (Admin only)
export const updateUploadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const upload = await Upload.findById(id);
    
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }
    
    const updates = { status };
    if (adminNotes) updates.adminNotes = adminNotes;
    
    if (status === 'completed' || status === 'rejected') {
      updates.processedBy = req.admin._id;
      updates.processedAt = new Date();
    }
    
    const updatedUpload = await Upload.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: `Upload marked as ${status}`,
      data: updatedUpload
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating upload',
      error: error.message
    });
  }
};

// Get upload statistics (Admin only)
export const getUploadStats = async (req, res) => {
  try {
    const stats = await Upload.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $group: {
          _id: {
            serviceId: '$serviceId',
            serviceName: '$service.title'
          },
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    const totalStats = await Upload.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        byService: stats,
        total: totalStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upload statistics',
      error: error.message
    });
  }
};
