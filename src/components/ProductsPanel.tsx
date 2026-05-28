import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Package, Plus, Edit2, TrendingUp, Target, Star } from 'lucide-react';

export function ProductsPanel() {
  const { products, createProduct, updateProduct, financials } = useGame();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 99,
    cost: 20,
    demand: 100,
    quality: 50,
    marketingBudget: 500,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleCreate = () => {
    createProduct({
      ...newProduct,
      category: newProduct.category || 'General',
    });
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: '',
      price: 99,
      cost: 20,
      demand: 100,
      quality: 50,
      marketingBudget: 500,
    });
  };

  const handleUpdateMarketing = (id: string, budget: number) => {
    if (financials.cash >= budget) {
      updateProduct(id, { marketingBudget: budget });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Продукты</h1>
          <p className="text-slate-400">Управление продуктовой линейкой</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить продукт
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => {
          const profit = product.price - product.cost;
          const margin = (profit / product.price) * 100;
          const estimatedSales = Math.floor((product.demand * product.quality / 100) * (1 + product.marketingBudget / 5000));
          const estimatedRevenue = estimatedSales * product.price;

          return (
            <div
              key={product.id}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-violet-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product.id)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{product.category}</p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Цена</span>
                  <span className="text-white font-semibold">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Себестоимость</span>
                  <span className="text-red-400 font-semibold">{formatCurrency(product.cost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Маржа</span>
                  <span className={`font-semibold ${margin >= 50 ? 'text-green-400' : margin >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {margin.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <StatBox icon={<Target className="w-4 h-4" />} label="Спрос" value={product.demand} color="text-blue-400" />
                <StatBox icon={<Star className="w-4 h-4" />} label="Качество" value={product.quality} color="text-amber-400" />
              </div>

              {/* Marketing Budget */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Маркетинг
                  </span>
                  <span className="text-white font-semibold">{formatCurrency(product.marketingBudget)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={product.marketingBudget}
                  onChange={(e) => handleUpdateMarketing(product.id, Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              {/* Projections */}
              <div className="bg-slate-900/50 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Прогноз продаж</span>
                  <span className="text-green-400 font-semibold">{estimatedSales} шт/день</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-400 text-sm">Прогноз выручки</span>
                  <span className="text-white font-semibold">{formatCurrency(estimatedRevenue)}/день</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Новый продукт</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-slate-400 text-sm mb-2 block">Название</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Например: Премиум План"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Категория</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Software"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Цена ($)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Себестоимость ($)</label>
                <input
                  type="number"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Спрос</label>
                <input
                  type="number"
                  value={newProduct.demand}
                  onChange={(e) => setNewProduct({ ...newProduct, demand: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Качество (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newProduct.quality}
                  onChange={(e) => setNewProduct({ ...newProduct, quality: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Маркетинг ($)</label>
                <input
                  type="number"
                  value={newProduct.marketingBudget}
                  onChange={(e) => setNewProduct({ ...newProduct, marketingBudget: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleCreate}
                disabled={!newProduct.name || financials.cash < newProduct.marketingBudget}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={products.find(p => p.id === editingProduct)!}
          onClose={() => setEditingProduct(null)}
          onUpdate={updateProduct}
        />
      )}
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-3">
      <div className={`flex items-center gap-1 ${color} mb-1`}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

function EditProductModal({ product, onClose, onUpdate }: { product: any; onClose: () => void; onUpdate: (id: string, updates: any) => void }) {
  const [updates, setUpdates] = useState({
    price: product.price,
    cost: product.cost,
    quality: product.quality,
  });

  const handleSave = () => {
    onUpdate(product.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Редактировать: {product.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Цена ($)</label>
            <input
              type="number"
              value={updates.price}
              onChange={(e) => setUpdates({ ...updates, price: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Себестоимость ($)</label>
            <input
              type="number"
              value={updates.cost}
              onChange={(e) => setUpdates({ ...updates, cost: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Качество (1-100)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={updates.quality}
              onChange={(e) => setUpdates({ ...updates, quality: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
