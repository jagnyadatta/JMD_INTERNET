// controllers/visitorController.js
import Visitor from '../models/Visitor.js';

// Increase visitor count
export const incrementVisitorCount = async (req, res) => {
  try {
    // Find the visitor document (we'll only have one)
    let visitor = await Visitor.findOne();
    
    // If no document exists, create one
    if (!visitor) {
      visitor = await Visitor.create({ count: 1 });
    } else {
      // Increment the count
      visitor.count += 1;
      await visitor.save();
    }
    
    res.status(200).json({
      success: true,
      count: visitor.count
    });
    
  } catch (error) {
    console.error('Visitor count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor count'
    });
  }
};

// Get current visitor count
export const getVisitorCount = async (req, res) => {
  try {
    // Find the visitor document
    let visitor = await Visitor.findOne();
    
    // If no document exists, create one with count 0
    if (!visitor) {
      visitor = await Visitor.create({ count: 0 });
    }
    
    res.status(200).json({
      success: true,
      count: visitor.count
    });
    
  } catch (error) {
    console.error('Get visitor count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get visitor count'
    });
  }
};

// Reset visitor count (optional, for admin)
export const resetVisitorCount = async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    
    if (!visitor) {
      visitor = await Visitor.create({ count: 0 });
    } else {
      visitor.count = 0;
      await visitor.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Visitor count reset to 0',
      count: visitor.count
    });
    
  } catch (error) {
    console.error('Reset visitor count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset visitor count'
    });
  }
};
