import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  TableCellsIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Aktif Masalar',
      value: '8',
      icon: TableCellsIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Bekleyen Siparişler',
      value: '12',
      icon: ShoppingCartIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Günlük Gelir',
      value: '₺2,450',
      icon: CreditCardIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Toplam Sipariş',
      value: '45',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş geldiniz, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Restoran yönetim sistemine hoş geldiniz. Bugünkü işlemlerinizi buradan takip edebilirsiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <TableCellsIcon className="h-5 w-5 mr-2" />
            Yeni Sipariş
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Ödeme Al
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Rapor Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 