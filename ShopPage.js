import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../utils/api';
import './ShopPage.css';

const ShopPage = () => {
  const { category: genderSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    sale: searchParams.get('sale') === 'true',
    newArrival: searchParams.get('newArrival') === 'true',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      if (genderSlug && ['women', 'men', 'kids'].includes(genderSlug)) params.gender = genderSlug;
      if (filters.sale) params.sale = true;
      if (filters.newArrival) params.newArrival = true;
      const res = await getProducts(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } finally {
      setLoading(false);
    }
  }, [filters, genderSlug, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.categories));
  }, []);

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="shop-page page">
      <div className="shop-header container">
        <h1>{genderSlug ? genderSlug.charAt(0).toUpperCase() + genderSlug.slice(1) : 'All Products'}</h1>
        <span className="shop-count">{total} items</span>
      </div>

      <div className="shop-layout container">
        {/* Sidebar filters */}
        <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <h4>Search</h4>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="filter-group">
            <h4>Sort By</h4>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="form-input">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-range">
              <input type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="form-input" />
              <span>—</span>
              <input type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="form-input" />
            </div>
          </div>

          <div className="filter-group">
            <h4>Size</h4>
            <div className="size-options">
              {sizes.map(s => (
                <button key={s} className={`size-btn ${filters.size === s ? 'active' : ''}`} onClick={() => updateFilter('size', filters.size === s ? '' : s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Collections</h4>
            <label className="filter-check">
              <input type="checkbox" checked={filters.newArrival} onChange={e => updateFilter('newArrival', e.target.checked)} />
              New Arrivals
            </label>
            <label className="filter-check">
              <input type="checkbox" checked={filters.sale} onChange={e => updateFilter('sale', e.target.checked)} />
              On Sale
            </label>
          </div>

          <button className="btn btn-ghost btn-full" onClick={() => setFilters({ search: '', sort: 'newest', minPrice: '', maxPrice: '', size: '', sale: false, newArrival: false })}>
            Clear Filters
          </button>
        </aside>

        {/* Products */}
        <div className="shop-products">
          <div className="shop-toolbar">
            <button className="btn btn-ghost btn-sm filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filters
            </button>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} className={`page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
