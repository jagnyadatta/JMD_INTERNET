import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Admin registration (for initial setup only)
export const adminRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    console.log('🔧 Registration attempt:', { email, name });
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('🔧 Password hash generated:', hashedPassword.substring(0, 30) + '...');
    
    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role: role || 'superadmin',
      isActive: true
    });
    
    console.log('✅ Admin created successfully:', admin._id);
    
    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

// Admin login (updated with more debugging)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin with password
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    admin.loginHistory.push({
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    await admin.save();
    
    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};


// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id)
      .select('-password -loginHistory -__v');
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password -loginHistory -__v');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.admin._id).select('+password');
    
    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    admin.password = newPassword;
    await admin.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalServices,
      activeServices,
      totalContacts,
      newContacts,
      totalUploads,
      pendingUploads,
      totalOffers,
      activeOffers
    ] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Upload.countDocuments(),
      Upload.countDocuments({ status: 'pending' }),
      Offer.countDocuments(),
      Offer.countDocuments({ 
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      })
    ]);
    
    // Recent activity
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name phone status createdAt');
    
    const recentUploads = await Upload.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('serviceId', 'title')
      .select('serviceId status createdAt');
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          services: { total: totalServices, active: activeServices },
          contacts: { total: totalContacts, new: newContacts },
          uploads: { total: totalUploads, pending: pendingUploads },
          offers: { total: totalOffers, active: activeOffers }
        },
        recentActivity: {
          contacts: recentContacts,
          uploads: recentUploads
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
