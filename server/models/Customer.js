const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  websiteUrl: String,
  pageData: {
    title: String,
    content: String,
    images: [String],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  },
  submittedAt: { type: Date, default: Date.now },
  approvedAt: Date,
  rejectedAt: Date,
  adminNotes: String
});

module.exports = mongoose.model('Customer', customerSchema);
