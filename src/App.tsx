/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import ProductDetailsModal from './components/ProductDetailsModal';
import { PRODUCTS as initialProducts } from './constants';
import { ProductCategory, Product, Order } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [bakeryName, setBakeryName] = useState('Sweet Bliss');
  const [shopPhoto, setShopPhoto] = useState('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2000&auto=format&fit=crop');
  const [showSplash, setShowSplash] = useState(true);
  const [adminUsername, setAdminUsername] = useState('thiru');
  const [adminPassword, setAdminPassword] = useState('2005');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch data from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/settings')
        ]);
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const settingsData = await settingsRes.json();
        
        setProducts(productsData);
        setOrders(ordersData);
        if (settingsData) {
          setBakeryName(settingsData.bakeryName);
          setShopPhoto(settingsData.shopPhoto);
          setAdminUsername(settingsData.adminUsername);
          setAdminPassword(settingsData.adminPassword);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Hash routing / URL synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#gallery/owner') {
        setIsLoggedIn(true);
      } else if (hash === '#gallery' || hash === '') {
        if (!window.location.hash) {
          window.location.hash = 'gallery';
        } else if (hash === '#gallery') {
          setIsLoggedIn(false);
        }
      }
    };

    const currentHash = window.location.hash;
    if (currentHash === '#gallery/owner') {
      setIsLoggedIn(true);
    } else {
      if (!currentHash) {
        window.location.hash = 'gallery';
      }
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (ok: boolean) => {
    if (ok) {
      setIsLoggedIn(true);
      window.location.hash = 'gallery/owner';
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.hash = 'gallery';
  };

  const updateSettings = async (newSettings: any) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      setBakeryName(data.bakeryName);
      setShopPhoto(data.shopPhoto);
      setAdminUsername(data.adminUsername);
      setAdminPassword(data.adminPassword);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      setProducts([data, ...products]);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      setProducts(products.map(p => p.id === id ? data : p));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const placeOrder = async (orderData: { 
    customerName: string; 
    selectedWeight: number;
    occasion: string;
    occasionDetails?: string;
    deliveryDate: string;
  }) => {
    if (!selectedProduct) return;
    
    const newOrder = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      customerName: orderData.customerName,
      selectedWeight: orderData.selectedWeight,
      totalPrice: selectedProduct.price * orderData.selectedWeight,
      status: 'pending',
      occasion: orderData.occasion,
      occasionDetails: orderData.occasionDetails,
      deliveryDate: orderData.deliveryDate,
    };
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      setOrders([data, ...orders]);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      setOrders(orders.filter(o => o.id !== id));
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bakery-cream relative overflow-hidden">
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-bakery-ink flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={shopPhoto} 
                alt="Shop Welcome" 
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="relative z-10 text-center space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="serif text-4xl md:text-8xl text-white tracking-widest px-4">{bakeryName}</h1>
                <p className="text-bakery-rose uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold pt-4">Welcome to our kitchen</p>
              </motion.div>
            </div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/20 overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 2, ease: 'linear' }}
                className="w-full h-full bg-bakery-rose"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Decorative Blobs */}
      <div className="fixed -top-[10%] -right-[5%] w-[40%] aspect-square bg-bakery-rose/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed -bottom-[10%] -left-[5%] w-[40%] aspect-square bg-bakery-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[40%] left-[20%] w-[30%] aspect-square bg-bakery-mint/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Header 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        bakeryName={bakeryName}
      />
      
      <main className="pt-20 relative z-10">
        {/* Simple Intro Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-transparent">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-bakery-rose/10 px-4 py-1.5 rounded-full"
            >
              <span className="w-2 h-2 bg-bakery-rose rounded-full animate-pulse"></span>
              <span className="text-bakery-rose uppercase tracking-[0.2em] text-[10px] font-bold">New Summer Flavors</span>
            </motion.div>
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-bakery-olive/60 uppercase tracking-[0.3em] text-xs font-bold block"
              >
                Exclusively Cakes
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="serif text-4xl md:text-8xl text-bakery-olive leading-tight"
              >
                Bespoke Cake <br />
                <span className="italic text-bakery-rose">Collection</span>
              </motion.h1>
            </div>
          </div>
        </section>

        {isLoggedIn && (
          <div id="admin-panel">
            <AdminPanel 
              onAddProduct={addProduct} 
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              products={products}
              orders={orders}
              onDeleteOrder={deleteOrder}
              bakeryName={bakeryName}
              onUpdateSettings={updateSettings}
              adminUsername={adminUsername}
              adminPassword={adminPassword}
              shopPhoto={shopPhoto}
            />
          </div>
        )}

        {/* Gallery Section */}
        <div className="relative">
          <ProductGrid 
            id="gallery" 
            title="The Masterpiece Gallery" 
            products={products} 
            category={ProductCategory.CAKES} 
            isLoggedIn={isLoggedIn}
            onDelete={deleteProduct}
            onSelect={setSelectedProduct}
          />
        </div>

        {/* Social Feed */}
        <section className="py-32 bg-bakery-rose/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-bakery-cream to-transparent opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="serif text-3xl md:text-5xl text-bakery-olive mb-4"
            >
              Follow our <span className="text-bakery-rose italic">Colorful</span> Journey
            </motion.h2>
            <p className="text-bakery-olive/60 mb-16 tracking-widest uppercase text-xs font-bold">Tag us @SweetBliss #OnlyCakes</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="aspect-square overflow-hidden rounded-3xl border-4 border-white shadow-xl group cursor-pointer"
                >
                  <img 
                    src={`https://images.unsplash.com/photo-1519340333755-50721343aa82?q=80&w=500&auto=format&fit=crop&sig=${i}`} 
                    alt="Instagram post" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-125"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        correctUsername={adminUsername}
        correctPassword={adminPassword}
      />
      <ProductDetailsModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOrder={placeOrder}
      />
    </div>
  );
}

