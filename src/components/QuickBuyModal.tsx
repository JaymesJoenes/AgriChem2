import React, { useState } from 'react';
import { X, Zap, Phone, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import { Product, Language } from '../types';
import { t } from '../data/translations';

interface QuickBuyModalProps {
  product: Product | null;
  selectedPackage: { size: string; volumeLiters: number; price: number } | null;
  lang: Language;
  onClose: () => void;
  onConfirmQuickOrder: (orderData: {
    product: Product;
    pkg: { size: string; volumeLiters: number; price: number };
    quantity: number;
    phone: string;
    name: string;
  }) => void;
}

export const QuickBuyModal: React.FC<QuickBuyModalProps> = ({
  product,
  selectedPackage,
  lang,
  onClose,
  onConfirmQuickOrder,
}) => {
  const currentT = t[lang];
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('+380 ');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!product || !selectedPackage) return null;

  const totalPrice = selectedPackage.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;

    setIsSubmitted(true);
    setTimeout(() => {
      onConfirmQuickOrder({
        product,
        pkg: selectedPackage,
        quantity,
        phone,
        name: name || (lang === 'uk' ? 'Швидкий клієнт' : 'Quick Customer'),
      });
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="quick-buy-modal"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-amber-500 text-stone-950 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-950 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">{currentT.quickBuyTitle}</h3>
              <p className="text-[11px] font-medium text-stone-900/80">
                {lang === 'uk' ? 'Швидке оформлення за 30 секунд' : 'Quick checkout in 30 seconds'}
              </p>
            </div>
          </div>
          <button
            id="close-quick-buy-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-stone-950 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Chosen Product Preview */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-stone-900 text-xs truncate">
                {lang === 'uk' ? product.name : product.nameEn}
              </h4>
              <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
                <span>{selectedPackage.size}</span>
                <span className="font-mono font-bold text-stone-900">
                  {selectedPackage.price.toLocaleString('uk-UA')} ₴
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-2 border-y border-stone-100">
            <label className="text-xs font-semibold text-stone-700">{currentT.quantity}:</label>
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-stone-600 hover:bg-stone-100 font-bold"
              >
                -
              </button>
              <span className="px-4 py-1 font-mono font-bold text-xs text-stone-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-stone-600 hover:bg-stone-100 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Customer Inputs */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {currentT.yourPhone} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="quick-buy-phone-input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380 (__) ___-__-__"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono text-stone-900 focus:bg-white focus:border-amber-500 focus:outline-none"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {currentT.yourName}
            </label>
            <input
              id="quick-buy-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'uk' ? 'Тарас Григорович' : 'John Doe'}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Total */}
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 flex items-center justify-between">
            <span className="text-xs font-medium text-stone-700">{currentT.total}:</span>
            <span className="text-lg font-bold font-mono text-stone-950">
              {totalPrice.toLocaleString('uk-UA')} ₴
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            id="submit-quick-buy-btn"
            disabled={isSubmitted}
            className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'uk' ? 'Оформлюємо...' : 'Processing...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>{currentT.confirmQuickOrder}</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-stone-500 text-center leading-tight">
            {currentT.quickBuySubtitle}
          </p>
        </form>
      </div>
    </div>
  );
};
