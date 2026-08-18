export enum ProductCategory {
  CAKES = 'Cakes',
  BREAD = 'Bread',
  PASTRIES = 'Pastries',
  COOKIES = 'Cookies'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  rating?: number;
  featured?: boolean;
  availableWeights?: number[]; // Added field for kg
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerPhone?: string;
  selectedWeight: number;
  totalPrice: number;
  status: 'pending' | 'completed';
  occasion: string;
  occasionDetails?: string;
  deliveryDate: string;
  timestamp: number;
}
