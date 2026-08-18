import { Cake, UserCircle, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  bakeryName: string;
}

export default function Header({ onLoginClick, isLoggedIn, onLogout, bakeryName }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const nameParts = bakeryName.split(' ');
  const firstPart = nameParts[0];
  const restPart = nameParts.slice(1).join(' ');

  return (
    <header className="fixed w-full z-50 bg-bakery-cream/80 backdrop-blur-md border-b border-bakery-olive/10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bakery-rose via-bakery-gold to-bakery-mint"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-bakery-rose/10 rounded-full flex items-center justify-center">
              <Cake className="w-6 h-6 text-bakery-rose" />
            </div>
            <span className="serif text-2xl font-bold tracking-tight text-bakery-olive">
              {firstPart} <span className="text-bakery-rose">{restPart}</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-bakery-olive/50">
            <a href="#" className="hover:text-bakery-rose transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-bakery-rose group-hover:w-full transition-all"></span>
            </a>
            <a href="#gallery" className="hover:text-bakery-rose transition-colors relative group">
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-bakery-rose group-hover:w-full transition-all"></span>
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-bakery-olive/40 bg-bakery-mint/10 px-3 py-1 rounded-full">Owner Active</span>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-bakery-olive/5 rounded-full transition-colors flex items-center gap-2 text-bakery-olive"
                >
                  <UserCircle className="w-7 h-7 text-bakery-rose" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Exit</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="px-6 py-2 bg-bakery-olive text-white rounded-full transition-all flex items-center gap-2 hover:bg-bakery-rose hover:scale-105 shadow-lg group"
                title="Owner Login"
              >
                <LogIn className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Login</span>
              </button>
            )}
            
            <button 
              className="md:hidden p-2 hover:bg-bakery-olive/5 rounded-full transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bakery-cream border-b border-bakery-olive/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-6 text-center">
              <a href="#" className="block text-2xl serif text-bakery-olive" onClick={() => setIsOpen(false)}>Home</a>
              <a href="#gallery" className="block text-2xl serif text-bakery-olive" onClick={() => setIsOpen(false)}>Gallery</a>
              <div className="pt-4 flex flex-col items-center gap-4">
                {isLoggedIn ? (
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-bakery-rose font-bold uppercase tracking-widest text-[10px]"
                  >
                    <UserCircle className="w-5 h-5" />
                    Logout Account
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      onLoginClick();
                      setIsOpen(false);
                    }}
                    className="w-full bg-bakery-olive text-white py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px]"
                  >
                    Owner Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
