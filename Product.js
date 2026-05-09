const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: 'NOIR' },
  images: [{ url: String, alt: String }],
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] }],
  colors: [{ name: String, hex: String }],
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, unique: true },
  tags: [String],
  gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  next();
});

// Update rating on review change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; return; }
  const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.rating = (total / this.reviews.length).toFixed(1);
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
