import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Phone, User, CheckCircle2, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onOrder: (orderData: { 
    customerName: string; 
    selectedWeight: number;
    occasion: string;
    occasionDetails?: string;
    deliveryDate: string;
  }) => void;
}

export default function ProductDetailsModal({ product, onClose, onOrder }: ProductDetailsModalProps) {
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [occasionDetails, setOccasionDetails] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [step, setStep] = useState<'details' | 'form' | 'success'>('details');

  if (!product) return null;

  const getPriceForWeight = (w: number | null) => {
    if (!w) return product.price;
    const found = product.weightPrices?.find(wp => wp.weight === w);
    if (found) return found.price;
    return product.price * w;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWeight) {
      onOrder({ 
        customerName, 
        selectedWeight,
        occasion,
        occasionDetails: occasion === 'Others' ? occasionDetails : undefined,
        deliveryDate
      });
      setStep('success');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bakery-ink/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-bakery-cream w-full max-w-4xl h-full md:h-auto max-h-[95vh] md:max-h-none rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[60] p-3 bg-bakery-ink/10 md:bg-white/20 backdrop-blur-md rounded-full text-bakery-ink md:text-white hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 h-56 md:h-auto relative shrink-0">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto relative">
            {step === 'details' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <span className="text-bakery-rose uppercase tracking-[0.2em] text-[10px] font-bold bg-bakery-rose/10 px-3 py-1 rounded-full">Premium Selection</span>
                <div className="flex items-center gap-3">
                  <h2 className="serif text-3xl md:text-5xl text-bakery-olive leading-tight flex-grow">{product.name}</h2>
                  <div className="flex items-center gap-1 bg-bakery-gold/10 px-3 py-1.5 rounded-2xl border border-bakery-gold/20 shrink-0">
                    <Star className="w-4 h-4 fill-bakery-gold text-bakery-gold" />
                    <span className="text-sm font-bold text-bakery-olive">{product.rating || '5.0'}</span>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl text-bakery-rose font-bold">
                  ₹{getPriceForWeight(selectedWeight).toLocaleString()} 
                  <span className="text-[10px] md:text-xs font-bold text-bakery-olive/40 uppercase tracking-widest block mt-1">
                    {selectedWeight ? `${selectedWeight}kg Selected Size Rate` : 'Select size for exact price'}
                  </span>
                </div>
                <p className="text-bakery-ink/70 leading-relaxed font-light text-base md:text-lg">{product.description}</p>
                
                <div className="space-y-4 pt-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40">Select Your Portion</label>
                  <div className="flex flex-wrap gap-3">
                    {product.availableWeights?.map(w => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${
                          selectedWeight === w
                            ? 'bg-bakery-rose text-white border-bakery-rose shadow-lg shadow-bakery-rose/20'
                            : 'bg-white text-bakery-olive border-bakery-olive/10 hover:border-bakery-rose/30 hover:text-bakery-rose'
                        }`}
                      >
                        {w} kg
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!selectedWeight}
                  onClick={() => setStep('form')}
                  className="w-full bg-bakery-olive text-white py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-bakery-rose hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-bakery-olive/10 active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Reserve This Cake
                </button>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div>
                  <button onClick={() => setStep('details')} className="text-[10px] font-bold uppercase tracking-widest text-bakery-rose hover:bg-bakery-rose/10 px-4 py-2 rounded-full transition-colors mb-6 border border-bakery-rose/20 flex items-center gap-2">
                    <span className="text-lg">←</span> Back to Details
                  </button>
                  <h2 className="serif text-4xl text-bakery-olive">Delivery <span className="text-bakery-rose italic">Information</span></h2>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40">Recipient Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-bakery-rose" />
                      <input 
                        type="text" 
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-bakery-cream/50 border border-bakery-olive/10 p-5 pl-14 rounded-[2rem] focus:outline-none focus:border-bakery-rose transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>



                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40">Celebration</label>
                      <select 
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-bakery-cream/50 border border-bakery-olive/10 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-rose text-bakery-ink appearance-none cursor-pointer"
                      >
                        <option value="Birthday">Birthday 🎂</option>
                        <option value="Wedding">Wedding 💍</option>
                        <option value="Anniversary">Anniversary ✨</option>
                        <option value="Others">Others 🎈</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40">Delivery Slot</label>
                      <input 
                        type="date" 
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-bakery-cream/50 border border-bakery-olive/10 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-rose text-bakery-ink cursor-pointer"
                      />
                    </div>
                  </div>

                  {occasion === 'Others' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-bakery-olive/40">What is the special function?</label>
                      <input 
                        type="text" 
                        required
                        value={occasionDetails}
                        onChange={(e) => setOccasionDetails(e.target.value)}
                        className="w-full bg-bakery-cream/50 border border-bakery-olive/10 p-5 rounded-[2rem] focus:outline-none focus:border-bakery-rose"
                        placeholder="e.g. Baby Shower, Graduation Gala..."
                      />
                    </motion.div>
                  )}

                  <div className="bg-bakery-olive/5 p-8 rounded-[2.5rem] border border-bakery-olive/5">
                    <div className="flex justify-between text-[11px] mb-3">
                      <span className="text-bakery-olive/40 uppercase font-bold tracking-[0.2em]">Selected Package</span>
                      <span className="font-bold text-bakery-olive bg-white px-3 py-1 rounded-full">{selectedWeight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="serif text-3xl text-bakery-olive italic">Order Total</span>
                      <span className="text-3xl font-bold text-bakery-rose">₹{getPriceForWeight(selectedWeight).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-bakery-rose text-white py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-bakery-olive hover:scale-[1.02] transition-all shadow-xl shadow-bakery-rose/20 active:scale-95"
                  >
                    Confirm Celebration
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 md:py-20 space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-bakery-rose/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-bakery-rose text-white rounded-full flex items-center justify-center mx-auto relative z-10 shadow-xl">
                    <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="serif text-3xl md:text-5xl text-bakery-olive leading-tight">Thank You, <br /><span className="text-bakery-rose italic">{customerName}!</span></h2>
                  <p className="text-bakery-ink/60 font-light max-w-xs mx-auto text-base md:text-lg">
                    Your order for the <span className="font-bold text-bakery-olive">{product.name}</span> has been confirmed. 
                  </p>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-bakery-olive/40 bg-bakery-mint/10 p-3 rounded-2xl border border-bakery-mint/20">
                    Our master baker will prepare your order with love.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-10 py-3 md:px-12 md:py-4 bg-bakery-olive text-white rounded-full font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-bakery-rose transition-all shadow-lg active:scale-95"
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
