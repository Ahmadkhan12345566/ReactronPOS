import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  reference: {
    type: String,
  },
  date: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  payment_method: {
    type: String,
  },
  payment_status: {
    type: String,
  },
  customer_name: {
    type: String,
  },
  customer_image: {
    type: String,
  },
  product_name: {
    type: String,
  },
  product_image: {
    type: String,
  },
  category: {
    type: String,
  },
}, {
  timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
