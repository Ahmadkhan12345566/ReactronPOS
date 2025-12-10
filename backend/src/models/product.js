import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  image: {
    type: String,
  },
  slug: {
    type: String,
  },
  sellingType: {
    type: String,
    enum: ['Online', 'POS'],
  },
  productType: {
    type: String,
    enum: ['single', 'variable'],
    required: true,
  },
  taxType: {
    type: String,
    enum: ['Exclusive', 'Inclusive'],
  },
  tax: {
    type: Number,
  },
  discountType: {
    type: String,
    enum: ['Percentage', 'Fixed'],
  },
  discountValue: {
    type: Number,
  },
  warranties: {
    type: String,
  },
  barcodeSymbology: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  lockedAt: {
    type: Date,
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
