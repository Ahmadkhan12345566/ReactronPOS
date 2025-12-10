import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  reference: {
    type: String,
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
  },
  payment_status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Overdue'],
  },
  total: {
    type: Number,
  },
  paid: {
    type: Number,
  },
  due: {
    type: Number,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseItem'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;