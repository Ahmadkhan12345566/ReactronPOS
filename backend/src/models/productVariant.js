import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema({
  sku: {
    type: String,
  },
  itemBarcode: {
    type: String,
  },
  price: {
    type: Number,
  },
  cost: {
    type: Number,
    default: 0.00,
  },
  weight: {
    type: Number,
    default: 0.00,
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed,
  },
  expiryDate: {
    type: Date,
  },
  manufacturedDate: {
    type: Date,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);

export default ProductVariant;