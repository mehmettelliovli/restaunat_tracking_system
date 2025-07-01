import React, { useState, useEffect } from 'react';
import { Payment } from '../types';
import api from '../services/api';
import {
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Ödemeler</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ödeme #{payment.id}
                </h3>
                <p className="text-sm text-gray-600">
                  Sipariş #{payment.order.id} • Masa {payment.order.table.number}
                </p>
                <p className="text-sm text-gray-600">
                  İşlem Yapan: {payment.processedBy.firstName} {payment.processedBy.lastName}
                </p>
              </div>
              <div className="flex items-center">
                <CreditCardIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tutar:</span>
                <span className="text-lg font-bold text-green-600">
                  ₺{payment.amount.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ödeme Yöntemi:</span>
                <span className="text-sm text-gray-700">
                  {payment.paymentMethod === 'CASH' ? 'Nakit' :
                   payment.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' :
                   payment.paymentMethod === 'DEBIT_CARD' ? 'Banka Kartı' : 'Diğer'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Durum:</span>
                <span className={`text-sm font-medium ${
                  payment.status === 'COMPLETED' ? 'text-green-600' :
                  payment.status === 'PENDING' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {payment.status === 'COMPLETED' ? 'Tamamlandı' :
                   payment.status === 'PENDING' ? 'Beklemede' : 'Başarısız'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tarih:</span>
                <span className="text-sm text-gray-700">
                  {new Date(payment.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments; 