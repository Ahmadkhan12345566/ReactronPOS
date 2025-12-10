import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema({
  purchase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
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
  discount: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const PurchaseItem = mongoose.model('PurchaseItem', purchaseItemSchema);

export default PurchaseItem;
