const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, min: 1 },
    size: String,
    color: String
  }]
}, { timestamps: true });

cartSchema.methods.getTotals = function () {
  return this.items.reduce((acc, item) => {
    acc.count += item.quantity;
    return acc;
  }, { count: 0 });
};

module.exports = mongoose.model('Cart', cartSchema);
