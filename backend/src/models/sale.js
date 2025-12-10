import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  reference: {
    type: String,
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending'],
  },
  payment_status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Overdue'],
  },
  payment_method: {
    type: String,
  },
  subtotal: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  shipping: {
    type: Number,
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
  note: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
  }],
}, {
  timestamps: true,
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;
