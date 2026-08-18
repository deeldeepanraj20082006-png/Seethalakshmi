import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Image as ImageIcon, Check, Loader2, Trash2, Clock, User, Phone, Package, Calendar, PartyPopper, Settings, ShieldCheck, X, Pencil } from 'lucide-react';
import { Product, ProductCategory, Order } from '../types';

interface AdminPanelProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct?: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  products: Product[];
  orders: Order[];
  onDeleteOrder: (id: string) => void;
  bakeryName: string;
  onUpdateSettings: (settings: any) => void;
  adminUsername: string;
  adminPassword: string;
  shopPhoto: string;
}

export default function AdminPanel({ 
  onAddProduct, 
  onUpdateProduct,
  onDeleteProduct,
  products,
  orders, 
  onDeleteOrder,
  bakeryName,
  onUpdateSettings,
  adminUsername,
  adminPassword,
  shopPhoto,
}: AdminPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Local state for settings form to avoid immediate updates while typing
  const [tempSettings, setTempSettings] = useState({
    name: bakeryName,
    username: adminUsername,
    password: adminPassword,
    shopPhoto: shopPhoto
  });
  const [saveStatus, setSaveStatus] = useState<null | 'saving' | 'saved'>(null);
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState<string | null>(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ProductCategory.CAKES
  });
  const [editWeights, setEditWeights] = useState<number[]>([]);
  const [editWeightOptions, setEditWeightOptions] = useState<number[]>([0.5, 1.0, 1.5, 2.0, 2.5, 3.0]);
  const [editNewWeightInput, setEditNewWeightInput] = useState('');

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category
    });
    const weights = product.availableWeights && product.availableWeights.length > 0
      ? product.availableWeights
      : [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
    setEditWeights(weights);
    const allWeights = Array.from(new Set([...[0.5, 1.0, 1.5, 2.0, 2.5, 3.0], ...weights])).sort((a, b) => a - b);
    setEditWeightOptions(allWeights);
    setEditNewWeightInput('');
  };

  const handleEditWeightToggle = (weight: number) => {
    if (editWeights.includes(weight)) {
      setEditWeights(editWeights.filter(w => w !== weight));
    } else {
      setEditWeights([...editWeights, weight].sort((a, b) => a - b));
    }
  };

  const handleAddEditWeightOption = () => {
    const val = parseFloat(editNewWeightInput);
    if (!isNaN(val) && val > 0 && !editWeightOptions.includes(val)) {
      setEditWeightOptions([...editWeightOptions, val].sort((a, b) => a - b));
      setEditNewWeightInput('');
    }
  };

  const handleRemoveEditWeightOption = (e: React.MouseEvent, weightToRemove: number) => {
    e.stopPropagation();
    setEditWeightOptions(editWeightOptions.filter(w => w !== weightToRemove));
    setEditWeights(editWeights.filter(w => w !== weightToRemove));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !onUpdateProduct) return;
    onUpdateProduct(editingProduct.id, {
      name: editFormData.name,
      description: editFormData.description,
      price: parseFloat(editFormData.price) || 0,
      image: editFormData.image,
      category: editFormData.category,
      availableWeights: editWeights
    });
    setEditingProduct(null);
  };
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rating: '5.0',
    image: '',
    availableWeight: '1.0'
  });

  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);
  const [weightOptions, setWeightOptions] = useState<number[]>([0.5, 1.0, 1.5, 2.0, 2.5, 3.0]);
  const [newWeightInput, setNewWeightInput] = useState('');

  const handleWeightToggle = (weight: number) => {
    if (selectedWeights.includes(weight)) {
      setSelectedWeights(selectedWeights.filter(w => w !== weight));
    } else {
      setSelectedWeights([...selectedWeights, weight].sort((a, b) => a - b));
    }
  };

  const handleAddWeightOption = () => {
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 0 && !weightOptions.includes(val)) {
      setWeightOptions([...weightOptions, val].sort((a, b) => a - b));
      setNewWeightInput('');
    }
  };

  const handleRemoveWeightOption = (e: React.MouseEvent, weightToRemove: number) => {
    e.stopPropagation();
    setWeightOptions(weightOptions.filter(w => w !== weightToRemove));
    setSelectedWeights(selectedWeights.filter(w => w !== weightToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWeights.length === 0) {
      alert('Please select at least one weight option.');
      return;
    }
    setLoading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProduct: Omit<Product, 'id'> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating) || 5.0,
      availableWeights: selectedWeights,
      category: ProductCategory.CAKES,
      image: formData.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80',
      featured: true
    };

    onAddProduct(newProduct);
    setFormData({ name: '', description: '', price: '', rating: '5.0', image: '', availableWeight: '1.0' });
    setSelectedWeights([]);
    setIsAdding(false);
    setLoading(false);
  };

  return (
    <section className="py-12 md:py-20 bg-bakery-olive/5 border-y border-bakery-olive/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-16">
          
          {/* SECTION 1: GALLERY MANAGEMENT */}
          <div className="bg-bakery-flour p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-bakery-olive/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-6 border-b border-bakery-olive/10">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-rose mb-2 block">Section 01</span>
                <h2 className="serif text-4xl md:text-5xl text-bakery-olive leading-tight">Gallery <span className="text-bakery-rose italic">Management</span></h2>
                <p className="text-bakery-olive/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">Curate which cakes represent {bakeryName}</p>
              </div>
              {!isAdding && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-bakery-rose text-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-bakery-rose/20 active:scale-95 shrink-0"
                >
                  <Plus className="w-5 h-5" />
                  Add New Masterpiece
                </button>
              )}
            </div>

          {isAdding ? (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-2"
            >
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Cake Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-4 rounded-2xl focus:outline-none focus:border-bakery-olive"
                      placeholder="e.g. Midnight Chocolate Truffle"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-olive"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Rating (0-5)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        max="5"
                        required
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: e.target.value})}
                        className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-olive"
                        placeholder="5.0"
                      />
                    </div>
                    <div className="space-y-2 col-span-full">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Available Cake Sizes (Weights)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            step="0.5"
                            min="0.1"
                            placeholder="kg (e.g. 3.5)"
                            value={newWeightInput}
                            onChange={(e) => setNewWeightInput(e.target.value)}
                            className="bg-bakery-cream/50 border border-bakery-olive/20 px-3 py-1.5 rounded-xl text-xs w-28 focus:outline-none focus:border-bakery-olive"
                          />
                          <button
                            type="button"
                            onClick={handleAddWeightOption}
                            className="px-3 py-1.5 bg-bakery-olive text-white rounded-xl text-xs font-bold hover:bg-bakery-olive/90 transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Size
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {weightOptions.map(weight => (
                          <div key={weight} className="flex items-center gap-1 bg-bakery-cream/50 border border-bakery-olive/10 rounded-2xl p-1 pr-3">
                            <button
                              type="button"
                              onClick={() => handleWeightToggle(weight)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                                selectedWeights.includes(weight)
                                  ? 'bg-bakery-olive text-white shadow-sm'
                                  : 'bg-transparent text-bakery-olive/70 hover:text-bakery-olive'
                              }`}
                            >
                              {weight}kg
                            </button>
                            {weightOptions.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => handleRemoveWeightOption(e, weight)}
                                title="Remove size option"
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Asset Cover</label>
                      <label className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-5 rounded-[2rem] flex items-center justify-center cursor-pointer hover:bg-bakery-olive/5 transition-colors border-dashed">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-bakery-olive/60 truncate">
                          {formData.image ? 'Change Photo' : 'Select Photo'}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Description</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-4 rounded-2xl focus:outline-none focus:border-bakery-olive resize-none"
                      placeholder="Describe the layers, flavors, and magic..."
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="aspect-video rounded-3xl border-2 border-dashed border-bakery-olive/20 flex flex-col items-center justify-center text-bakery-olive/40 overflow-hidden relative group">
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 mb-4" />
                        <span className="text-sm font-medium tracking-wide uppercase">Preview Window</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="flex-1 border border-bakery-olive/20 text-bakery-olive py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-bakery-olive/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-3 bg-bakery-olive text-bakery-flour py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-bakery-olive/90 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Publish to Gallery
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {products.map(product => (
                <div key={product.id} className="bg-bakery-cream p-5 rounded-[2rem] border border-bakery-olive/10 shadow-sm relative group flex flex-col justify-between">
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                    <button 
                      onClick={() => handleStartEdit(product)}
                      title="Edit product & sizes"
                      className="p-2 bg-bakery-olive/10 text-bakery-olive rounded-full hover:bg-bakery-olive hover:text-white transition-all shadow-sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {confirmDeleteProductId === product.id ? (
                      <div className="flex items-center gap-2 bg-bakery-ink/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter px-2">Sure?</span>
                        <button 
                          onClick={() => setConfirmDeleteProductId(null)}
                          className="p-1.5 bg-white/10 text-white rounded-lg hover:bg-white/25 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            onDeleteProduct(product.id);
                            setConfirmDeleteProductId(null);
                          }}
                          className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteProductId(product.id)}
                        title="Delete product"
                        className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bakery-olive/5 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="pr-16">
                      <h3 className="serif text-lg text-bakery-olive leading-tight mb-1">{product.name}</h3>
                      <span className="text-xs font-bold text-bakery-rose">₹{product.price}</span>
                    </div>
                  </div>
                  <p className="text-xs text-bakery-ink/60 font-light line-clamp-2">{product.description}</p>
                </div>
              ))}
            </div>
          )}
          </div>

          {/* SECTION 2: PENDING ORDERS */}
          <div className="bg-bakery-flour p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-bakery-olive/10">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-bakery-olive/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-mint mb-2 block">Section 02</span>
                <h2 className="serif text-4xl md:text-5xl text-bakery-olive italic">Pending Orders</h2>
                <p className="text-bakery-olive/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">Manage incoming bespoke orders</p>
              </div>
              {orders.length > 0 && (
                <span className="bg-bakery-mint text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-bakery-cream/50 rounded-[2rem] border-2 border-dashed border-bakery-olive/10">
                <Package className="w-16 h-16 text-bakery-olive/20 mx-auto mb-4" />
                <p className="serif text-2xl text-bakery-olive/40 italic">No orders yet!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.sort((a,b) => b.timestamp - a.timestamp).map(order => (
                  <motion.div
                    layout
                    key={order.id}
                    className="bg-bakery-cream p-6 rounded-[2rem] border border-bakery-olive/10 shadow-sm relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {confirmDeleteOrderId === order.id ? (
                        <div className="flex items-center gap-2 bg-bakery-ink/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
                          <span className="text-[9px] font-bold text-white uppercase tracking-tighter px-2">Sure?</span>
                          <button 
                            onClick={() => setConfirmDeleteOrderId(null)}
                            className="p-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              onDeleteOrder(order.id);
                              setConfirmDeleteOrderId(null);
                            }}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmDeleteOrderId(order.id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-4 mb-6">
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-bakery-olive/5 shrink-0">
                        <img 
                          src={order.productImage} 
                          alt={order.productName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-bakery-olive/10 rounded-full flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-bakery-olive" />
                          </div>
                          <div>
                            <div className="text-[9px] text-bakery-olive/40 font-bold uppercase tracking-widest leading-none">Order Time</div>
                            <div className="text-[10px] font-bold text-bakery-olive">{new Date(order.timestamp).toLocaleTimeString()}</div>
                          </div>
                        </div>
                        <h4 className="serif text-xl text-bakery-olive leading-tight mb-1">{order.productName}</h4>
                        <span className="text-[10px] font-bold text-bakery-olive/60 uppercase tracking-widest">{order.selectedWeight}kg Selected</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2 pt-4 border-t border-bakery-olive/5">
                        <div className="flex items-center gap-2 text-sm text-bakery-ink/80">
                          <User className="w-4 h-4 text-bakery-olive/40" />
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                        {order.customerPhone && (
                          <div className="flex items-center gap-2 text-sm text-bakery-ink/80">
                            <Phone className="w-4 h-4 text-bakery-olive/40" />
                            <a href={`tel:${order.customerPhone}`} className="hover:text-bakery-olive transition-colors">{order.customerPhone}</a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-bakery-ink/80">
                          <PartyPopper className="w-4 h-4 text-bakery-olive/40" />
                          <span>{order.occasion === 'Others' ? order.occasionDetails : order.occasion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-bakery-ink/80">
                          <Calendar className="w-4 h-4 text-bakery-olive/40" />
                          <span className="font-bold text-bakery-olive">{new Date(order.deliveryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <div className="text-2xl font-bold text-bakery-olive">₹{order.totalPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: IDENTITY SETTINGS */}
          <div className="bg-bakery-flour p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-bakery-olive/10 max-w-4xl mx-auto w-full">
            <div className="text-center mb-12 pb-6 border-b border-bakery-olive/10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-gold mb-2 block">Section 03</span>
              <div className="w-16 h-16 bg-bakery-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-bakery-gold" />
              </div>
              <h2 className="serif text-4xl md:text-5xl text-bakery-olive leading-tight mb-2">Bakery <span className="text-bakery-gold italic">Identity</span></h2>
              <p className="text-bakery-olive/40 text-[10px] font-bold uppercase tracking-[0.2em]">Update your public and private access details</p>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                setSaveStatus('saving');
                await onUpdateSettings({
                  bakeryName: tempSettings.name,
                  adminUsername: tempSettings.username,
                  adminPassword: tempSettings.password,
                  shopPhoto: tempSettings.shopPhoto
                });
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus(null), 2000);
              }}
              className="space-y-8 bg-bakery-cream/30 p-6 md:p-10 rounded-[2.5rem] border border-bakery-olive/10"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40">Bakery Display Name</label>
                  <input 
                    type="text" 
                    required
                    value={tempSettings.name}
                    onChange={(e) => setTempSettings({...tempSettings, name: e.target.value})}
                    className="w-full bg-white border border-bakery-olive/10 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-gold transition-colors text-bakery-olive font-medium"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-bakery-olive/5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40">Splash Screen / Shop Photo</label>
                    <label className="bg-bakery-gold/10 text-bakery-gold px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-bakery-gold hover:text-white transition-all">
                      Change Photo
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setTempSettings({...tempSettings, shopPhoto: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="aspect-video rounded-3xl overflow-hidden bg-bakery-olive/5 border border-bakery-olive/10">
                    <img 
                      src={tempSettings.shopPhoto} 
                      alt="Shop Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-bakery-olive/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40 flex items-center gap-2">
                      <User className="w-3 h-3" /> Owner Username
                    </label>
                    <input 
                      type="text" 
                      required
                      value={tempSettings.username}
                      onChange={(e) => setTempSettings({...tempSettings, username: e.target.value})}
                      className="w-full bg-white border border-bakery-olive/10 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-gold transition-colors text-bakery-olive font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Owner Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={tempSettings.password}
                      onChange={(e) => setTempSettings({...tempSettings, password: e.target.value})}
                      className="w-full bg-white border border-bakery-olive/10 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-gold transition-colors text-bakery-olive font-medium"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={saveStatus === 'saving'}
                className={`w-full py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
                  saveStatus === 'saved' 
                    ? 'bg-bakery-mint text-white' 
                    : 'bg-bakery-gold text-white hover:scale-[1.02]'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Changes Applied Successfully
                  </>
                ) : (
                  'Save Identity Settings'
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-bakery-ink/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bakery-cream border border-bakery-olive/20 rounded-[2.5rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-bakery-olive/10">
              <h3 className="serif text-2xl text-bakery-olive">Edit Masterpiece & Sizes</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-2 text-bakery-olive/60 hover:text-bakery-olive rounded-full hover:bg-bakery-olive/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Cake Name</label>
                  <input 
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-4 rounded-2xl focus:outline-none focus:border-bakery-olive"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Price (₹)</label>
                  <input 
                    type="number"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-4 rounded-2xl focus:outline-none focus:border-bakery-olive"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value as ProductCategory})}
                    className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-4 rounded-2xl focus:outline-none focus:border-bakery-olive"
                  >
                    {Object.values(ProductCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Image URL</label>
                  <input 
                    type="url"
                    required
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({...editFormData, image: e.target.value})}
                    className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-4 rounded-2xl focus:outline-none focus:border-bakery-olive"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full bg-bakery-cream/50 border border-bakery-olive/20 p-4 rounded-2xl focus:outline-none focus:border-bakery-olive resize-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-bakery-olive/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-bakery-olive/60">Manage Cake Sizes (Weights)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      step="0.5"
                      min="0.1"
                      placeholder="kg (e.g. 3.5)"
                      value={editNewWeightInput}
                      onChange={(e) => setEditNewWeightInput(e.target.value)}
                      className="bg-bakery-cream/50 border border-bakery-olive/20 px-3 py-1.5 rounded-xl text-xs w-28 focus:outline-none focus:border-bakery-olive"
                    />
                    <button
                      type="button"
                      onClick={handleAddEditWeightOption}
                      className="px-3 py-1.5 bg-bakery-olive text-white rounded-xl text-xs font-bold hover:bg-bakery-olive/95 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Size
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {editWeightOptions.map(weight => (
                    <div key={weight} className="flex items-center gap-1 bg-bakery-cream/80 border border-bakery-olive/15 rounded-2xl p-1 pr-3">
                      <button
                        type="button"
                        onClick={() => handleEditWeightToggle(weight)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                          editWeights.includes(weight)
                            ? 'bg-bakery-olive text-white shadow-sm'
                            : 'bg-transparent text-bakery-olive/70 hover:text-bakery-olive'
                        }`}
                      >
                        {weight}kg
                      </button>
                      {editWeightOptions.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveEditWeightOption(e, weight)}
                          title="Remove size option"
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-bakery-olive/10">
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 border border-bakery-olive/20 text-bakery-olive py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-bakery-olive/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-bakery-olive text-bakery-flour py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-bakery-olive/90 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
