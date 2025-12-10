import mongoose from 'mongoose';

const returnItemSchema = new mongoose.Schema({
  saleReturn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SaleReturn',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
  },
  subtotal: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const ReturnItem = mongoose.model('ReturnItem', returnItemSchema);

export default ReturnItem;
