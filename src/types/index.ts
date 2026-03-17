export type UserRole = "admin" | "user" | "moderator";
export type UserStatus = "active" | "inactive" | "pending";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type ProductCategory = "electronics" | "clothing" | "food" | "books" | "other";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  joinedAt: string;
  lastActive: string;
  revenue: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  product: string;
  category: ProductCategory;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sold: number;
  rating: number;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalUsers: number;
  usersChange: number;
  totalOrders: number;
  ordersChange: number;
  activeProducts: number;
  productsChange: number;
}

export interface Activity {
  id: string;
  type: "order" | "user" | "product" | "alert";
  message: string;
  time: string;
  userId?: string;
}

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant: "default" | "success" | "destructive" | "warning";
}
