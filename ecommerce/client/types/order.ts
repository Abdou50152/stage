export interface OrderProduct {
  id?: number;
  product_id: number;
  order_id?: number;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Order {
  id?: number;
  reference: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  fullName: string;
  phone: string;
  city: string;
  address: string;
  userId?: number | null;
  products?: OrderProduct[];
}
