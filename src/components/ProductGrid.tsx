import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductCategory } from '../types';
import { ShoppingBag, Star, Trash2, AlertCircle, Check, X } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  title: string;
  id: string;
  category?: ProductCategory;
  isLoggedIn?: boolean;
  onDelete?: (id: string) => void;
}

export default function ProductGrid({ products, title, id, category, isLoggedIn, onDelete, onSelect }: ProductGridProps & { onSelect?: (product: Product) => void }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  const handleDeleteClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setConfirmDeleteId(productId);
  };

  const handleConfirmDelete = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(productId);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  return (
    <section id={id} className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16 px-1">
        <div className="space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-bakery-rose uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold bg-bakery-rose/10 px-3 py-1 rounded-full"
          >
            Handcrafted
          </motion.span>
          <h2 className="serif text-3xl md:text-6xl text-bakery-olive">{title}</h2>
        </div>
        <div className="h-[2px] flex-grow bg-gradient-to-r from-bakery-rose/20 via-bakery-gold/20 to-bakery-mint/20 hidden md:block mx-8 mb-4"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <AnimatePresence>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => onSelect?.(product)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-4 bg-bakery-olive/5 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-bakery-olive/40 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-bakery-rose px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>

                {isLoggedIn && onDelete && (
                  <>
                    <button 
                      onClick={(e) => handleDeleteClick(e, product.id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg z-20"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {confirmDeleteId === product.id && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-bakery-ink/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AlertCircle className="w-8 h-8 text-white mb-4 animate-pulse" />
                          <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">Are you sure you want to delete this masterpiece?</h4>
                          <div className="flex gap-4 w-full">
                            <button 
                              onClick={handleCancelDelete}
                              className="flex-1 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5 mx-auto" />
                            </button>
                            <button 
                              onClick={(e) => handleConfirmDelete(e, product.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-colors shadow-lg shadow-red-500/20"
                            >
                              <Check className="w-5 h-5 mx-auto" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {product.featured && (
                  <div className="absolute top-4 left-4 bg-bakery-flour/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-bakery-olive flex items-center gap-1 shadow-sm z-20">
                    <Star className="w-3 h-3 fill-bakery-olive" />
                    Best Seller
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 mt-auto flex justify-center md:opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white/90 backdrop-blur-md text-bakery-olive px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 border border-white">
                    <ShoppingBag className="w-3 h-3" />
                    View Details
                  </div>
                </div>
              </div>
              <div className="space-y-3 px-1">
                <div className="flex flex-col gap-1">
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-bakery-gold text-bakery-gold' : 'text-bakery-olive/20'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-bakery-olive/60 mt-0.5">{product.rating}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <h3 className="serif text-xl text-bakery-ink group-hover:text-bakery-olive transition-colors">{product.name}</h3>
                    <div className="text-right">
                      <div className="font-medium text-bakery-olive text-lg">₹{product.price}</div>
                    </div>
                  </div>
                </div>
              
              {product.availableWeights && product.availableWeights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 py-1">
                  {product.availableWeights.map((w) => (
                    <span 
                      key={w}
                      className="text-[10px] font-bold uppercase tracking-tighter bg-bakery-olive/5 text-bakery-olive px-2 py-1 rounded-md border border-bakery-olive/10"
                    >
                      {w} kg
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm text-bakery-olive/60 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
