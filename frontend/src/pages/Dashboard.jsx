import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Cake,
  DollarSign,
  Package,
  Layers,
  X,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cakes',
    stock: 10,
    imageUrl: '',
  });
  
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data.data || []);
    } catch (err) {
      showFeedback('error', 'Failed to fetch cake inventory. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type, text) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
  };

  const openAddModal = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Cakes',
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cake listing?')) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      showFeedback('success', 'Product deleted successfully!');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editProduct) {
        // Update product
        const res = await API.put(`/products/${editProduct._id}`, formData);
        setProducts(products.map((p) => (p._id === editProduct._id ? res.data.data : p)));
        showFeedback('success', 'Cake item updated successfully!');
      } else {
        // Create product
        const res = await API.post('/products', formData);
        setProducts([res.data.data, ...products]);
        showFeedback('success', 'New cake item added successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Cake Shop Inventory
            {isAdmin && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold uppercase">
                Admin Control Active
              </span>
            )}
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your bakery catalog with full CRUD operations and role restrictions.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchProducts}
            className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add New Cake
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg.text && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-medium text-sm">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cakes or flavors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-pink-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card p-5 rounded-2xl h-80 animate-pulse bg-slate-900/50"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <Cake className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No cakes found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search criteria or add a new item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="glass-card rounded-2xl overflow-hidden flex flex-col group">
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-pink-400 font-bold text-xs">
                  ${product.price}
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-slate-300 font-medium text-[11px]">
                  {product.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span>Stock: <strong className="text-slate-200">{product.stock} pcs</strong></span>
                  </div>

                  {isAdmin ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Cake"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Cake"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">View Only Mode</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Cake className="w-6 h-6 text-pink-500" />
                {editProduct ? 'Edit Cake Item' : 'Add New Cake'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Cake Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Belgian Chocolate Fudge"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe ingredients, texture, layers..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="29.99"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Cakes, Cupcakes, Pastries..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editProduct ? 'Update Cake' : 'Create Cake'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
