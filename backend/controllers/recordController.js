import Record from '../models/Record.js';

// @desc    Get all records with pagination and search
// @route   GET /api/records
// @access  Private/Admin
export const getRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { number: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const total = await Record.countDocuments(searchQuery);
    const records = await Record.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single record by id
// @route   GET /api/records/:id
// @access  Private/Admin
export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new record
// @route   POST /api/records
// @access  Private/Admin
export const createRecord = async (req, res) => {
  try {
    const { name, number } = req.body;

    // Check if record with same number exists
    const existingRecord = await Record.findOne({ number });
    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'Record with this number already exists'
      });
    }

    const record = await Record.create({
      name,
      number,
      details: []
    });

    res.status(201).json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private/Admin
export const updateRecord = async (req, res) => {
  try {
    const { name, number } = req.body;
    
    // Check if number is being changed and if it already exists
    if (number) {
      const existingRecord = await Record.findOne({ 
        number, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: 'Record with this number already exists'
        });
      }
    }

    const record = await Record.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Private/Admin
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add work history to record
// @route   POST /api/records/:id/history
// @access  Private/Admin
export const addWorkHistory = async (req, res) => {
  try {
    const { service, refNo, date, followUp, remark } = req.body;

    const record = await Record.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    record.details.push({
      service,
      refNo,
      date: date || new Date(),
      followUp,
      remark
    });

    await record.save();

    res.status(201).json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update work history entry
// @route   PUT /api/records/:recordId/history/:historyId
// @access  Private/Admin
export const updateWorkHistory = async (req, res) => {
  try {
    const { service, refNo, date, followUp, remark } = req.body;

    const record = await Record.findById(req.params.recordId);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    const historyItem = record.details.id(req.params.historyId);
    
    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: 'History item not found'
      });
    }

    historyItem.service = service || historyItem.service;
    historyItem.refNo = refNo || historyItem.refNo;
    historyItem.date = date || historyItem.date;
    historyItem.followUp = followUp || historyItem.followUp;
    historyItem.remark = remark || historyItem.remark;

    await record.save();

    res.json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete work history entry
// @route   DELETE /api/records/:recordId/history/:historyId
// @access  Private/Admin
export const deleteWorkHistory = async (req, res) => {
  try {
    const record = await Record.findById(req.params.recordId);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    record.details = record.details.filter(
      item => item._id.toString() !== req.params.historyId
    );

    await record.save();

    res.json({
      success: true,
      message: 'History item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search records by name or number
// @route   GET /api/records/search/:query
// @access  Private/Admin
export const searchRecords = async (req, res) => {
  try {
    const { query } = req.params;
    
    const records = await Record.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { number: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      success: true,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};