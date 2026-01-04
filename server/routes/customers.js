const express = require('express');
const multer = require('multer');
const Customer = require('../models/Customer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Submit customer page data
router.post('/submit', upload.array('images', 5), async (req, res) => {
  try {
    const { name, email, phone, websiteUrl, title, content } = req.body;
    
    const customerData = {
      name,
      email,
      phone,
      websiteUrl,
      pageData: {
        title,
        content
      }
    };

    if (req.files) {
      customerData.pageData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const customer = new Customer(customerData);
    await customer.save();
    
    res.json({ 
      message: 'Data submitted successfully! Waiting for admin approval.',
      id: customer._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
