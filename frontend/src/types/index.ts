export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  WAITER = 'garson',
  CHEF = 'şef',
  CASHIER = 'kasiyer',
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  currentOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  CLOSED = 'closed',
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
  variations?: any;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';

export interface Order {
  id: number;
  table: Table;
  waiter: User;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  menuItem: MenuItem;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'QR_PAYMENT';

export interface Payment {
  id: number;
  order: Order;
  processedBy: User;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: number;
  ingredient: Ingredient;
  quantity: number;
  minimumQuantity: number;
  cost: number;
  unit: string;
  supplier?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface SalesReport {
  id: number;
  date: string;
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  topSellingItems: Array<{
    name: string;
    quantity: number;
  }>;
  createdAt: string;
}

export interface PerformanceReport {
  id: number;
  date: string;
  totalOrders: number;
  averagePreparationTime: number;
  customerSatisfaction: number;
  efficiency: number;
  notes?: string;
  createdAt: string;
}

export interface Ingredient {
  id: number;
  name: string;
  description?: string;
  unit: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 