import { ProductCategory, Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Vanilla Bean Cake',
    description: 'Three layers of moist vanilla sponge with silky Madagascar vanilla buttercream.',
    price: 45,
    category: ProductCategory.CAKES,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    featured: true,
    availableWeights: [0.5, 1.0, 2.0]
  },
  {
    id: '2',
    name: 'Rich Chocolate Ganache Cake',
    description: 'Decadent dark chocolate cake layered with Belgian chocolate ganache.',
    price: 52,
    category: ProductCategory.CAKES,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    featured: true,
    availableWeights: [1.0, 1.5, 2.5]
  },
  {
    id: '5',
    name: 'Red Velvet cupcakes',
    description: 'Classic red velvet with a hint of cocoa and tangy cream cheese frosting.',
    price: 3.5,
    category: ProductCategory.CAKES,
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
    availableWeights: [0.5, 1.0]
  },
  {
    id: '7',
    name: 'Strawberry Shortcake',
    description: 'Light sponge cake with fresh strawberries and whipped cream.',
    price: 48,
    category: ProductCategory.CAKES,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000&auto=format&fit=crop',
    rating: 5.0,
    availableWeights: [1.0, 2.0, 3.0]
  },
  {
    id: '9',
    name: 'Blueberry Lemon Layer Cake',
    description: 'Zesty lemon sponge with fresh blueberries and lemon curd filling.',
    price: 50,
    category: ProductCategory.CAKES,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1000&auto=format&fit=crop',
    rating: 4.6,
    availableWeights: [1.0, 1.5]
  },
  {
    id: '10',
    name: 'Espresso Caramel Dream',
    description: 'Coffee-infused cake layers with salted caramel drizzle.',
    price: 55,
    category: ProductCategory.CAKES,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    availableWeights: [1.0, 2.0]
  }
];
