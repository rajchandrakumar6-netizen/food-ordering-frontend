export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Category {
  id: number;
  name: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

export interface CartItem {
  id: number;
  foodItem: FoodItem;
  quantity: number;
}

export interface Cart {
  id: number;
  user: User;
  cartItems: CartItem[];
}

export interface OrderItem {
  id: number;
  foodItem: FoodItem;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  orderItems: OrderItem[];
  status: 'PLACED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
}

export interface Payment {
  id: number;
  order: Order;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paidAt: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
  fullName: string;
}