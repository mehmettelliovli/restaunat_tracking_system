import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import {
  HomeIcon,
  TableCellsIcon,
  ShoppingCartIcon,
  BookOpenIcon,
  CreditCardIcon,
  CubeIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: [UserRole.ADMIN, UserRole.WAITER, UserRole.CHEF, UserRole.CASHIER] },
    { name: 'Masalar', href: '/tables', icon: TableCellsIcon, roles: [UserRole.ADMIN, UserRole.WAITER] },
    { name: 'Siparişler', href: '/orders', icon: ShoppingCartIcon, roles: [UserRole.ADMIN, UserRole.WAITER, UserRole.CHEF] },
    { name: 'Menü', href: '/menu', icon: BookOpenIcon, roles: [UserRole.ADMIN, UserRole.WAITER, UserRole.CHEF] },
    { name: 'Ödemeler', href: '/payments', icon: CreditCardIcon, roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER] },
    { name: 'Stok', href: '/inventory', icon: CubeIcon, roles: [UserRole.ADMIN, UserRole.CHEF] },
    { name: 'Raporlar', href: '/reports', icon: ChartBarIcon, roles: [UserRole.ADMIN] },
    { name: 'Kullanıcılar', href: '/users', icon: UsersIcon, roles: [UserRole.ADMIN] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role as UserRole)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Restoran Yönetimi</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredNavigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                <span className="ml-2 text-gray-500">({user?.role})</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Çıkış
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 