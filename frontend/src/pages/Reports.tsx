import React, { useState, useEffect } from 'react';
import { SalesReport, PerformanceReport } from '../types';
import api from '../services/api';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Reports: React.FC = () => {
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [performanceReports, setPerformanceReports] = useState<PerformanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedReportType, setSelectedReportType] = useState<'sales' | 'performance'>('sales');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      if (selectedReportType === 'sales') {
        const response = await api.get(`/reports/sales?period=${selectedPeriod}`);
        setSalesReports(response.data);
      } else {
        const response = await api.get(`/reports/performance?period=${selectedPeriod}`);
        setPerformanceReports(response.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      if (selectedReportType === 'sales') {
        await api.post('/reports/sales/generate', { period: selectedPeriod });
      } else {
        await api.post('/reports/performance/generate', { period: selectedPeriod });
      }
      fetchReports();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'today':
        return 'Bugün';
      case 'week':
        return 'Bu Hafta';
      case 'month':
        return 'Bu Ay';
      case 'year':
        return 'Bu Yıl';
      default:
        return period;
    }
  };

  const calculateTotalRevenue = () => {
    return salesReports.reduce((total, report) => total + report.totalRevenue, 0);
  };

  const calculateTotalOrders = () => {
    return salesReports.reduce((total, report) => total + report.totalOrders, 0);
  };

  const calculateAverageOrderValue = () => {
    const totalRevenue = calculateTotalRevenue();
    const totalOrders = calculateTotalOrders();
    return totalOrders > 0 ? totalRevenue / totalOrders : 0;
  };

  const getTopSellingItems = () => {
    const itemCounts: { [key: string]: number } = {};
    salesReports.forEach(report => {
      report.topSellingItems.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(itemCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
        <button
          onClick={generateReport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Rapor Oluştur
        </button>
      </div>

      {/* Report Type Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setSelectedReportType('sales')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            selectedReportType === 'sales'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Satış Raporları
        </button>
        <button
          onClick={() => setSelectedReportType('performance')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            selectedReportType === 'performance'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Performans Raporları
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex space-x-2">
        {['today', 'week', 'month', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedPeriod === period
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getPeriodText(period)}
          </button>
        ))}
      </div>

      {selectedReportType === 'sales' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{calculateTotalRevenue().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateTotalOrders()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{calculateAverageOrderValue().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Reports List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Satış Raporları</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {salesReports.map((report) => (
                <div key={report.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {new Date(report.date).toLocaleDateString('tr-TR')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {report.totalOrders} sipariş • {report.totalItems} ürün
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₺{report.totalRevenue.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Ortalama: ₺{(report.totalRevenue / report.totalOrders).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {report.topSellingItems.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">En Çok Satan Ürünler:</h5>
                      <div className="space-y-1">
                        {report.topSellingItems.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="text-gray-900">{item.quantity} adet</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">En Çok Satan Ürünler</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {getTopSellingItems().map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {item.quantity} adet
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ortalama Hazırlama</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performanceReports.length > 0 
                      ? `${(performanceReports.reduce((sum, report) => sum + report.averagePreparationTime, 0) / performanceReports.length).toFixed(1)} dk`
                      : '0 dk'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Müşteri Memnuniyeti</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performanceReports.length > 0 
                      ? `${(performanceReports.reduce((sum, report) => sum + report.customerSatisfaction, 0) / performanceReports.length).toFixed(1)}/5`
                      : '0/5'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verimlilik</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {performanceReports.length > 0 
                      ? `${(performanceReports.reduce((sum, report) => sum + report.efficiency, 0) / performanceReports.length).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Reports List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Performans Raporları</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {performanceReports.map((report) => (
                <div key={report.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {new Date(report.date).toLocaleDateString('tr-TR')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {report.totalOrders} sipariş işlendi
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Hazırlama Süresi</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {report.averagePreparationTime.toFixed(1)} dk
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Müşteri Memnuniyeti</p>
                      <p className="text-lg font-semibold text-green-600">
                        {report.customerSatisfaction.toFixed(1)}/5
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Verimlilik</p>
                      <p className="text-lg font-semibold text-purple-600">
                        {report.efficiency.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  {report.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">{report.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 