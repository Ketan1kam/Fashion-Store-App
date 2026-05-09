import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, addReview } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import './ProductPage.css';

const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  const { addItem } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(res => {
      setProduct(res.data.product);
      setSelectedSize(res.data.product.sizes?.[0] || '');
      setSelectedColor(res.data.product.colors?.[0]?.name || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return;
    setAdding(true);
    await addItem(product._id, qty, selectedSize, selectedColor);
    setAdding(false);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, review);
      setReviewMsg('Review submitted!');
      const res = await getProduct(id);
      setProduct(res.data.product);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="loading page"><div className="spinner" /></div>;
  if (!product) return <div className="page container"><p>Product not found.</p></div>;

  const wishlisted = isWishlisted(product._id);
  const discount = product.comparePrice > product.price ? Math.round((1 - product.price / product.comparePrice) * 100) : null;

  return (
    <div className="product-page page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
        </div>

        <div className="product-detail">
          {/* Images */}
          <div className="product-gallery">
            <div className="gallery-thumbs">
              {product.images.map((img, i) => (
                <button key={i} className={`thumb ${selectedImage === i ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                  <img src={img.url} alt={img.alt} />
                </button>
              ))}
            </div>
            <div className="gallery-main">
              <img src={product.images[selectedImage]?.url || 'https://via.placeholder.com/600x800'} alt={product.name} />
              {product.isSale && discount && <span className="gallery-badge badge badge-sale">-{discount}%</span>}
              {product.isNew && <span className="gallery-badge-new badge badge-new">New</span>}
            </div>
          </div>

          {/* Info */}
          <div className="product-details">
            <p className="product-brand">{product.brand}</p>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-price">
              <span className="price-main">{fmt(product.price)}</span>
              {product.comparePrice > product.price && <span className="price-compare">{fmt(product.comparePrice)}</span>}
            </div>

            {product.rating > 0 && (
              <div className="product-detail-rating">
                <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                <span>{product.rating} ({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="divider" />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="option-group">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="color-options">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      title={c.name}
                      className={`color-swatch ${selectedColor === c.name ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setSelectedColor(c.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="option-group">
                <label>Size: <strong>{selectedSize}</strong></label>
                <div className="size-select">
                  {product.sizes.map(s => (
                    <button key={s} className={`size-chip ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="option-group">
              <label>Quantity</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <div className="product-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={adding || product.stock === 0}>
                {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                className={`wishlist-action ${wishlisted ? 'active' : ''}`}
                onClick={() => user && (wishlisted ? removeWishlist(product._id) : addWishlist(product._id))}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <p className="low-stock">Only {product.stock} left in stock</p>
            )}

            {/* Tabs */}
            <div className="product-tabs">
              {['description', 'details', 'reviews'].map(t => (
                <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === 'reviews' && ` (${product.numReviews})`}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {tab === 'description' && <p>{product.description}</p>}
              {tab === 'details' && (
                <ul className="detail-list">
                  <li><span>SKU</span><strong>{product.sku}</strong></li>
                  <li><span>Brand</span><strong>{product.brand}</strong></li>
                  <li><span>Category</span><strong>{product.category?.name}</strong></li>
                  <li><span>Gender</span><strong>{product.gender}</strong></li>
                  <li><span>Tags</span><strong>{product.tags?.join(', ') || '—'}</strong></li>
                </ul>
              )}
              {tab === 'reviews' && (
                <div className="reviews-section">
                  {product.reviews.length === 0 ? <p>No reviews yet. Be the first!</p> : (
                    product.reviews.map((r, i) => (
                      <div key={i} className="review-item">
                        <div className="review-header">
                          <strong>{r.name}</strong>
                          <span className="review-stars">{'★'.repeat(r.rating)}</span>
                        </div>
                        <p>{r.comment}</p>
                      </div>
                    ))
                  )}
                  {user && (
                    <form onSubmit={handleReview} className="review-form">
                      <h4>Write a Review</h4>
                      {reviewMsg && <div className={`alert ${reviewMsg.includes('!') ? 'alert-success' : 'alert-error'}`}>{reviewMsg}</div>}
                      <div className="form-group">
                        <label className="form-label">Rating</label>
                        <select className="form-input" value={review.rating} onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Comment</label>
                        <textarea className="form-input" rows={3} value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} required />
                      </div>
                      <button type="submit" className="btn btn-primary">Submit Review</button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
