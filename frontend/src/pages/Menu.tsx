import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import api from '../services/api';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Menü</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>
                <span className="text-lg font-bold text-blue-600">
                  ₺{item.price.toFixed(2)}
                </span>
              </div>
              
              {item.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Kategori: {item.category.name}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.isAvailable ? 'Mevcut' : 'Mevcut Değil'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu; 