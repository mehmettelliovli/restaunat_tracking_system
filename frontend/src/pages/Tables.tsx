import React, { useState, useEffect } from 'react';
import { Table } from '../types';
import api from '../services/api';

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Masalar</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              table.status === 'AVAILABLE' ? 'border-green-500' :
              table.status === 'OCCUPIED' ? 'border-red-500' :
              'border-yellow-500'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Masa {table.number}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  table.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                  table.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                {table.status === 'AVAILABLE' ? 'Müsait' :
                 table.status === 'OCCUPIED' ? 'Dolu' : 'Rezerve'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Kapasite: {table.capacity} kişi</p>
              {table.currentOrder && (
                <p>Sipariş: #{table.currentOrder}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables; 