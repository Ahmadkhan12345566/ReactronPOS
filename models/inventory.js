import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
  quantityAlert: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;