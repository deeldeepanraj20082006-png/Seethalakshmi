import mongoose from 'mongoose';
import { ProductCategory } from '../types';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: Object.values(ProductCategory), required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  featured: { type: Boolean, default: false },
  availableWeights: { type: [Number], default: [] }
}, {
  toJSON: {
    transform: (_doc, ret) => {
      (ret as any).id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  selectedWeight: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  occasion: { type: String, required: true },
  occasionDetails: { type: String },
  deliveryDate: { type: String, required: true },
  timestamp: { type: Number, default: Date.now }
}, {
  toJSON: {
    transform: (_doc, ret) => {
      (ret as any).id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const settingsSchema = new mongoose.Schema({
  bakeryName: { type: String, default: 'Sweet Bliss' },
  shopPhoto: { type: String, default: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2000&auto=format&fit=crop' },
  adminUsername: { type: String, default: 'thiru' },
  adminPassword: { type: String, default: '2005' }
}, {
  toJSON: {
    transform: (_doc, ret) => {
      (ret as any).id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
