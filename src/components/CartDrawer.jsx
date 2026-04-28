import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity } = useStore();
  
  const subtotal = cart.reduce((acc, item) => acc + (parseInt(item.price.replace(/,/g, '')) * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-bg-dark border-l border-white/10 flex flex-col h-full animate-fade-in">
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" />
            <h2 className="text-xl font-bold">Your Cart ({cart.length})</h2>
          </div>
          <button onClick={onClose} className="text-text-dim hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-white/5 p-8 rounded-full mb-6">
                <ShoppingBag size={48} className="text-text-dim" />
              </div>
              <h3 className="text-xl mb-2">Cart is empty</h3>
              <p className="text-text-dim mb-8">Add some solar products to get started!</p>
              <button onClick={onClose} className="btn-primary">Browse Marketplace</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold line-clamp-1">{item.title}</h4>
                    <button onClick={() => removeFromCart(item.id)} className="text-text-dim hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-primary font-bold mb-3">₹{item.price}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-2 hover:bg-white/5"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-2 hover:bg-white/5"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-text-dim">Subtotal</span>
              <span className="font-bold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-text-dim">
              <span>Estimated Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <button className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-4">
              Proceed to Checkout <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
