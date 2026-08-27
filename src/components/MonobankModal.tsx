import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Order, Language } from '../types';

interface MonobankModalProps {
  order: Order | null;
  lang: Language;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export const MonobankModal: React.FC<MonobankModalProps> = ({
  order,
  lang,
  onClose,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'monopay' | 'apple_google' | 'card'>('monopay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Simulated Card State
  const [cardNumber, setCardNumber] = useState('4441 1144 ');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');

  if (!order) return null;

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        const updatedOrder: Order = {
          ...order,
          paymentStatus: 'paid',
          orderStatus: 'processing',
        };
        onPaymentSuccess(updatedOrder);
      }, 1200);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="monobank-payment-modal"
        className="bg-stone-900 text-stone-100 w-full max-w-lg rounded-3xl shadow-2xl border border-stone-800 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Monobank Acquiring Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-stone-950 flex items-center justify-center font-extrabold text-sm tracking-tighter">
              mono
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white tracking-tight">
                  monobank | acquire
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  API 2.0 Live
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {lang === 'uk' ? 'Безпечний платіжний шлюз для АгроХім' : 'Secure payment gateway for AgroChem'}
              </p>
            </div>
          </div>

          <button
            id="close-monobank-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="px-6 py-4 bg-stone-950/50 border-b border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 block font-mono">
              {lang === 'uk' ? 'Рахунок №' : 'Invoice #'}: {order.monobankInvoiceId || order.orderNumber}
            </span>
            <span className="text-xs text-stone-300">
              {order.customer.firstName} {order.customer.lastName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              {lang === 'uk' ? 'До сплати' : 'Amount'}
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {order.total.toLocaleString('uk-UA')} ₴
            </span>
          </div>
        </div>

        {/* Payment Methods Sub-Tabs */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-2 bg-stone-950 p-1.5 rounded-2xl border border-stone-800">
            <button
              type="button"
              id="monobank-tab-monopay"
              onClick={() => setActiveTab('monopay')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'monopay'
                  ? 'bg-stone-800 text-white shadow-sm ring-1 ring-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>MonoPay</span>
            </button>

            <button
              type="button"
              id="monobank-tab-wallets"
              onClick={() => setActiveTab('apple_google')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'apple_google'
                  ? 'bg-stone-800 text-white shadow-sm ring-1 ring-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Apple/G-Pay</span>
            </button>

            <button
              type="button"
              id="monobank-tab-card"
              onClick={() => setActiveTab('card')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-stone-800 text-white shadow-sm ring-1 ring-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'uk' ? 'Картка' : 'Card'}</span>
            </button>
          </div>

          {/* TAB 1: MONOPAY QR & Mobile App */}
          {activeTab === 'monopay' && (
            <div className="text-center space-y-4">
              <div className="bg-white p-5 rounded-2xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-lg border border-stone-700">
                {/* Visual QR Code Representation */}
                <div className="grid grid-cols-6 gap-1 w-36 h-36 p-1 bg-stone-950 rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-xs ${
                        (i % 2 === 0 || i % 7 === 0 || i === 0 || i === 5 || i === 30 || i === 35) 
                          ? 'bg-white' 
                          : 'bg-emerald-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-sm text-stone-100">
                  {lang === 'uk' ? 'Відскануйте камерою телефону або в додатку monobank' : 'Scan with your camera or open Monobank app'}
                </p>
                <p className="text-xs text-stone-400">
                  {lang === 'uk' ? 'Підтвердження оплати в 1 дотик без введення реквізитів' : '1-tap biometric confirmation without manual card entry'}
                </p>
              </div>

              <button
                type="button"
                id="monopay-simulate-pay-btn"
                onClick={handleSimulateSuccess}
                disabled={isProcessing || isDone}
                className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'uk' ? 'Очікуємо підтвердження з додатку...' : 'Awaiting app confirmation...'}</span>
                  </>
                ) : isDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>{lang === 'uk' ? 'Оплату успішно підтверджено!' : 'Payment Approved!'}</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>{lang === 'uk' ? 'Підтвердити оплату MonoPay' : 'Confirm MonoPay Payment'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: Apple Pay / Google Pay */}
          {activeTab === 'apple_google' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSimulateSuccess}
                disabled={isProcessing || isDone}
                className="w-full bg-white hover:bg-stone-200 text-stone-950 font-bold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-base font-serif font-black">Pay</span>
                <span>{lang === 'uk' ? 'Сплатити з Apple Pay' : 'Pay with Apple Pay'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateSuccess}
                disabled={isProcessing || isDone}
                className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm py-3.5 rounded-xl border border-stone-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="font-bold text-indigo-400">G</span>
                <span>{lang === 'uk' ? 'Сплатити з Google Pay' : 'Pay with Google Pay'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: Credit Card */}
          {activeTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  {lang === 'uk' ? 'Номер картки' : 'Card Number'}
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm font-mono text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    {lang === 'uk' ? 'Термін дії' : 'Expiry'}
                  </label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm font-mono text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    CVV2
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm font-mono text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateSuccess}
                disabled={isProcessing || isDone}
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'uk' ? 'Зв’язок з банком...' : 'Contacting bank...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{lang === 'uk' ? `Оплатити ${order.total.toLocaleString('uk-UA')} ₴` : `Pay ${order.total.toLocaleString('uk-UA')} ₴`}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PCI DSS Level 1 Certified • 3D-Secure 2.0 Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
