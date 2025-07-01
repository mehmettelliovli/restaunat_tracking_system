import React, { useState, useEffect } from 'react';
import { InventoryItem, Ingredient } from '../types';
import api from '../services/api';
import {
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newInventoryItem, setNewInventoryItem] = useState({
    ingredientId: '',
    quantity: '',
    unit: '',
    minimumQuantity: '',
    cost: '',
    supplier: '',
    expiryDate: '',
  });
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    description: '',
    unit: '',
    category: '',
  });

  useEffect(() => {
    fetchInventoryItems();
    fetchIngredients();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await api.get('/inventory/items');
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await api.get('/inventory/ingredients');
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const handleCreateInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/items', {
        ...newInventoryItem,
        quantity: parseFloat(newInventoryItem.quantity),
        minimumQuantity: parseFloat(newInventoryItem.minimumQuantity),
        cost: parseFloat(newInventoryItem.cost),
        ingredientId: parseInt(newInventoryItem.ingredientId),
      });
      setShowCreateModal(false);
      setNewInventoryItem({
        ingredientId: '',
        quantity: '',
        unit: '',
        minimumQuantity: '',
        cost: '',
        supplier: '',
        expiryDate: '',
      });
      fetchInventoryItems();
    } catch (error) {
      console.error('Error creating inventory item:', error);
    }
  };

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory/ingredients', newIngredient);
      setShowIngredientModal(false);
      setNewIngredient({
        name: '',
        description: '',
        unit: '',
        category: '',
      });
      fetchIngredients();
    } catch (error) {
      console.error('Error creating ingredient:', error);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await api.patch(`/inventory/items/${itemId}`, { quantity: newQuantity });
      fetchInventoryItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteInventoryItem = async (itemId: number) => {
    if (window.confirm('Bu stok öğesini silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/inventory/items/${itemId}`);
        fetchInventoryItems();
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const isLowStock = (item: InventoryItem) => {
    return item.quantity <= item.minimumQuantity;
  };

  const isExpired = (item: InventoryItem) => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate) < new Date();
  };

  const getCategories = () => {
    const categories = ingredients.map(ingredient => ingredient.category);
    const unique: string[] = [];
    categories.forEach(cat => {
      if (!unique.includes(cat)) unique.push(cat);
    });
    return unique;
  };

  const filteredItems = selectedCategory === 'all'
    ? inventoryItems
    : inventoryItems.filter(item => item.ingredient.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stok Yönetimi</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowIngredientModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni Malzeme
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Stok Ekle
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tümü
        </button>
        {getCategories().map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.ingredient.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.ingredient.description}</p>
                  <p className="text-sm text-gray-500">Kategori: {item.ingredient.category}</p>
                </div>
                <div className="flex space-x-1">
                  {isLowStock(item) && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" title="Düşük Stok" />
                  )}
                  {isExpired(item) && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" title="Süresi Dolmuş" />
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Miktar:</span>
                  <span className={`font-semibold ${
                    isLowStock(item) ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {item.quantity} {item.unit}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minimum:</span>
                  <span className="text-sm text-gray-700">{item.minimumQuantity} {item.unit}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Maliyet:</span>
                  <span className="text-sm text-gray-700">₺{item.cost.toFixed(2)}</span>
                </div>
                
                {item.supplier && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tedarikçi:</span>
                    <span className="text-sm text-gray-700">{item.supplier}</span>
                  </div>
                )}
                
                {item.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Son Kullanma:</span>
                    <span className={`text-sm ${
                      isExpired(item) ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {new Date(item.expiryDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    const newQuantity = prompt('Yeni miktar girin:', item.quantity.toString());
                    if (newQuantity && !isNaN(parseFloat(newQuantity))) {
                      handleUpdateQuantity(item.id, parseFloat(newQuantity));
                    }
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Miktar Güncelle
                </button>
                <button
                  onClick={() => handleDeleteInventoryItem(item.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  title="Sil"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Inventory Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Yeni Stok Öğesi</h2>
            <form onSubmit={handleCreateInventoryItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Malzeme
                </label>
                <select
                  value={newInventoryItem.ingredientId}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, ingredientId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Malzeme Seçin</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name} ({ingredient.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Miktar
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newInventoryItem.quantity}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, quantity: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birim
                </label>
                <input
                  type="text"
                  value={newInventoryItem.unit}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, unit: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Miktar
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newInventoryItem.minimumQuantity}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, minimumQuantity: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maliyet
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newInventoryItem.cost}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, cost: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tedarikçi (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={newInventoryItem.supplier}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, supplier: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Son Kullanma Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={newInventoryItem.expiryDate}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, expiryDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Ingredient Modal */}
      {showIngredientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Yeni Malzeme</h2>
            <form onSubmit={handleCreateIngredient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Malzeme Adı
                </label>
                <input
                  type="text"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={newIngredient.description}
                  onChange={(e) => setNewIngredient({ ...newIngredient, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birim
                </label>
                <input
                  type="text"
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <input
                  type="text"
                  value={newIngredient.category}
                  onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowIngredientModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory; 