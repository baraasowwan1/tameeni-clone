const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all customers (admin only)
router.get('/customers', auth, async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ submittedAt: -1 })
      .select('-__v');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve customer data
router.put('/customers/:id/approve', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { 
        'pageData.status': 'approved',
        approvedAt: new Date(),
        adminNotes: req.body.adminNotes
      },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject customer data
router.put('/customers/:id/reject', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { 
        'pageData.status': 'rejected',
        rejectedAt: new Date(),
        adminNotes: req.body.adminNotes
      },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```__
