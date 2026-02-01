import Offer from '../models/Offer.js';
import cloudinary from '../config/cloudinary.js';


// Get active offers
export const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      isActive: true,
      showOnPopup: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    })
    .sort({ validUntil: 1 })
    .limit(1); // Get only one for popup
    
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: error.message
    });
  }
};

// Create offer (Admin only)
export const createOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      discount,
      discountType,
      services,
      validFrom,
      validUntil,
      whatsappMessage
    } = req.body;
    
    // Handle image upload
    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'jmd-internet/offers',
        width: 800,
        height: 400,
        crop: 'fill'
      });
      
      imageData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }
    
    const offer = await Offer.create({
      title,
      description,
      image: imageData,
      discount: parseInt(discount),
      discountType,
      services: JSON.parse(services || '[]'),
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      whatsappMessage,
      createdBy: req.admin._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: error.message
    });
  }
};

// Update offer (Admin only)
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    let offer = await Offer.findById(id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image
      if (offer.image?.publicId) {
        await cloudinary.uploader.destroy(offer.image.publicId);
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'jmd-internet/offers',
        width: 800,
        height: 400,
        crop: 'fill'
      });
      
      updates.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }
    
    // Parse services if present
    if (updates.services) {
      updates.services = JSON.parse(updates.services);
    }
    
    // Parse dates
    if (updates.validFrom) updates.validFrom = new Date(updates.validFrom);
    if (updates.validUntil) updates.validUntil = new Date(updates.validUntil);
    
    offer = await Offer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating offer',
      error: error.message
    });
  }
};

// Track offer click
export const trackOfferClick = async (req, res) => {
  try {
    const { id } = req.params;
    
    const offer = await Offer.findById(id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    offer.clicks += 1;
    await offer.save();
    
    res.status(200).json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking offer click',
      error: error.message
    });
  }
};

// Get offer analytics (Admin only)
export const getOfferAnalytics = async (req, res) => {
  try {
    const analytics = await Offer.aggregate([
      {
        $match: {
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalOffers: { $sum: 1 },
          activeOffers: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$validFrom', new Date()] },
                    { $gte: ['$validUntil', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          totalClicks: { $sum: '$clicks' },
          totalConversions: { $sum: '$conversions' },
          avgClickThrough: { $avg: '$clicks' }
        }
      },
      {
        $project: {
          _id: 0,
          totalOffers: 1,
          activeOffers: 1,
          totalClicks: 1,
          totalConversions: 1,
          avgClickThrough: { $round: ['$avgClickThrough', 2] },
          conversionRate: {
            $cond: [
              { $eq: ['$totalClicks', 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ['$totalConversions', '$totalClicks'] }, 100] }, 2] }
            ]
          }
        }
      }
    ]);
    
    const popularOffers = await Offer.find({ isActive: true })
      .sort({ clicks: -1 })
      .limit(5)
      .select('title clicks conversions validUntil');
    
    res.status(200).json({
      success: true,
      data: {
        analytics: analytics[0] || {},
        popularOffers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offer analytics',
      error: error.message
    });
  }
};
