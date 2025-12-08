import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Upload, Eye, Settings, Lock } from 'lucide-react'

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [products, setProducts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [view, setView] = useState('products');
  
  const [formData, setFormData] = useState({
    id: '',
    name: { en: '', es: '' },
    price: '',
    image: '',
    category: 'FiveM',
    description: { en: '', es: '' },
    features: { en: ['', '', ''], es: ['', '', ''] }
  });

  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setLoginError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
  };

  useEffect(() => {
    const authState = sessionStorage.getItem('adminAuth');
    if (authState === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      const result = await window.storage.get('shop-products');
      if (result && result.value) {
        setProducts(JSON.parse(result.value));
      } else {
        const defaultProducts = getDefaultProducts();
        setProducts(defaultProducts);
        await window.storage.set('shop-products', JSON.stringify(defaultProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(getDefaultProducts());
    }
  };

  const saveProducts = async (updatedProducts) => {
    try {
      await window.storage.set('shop-products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error saving products:', error);
      alert('Failed to save products. Please try again.');
    }
  };

  const getDefaultProducts = () => [
    {
      id: 1,
      name: { en: 'Advanced Police System', es: 'Sistema de Policía Avanzado' },
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400&h=300&fit=crop',
      category: 'FiveM',
      description: {
        en: 'Complete police system with dispatch, arrests, and vehicle management',
        es: 'Sistema policial completo con despacho, arrestos y gestión de vehículos'
      },
      features: {
        en: ['Dispatch System', 'Arrest Mechanics', 'Evidence System'],
        es: ['Sistema de Despacho', 'Mecánicas de Arresto', 'Sistema de Evidencia']
      }
    }
  ];

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      id: Date.now(),
      name: { en: '', es: '' },
      price: '',
      image: '',
      category: 'FiveM',
      description: { en: '', es: '' },
      features: { en: ['', '', ''], es: ['', '', ''] }
    });
    setShowEditor(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ ...product });
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      await saveProducts(updated);
    }
  };

  const handleSave = async () => {
    if (!formData.name.en || !formData.price || !formData.image) {
      alert('Please fill in all required fields (English name, price, image)');
      return;
    }

    let updated;
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct ? formData : p);
    } else {
      updated = [...products, formData];
    }
    
    await saveProducts(updated);
    setShowEditor(false);
  };

  const updateFeature = (lang, index, value) => {
    const newFeatures = { ...formData.features };
    newFeatures[lang][index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shop-products.json';
    link.click();
  };

  const importProducts = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        await saveProducts(imported);
        alert('Products imported successfully!');
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-8 max-w-md w-full border border-purple-500">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-purple-300">Enter password to access</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Enter admin password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              {loginError && <p className="text-red-400 text-sm mt-2">{loginError}</p>}
            </div>

            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Login
            </button>

            <div className="mt-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg">
              <p className="text-yellow-300 text-xs">
                <strong>⚠️ Security Note:</strong> Default password is "admin123". 
                Please change it in the code before deploying!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-6 mb-6 border border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">📦 Shop Admin Panel</h1>
              <p className="text-purple-300">Manage your products easily</p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setView('products')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'products' ? 'bg-purple-600 text-white' : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setView('settings')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'settings' ? 'bg-purple-600 text-white' : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {view === 'products' ? (
          <>
            <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-4 mb-6 border border-purple-500 flex justify-between items-center">
              <div className="text-white">
                <span className="text-lg font-semibold">{products.length}</span> Products
              </div>
              <div className="flex gap-3">
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import JSON
                  <input type="file" accept=".json" onChange={importProducts} className="hidden" />
                </label>
                <button
                  onClick={exportProducts}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Export JSON
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500">
                  <img src={product.image} alt={product.name.en} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">{product.category}</span>
                      <span className="text-xl font-bold text-white">${product.price}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{product.name.en}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description.en}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-purple-500">
            <h2 className="text-2xl font-bold text-white mb-4">⚙️ Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">🔐 Security</h3>
                <p className="text-gray-300 text-sm mb-3">Current password: <code className="bg-purple-600 px-2 py-1 rounded">admin123</code></p>
                <div className="p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded">
                  <p className="text-yellow-300 text-xs">
                    <strong>⚠️ Important:</strong> Change the default password in the code!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowEditor(false)} className="text-white hover:text-red-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Product Name (English) *</label>
                    <input
                      type="text"
                      value={formData.name.en}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white"
                      placeholder="Advanced Police System"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Product Name (Spanish)</label>
                    <input
                      type="text"
                      value={formData.name.es}
                      onChange={(e) => setFormData({ ...formData, name: { ...formData.name, es: e.target.value } })}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white"
                      placeholder="Sistema de Policía Avanzado"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Price (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white"
                      placeholder="49.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white"
                    >
                      <option value="FiveM">FiveM</option>
                      <option value="Minecraft">Minecraft</option>
                      <option value="Roblox">Roblox</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">Image URL *</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Description (English)</label>
                    <textarea
                      value={formData.description.en}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white"
                      rows="3"
                      placeholder="Complete police system..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Description (Spanish)</label>
                    <textarea
                      value={formData.description.es}
                      onChange={(e) => setFormData({ ...formData, description: { ...formData.description, es: e.target.value } })}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white"
                      rows="3"
                      placeholder="Sistema policial completo..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Features (English)</label>
                    {[0, 1, 2].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={formData.features.en[i]}
                        onChange={(e) => updateFeature('en', i, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white mb-2"
                        placeholder={`Feature ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Features (Spanish)</label>
                    {[0, 1, 2].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={formData.features.es[i]}
                        onChange={(e) => updateFeature('es', i, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-500 text-white mb-2"
                        placeholder={`Característica ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Product
                  </button>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminPanel />
  </React.StrictMode>,
)