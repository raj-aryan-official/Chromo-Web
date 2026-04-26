import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, deleteProduct, getProducts } from '../services/adminService';
import './AdminProducts.css';

/**
 * Admin Products Component
 * Manage paint products: Add, Edit, Delete
 */
function AdminProducts({ userToken }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    type: 'Interior',
    colorHex: '#FFFFFF',
    description: '',
    tags: '',
    variants: [{ weight: '', price: '' }]
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(userToken);
      setProducts(data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = field === 'price' ? parseFloat(value) : value;
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { weight: '', price: '' }]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.name || !formData.company || formData.variants.some(v => !v.weight || !v.price)) {
        setError('Please fill in all required fields');
        return;
      }

      const productPayload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingProduct) {
        await updateProduct(userToken, editingProduct._id, productPayload);
        setSuccess('Product updated successfully!');
      } else {
        await addProduct(userToken, productPayload);
        setSuccess('Product added successfully!');
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      // Check if it's a duplicate product error (409)
      if (err.message.includes('already exists')) {
        setError(`⚠️ ${err.message}`);
      } else {
        setError(err.message || 'Failed to save product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      company: product.company,
      type: product.type,
      colorHex: product.colorHex,
      description: product.description || '',
      tags: product.tags?.join(', ') || '',
      variants: product.variants || [{ weight: '', price: '' }]
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setError('');
      await deleteProduct(userToken, productId);
      setSuccess('Product deleted successfully!');
      await fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      type: 'Interior',
      colorHex: '#FFFFFF',
      description: '',
      tags: '',
      variants: [{ weight: '', price: '' }]
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  // Derive unique companies for the filter
  const allCompanies = [...new Set(products.map(p => p.company))].filter(Boolean);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = filterCompany ? p.company === filterCompany : true;
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="admin-products">
      <div className="products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Product Management</h2>
        
        <div style={{ display: 'flex', gap: '1rem', flex: 1, paddingLeft: '2rem' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid #444',
              background: '#1a1a24',
              color: '#fff',
              flex: 1,
              maxWidth: '300px'
            }}
          />
          <select 
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid #444',
              background: '#1a1a24',
              color: '#fff'
            }}
          >
            <option value="">All Companies</option>
            {allCompanies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button 
          className="btn-add-product"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add New Product'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium Interior Paint"
              />
            </div>

            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., Asian Paints"
              />
            </div>

            <div className="form-group">
              <label>Type / Category *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="Interior">Interior</option>
                <option value="Exterior">Exterior</option>
                <option value="Primer">Primer</option>
                <option value="Painting Tools & Accessories">Painting Tools & Accessories</option>
                <option value="Primers & Wall Putty">Primers & Wall Putty</option>
                <option value="Wall Coverings">Wall Coverings</option>
                <option value="Décor & Lighting">Décor & Lighting</option>
                <option value="DIY Kits & Bundles">DIY Kits & Bundles</option>
                <option value="Specialty Paints">Specialty Paints</option>
                <option value="Adhesives & Sealants">Adhesives & Sealants</option>
                <option value="Storage & Organization">Storage & Organization</option>
              </select>
            </div>

            <div className="form-group">
              <label>Color (Hex) *</label>
              <input
                type="color"
                name="colorHex"
                value={formData.colorHex}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., premium, eco-friendly, waterproof"
              />
            </div>
          </div>

          <div className="variants-section">
            <h3>Variants (Weight & Price) *</h3>
            {formData.variants.map((variant, index) => (
              <div key={index} className="variant-row">
                <input
                  type="text"
                  placeholder="Weight (e.g., 1L, 5L, 10L)"
                  value={variant.weight}
                  onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                />
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-variant"
                    onClick={() => removeVariant(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
               type="button"
               className="btn-add-variant"
               onClick={addVariant}
            >
              + Add Variant
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="products-list">
        <h3>All Products ({filteredProducts.length})</h3>

        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found matching your criteria.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div 
                  className="product-color"
                  style={{ backgroundColor: product.colorHex }}
                />
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <p className="company">{product.company}</p>
                  <p className="type">{product.type}</p>
                  {product.variants && (
                    <div className="variants-info">
                      <strong>Variants:</strong>
                      <ul>
                        {product.variants.map((v, i) => (
                          <li key={i}>
                            {v.weight} - ₹{v.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div className="tags">
                      {product.tags.map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="product-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
