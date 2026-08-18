import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
  correctUsername: string;
  correctPassword: string;
}

export default function LoginModal({ isOpen, onClose, onLogin, correctUsername, correctPassword }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === correctUsername && password === correctPassword) {
      onLogin(true);
      onClose();
    } else {
      setError('Invalid owner credentials');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bakery-ink/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-bakery-cream w-full max-w-md rounded-3xl p-8 shadow-2xl border border-bakery-olive/20"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-bakery-olive/5 rounded-full"
            >
              <X className="w-6 h-6 text-bakery-olive" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-bakery-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-bakery-olive" />
              </div>
              <h2 className="serif text-3xl text-bakery-olive">Owner Login</h2>
              <p className="text-sm text-bakery-olive/60 mt-2">Access your bakery dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-bakery-olive/70 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bakery-olive/40" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/50 border border-bakery-olive/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-olive transition-colors"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-bakery-olive/70 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bakery-olive/40" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/50 border border-bakery-olive/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-olive transition-colors"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs text-center font-medium uppercase tracking-wider">{error}</p>}

              <button 
                type="submit"
                className="w-full bg-bakery-olive text-bakery-flour py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:bg-bakery-olive/90 transition-all shadow-lg"
              >
                Sign In
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
