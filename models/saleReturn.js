import mongoose from 'mongoose';

const saleReturnSchema = new mongoose.Schema({
  reference: {
    type: String,
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'], // Guessing based on sale.js
    default: 'Pending',
  },
  total: {
    type: Number,
    required: true,
  },
  paid: {
    type: Number,
    default: 0,
  },
  due: {
    type: Number,
  },
  payment_status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'], // Guessing
    default: 'Unpaid',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReturnItem',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const SaleReturn = mongoose.model('SaleReturn', saleReturnSchema);

export default SaleReturn;
