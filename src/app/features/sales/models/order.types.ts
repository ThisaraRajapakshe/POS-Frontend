export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  orderDate: string; 
  totalAmount: number;
  status: string;
  orderItems: OrderItemDto[];
}

export interface OrderItemDto {
  productName: string;
  salesPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date; 
  totalAmount: number;
  status: OrderStatus; 
  items: OrderItem[];
  
  isOverdue?: boolean; 
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  total: number; 
}

export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}