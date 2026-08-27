import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem, Language } from '../types';
import { t } from '../data/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  lang,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const currentT = t[lang];

  const subtotal = items.reduce(
    (sum, item) => sum + item.selectedPackage.price * item.quantity,
    0
  );

  const freeShippingThreshold = 15000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between relative border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-base text-stone-900">{currentT.cartTitle}</h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-stone-400 hover:text-red-500 text-xs font-medium transition-colors"
                title={lang === 'uk' ? 'Очистити весь кошик' : 'Clear all'}
              >
                {lang === 'uk' ? 'Очистити' : 'Clear'}
              </button>
            )}
            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-3 bg-emerald-50/80 border-b border-emerald-100 text-xs">
          <div className="flex items-center justify-between text-emerald-950 mb-1">
            <span className="flex items-center gap-1 font-semibold">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              {progressPercent >= 100 
                ? currentT.freeShippingUnlocked 
                : (lang === 'uk' ? `Ще ${remainingForFreeShipping.toLocaleString('uk-UA')} ₴ до безкоштовної доставки` : `Add ${remainingForFreeShipping.toLocaleString('uk-UA')} ₴ for free shipping`)}
            </span>
            <span className="font-bold font-mono text-[11px]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-emerald-200/70 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">{currentT.cartEmpty}</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                {currentT.cartEmptyHint}
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedPackage.size}-${idx}`} className="pt-3 first:pt-0 flex gap-3">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0" 
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                        {lang === 'uk' ? item.product.name : item.product.nameEn}
                      </h4>
                      <span className="text-[11px] text-stone-500 block">
                        {item.selectedPackage.size} • {item.product.brand}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="text-stone-300 hover:text-red-500 transition-colors p-1"
                      title={lang === 'uk' ? 'Видалити позицію' : 'Remove'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-200"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold font-mono text-sm text-stone-900">
                        {(item.selectedPackage.price * item.quantity).toLocaleString('uk-UA')} ₴
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{currentT.subtotal}:</span>
                <span className="font-mono font-semibold text-stone-900">{subtotal.toLocaleString('uk-UA')} ₴</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{currentT.shipping}:</span>
                <span className="font-semibold text-emerald-700">
                  {progressPercent >= 100 
                    ? (lang === 'uk' ? 'Безкоштовно' : 'Free') 
                    : (lang === 'uk' ? 'За тарифами Нової Пошти' : 'Carrier rates')}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>{currentT.total}:</span>
                <span className="font-mono text-emerald-800">{subtotal.toLocaleString('uk-UA')} ₴</span>
              </div>
            </div>

            <button
              id="proceed-checkout-btn"
              type="button"
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentT.checkoutBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'uk' ? 'Безпечне замовлення • Захист покупця' : 'Secure purchase • Buyer protection'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
