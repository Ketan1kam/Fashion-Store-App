import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../utils/api';
import './HomePage.css';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true, limit: 4 }),
      getProducts({ newArrival: true, limit: 4 }),
      getCategories()
    ]).then(([feat, newArr, cats]) => {
      setFeatured(feat.data.products);
      setNewArrivals(newArr.data.products);
      setCategories(cats.data.categories.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">New Collection 2024</span>
          <h1 className="hero-title">
            <em>Dressed</em> for<br />every moment
          </h1>
          <p className="hero-sub">Timeless silhouettes, elevated fabrics, and considered design for the modern wardrobe.</p>
          <div className="hero-ctas">
            <Link to="/shop/women" className="btn btn-primary btn-lg">Shop Women</Link>
            <Link to="/shop/men" className="btn btn-ghost btn-lg">Shop Men</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=90" alt="Fashion editorial" />
          </div>
          <div className="hero-tag">
            <span>SS 2024</span>
            <strong>The Minimal Edit</strong>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="categories-section container">
        <div className="section-header">
          <p className="eyebrow">Explore</p>
          <h2>Shop by Category</h2>
        </div>
        <div className="categories-grid">
          {[
            { label: 'Women', slug: 'women', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
            { label: 'Men', slug: 'men', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80' },
            { label: 'Accessories', slug: 'accessories', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
          ].map(cat => (
            <Link key={cat.slug} to={`/shop/${cat.slug}`} className="category-tile">
              <img src={cat.img} alt={cat.label} />
              <div className="category-overlay">
                <h3>{cat.label}</h3>
                <span>Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="products-section container">
          <div className="section-header">
            <p className="eyebrow">Curated</p>
            <h2>Featured Pieces</h2>
          </div>
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="section-cta">
            <Link to="/shop" className="btn btn-outline">View All</Link>
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="mid-banner">
        <div className="mid-banner-content">
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Limited Time</span>
          <h2>End of Season Sale</h2>
          <p>Up to 40% off select styles</p>
          <Link to="/shop?sale=true" className="btn btn-accent btn-lg">Shop Sale</Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="products-section container">
          <div className="section-header">
            <p className="eyebrow">Just In</p>
            <h2>New Arrivals</h2>
          </div>
          <div className="products-grid">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="section-cta">
            <Link to="/shop?newArrival=true" className="btn btn-outline">See All New</Link>
          </div>
        </section>
      )}

      {/* Values strip */}
      <section className="values-section container">
        {[
          { icon: '✦', title: 'Free Shipping', desc: 'On orders above ₹2,000' },
          { icon: '◈', title: 'Easy Returns', desc: '30-day return window' },
          { icon: '❋', title: 'Sustainable', desc: 'Ethically sourced fabrics' },
          { icon: '◇', title: 'Secure Payments', desc: 'SSL-encrypted checkout' },
        ].map(v => (
          <div key={v.title} className="value-item">
            <span className="value-icon">{v.icon}</span>
            <strong>{v.title}</strong>
            <p>{v.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
