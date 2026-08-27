import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  FileText, 
  PhoneCall, 
  ArrowRight, 
  Copy, 
  Check, 
  Download,
  Building2,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, Language } from '../types';
import { t } from '../data/translations';

interface OrderSuccessModalProps {
  order: Order | null;
  lang: Language;
  onClose: () => void;
  onOpenCrm: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  lang,
  onClose,
  onOpenCrm,
}) => {
  const currentT = t[lang];
  const [copiedTTN, setCopiedTTN] = React.useState(false);

  useEffect(() => {
    if (!order) return;
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6']
      });
    } catch {
      // safe fallback
    }
  }, [order]);

  if (!order) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTTN(true);
    setTimeout(() => setCopiedTTN(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="order-success-modal"
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="bg-emerald-700 text-white p-6 text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center mx-auto text-white">
            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            {currentT.orderSuccessTitle}
          </h2>
          <p className="text-xs text-emerald-100 font-mono">
            {currentT.orderNumber}: <span className="font-bold text-white text-sm">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-5">
          {/* Nova Poshta TTN Tracking Box */}
          {order.ttnNumber && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-red-900 block">
                    {currentT.ttnGenerated}:
                  </span>
                  <span className="font-mono font-bold text-base text-stone-900">
                    {order.ttnNumber}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(order.ttnNumber!)}
                className="flex items-center gap-1.5 bg-white hover:bg-stone-50 border border-red-300 text-red-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedTTN ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'uk' ? 'Скопійовано' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-red-600" />
                    <span>{lang === 'uk' ? 'Скопіювати ТТН' : 'Copy TTN'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bank Transfer / Invoice details if chosen */}
          {order.paymentMethod === 'bank_transfer' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs text-blue-950">
              <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                <Building2 className="w-4 h-4" />
                <span>{lang === 'uk' ? 'Реквізити для оплати за безготівковим розрахунком (IBAN):' : 'Bank Transfer Details (IBAN):'}</span>
              </div>
              <div className="font-mono bg-white p-3 rounded-xl border border-blue-200 space-y-1">
                <div><strong>{lang === 'uk' ? 'Отримувач:' : 'Beneficiary:'}</strong> ТОВ «АГРОХІМ УКРАЇНА»</div>
                <div><strong>ЄДРПОУ:</strong> 42890123</div>
                <div><strong>IBAN:</strong> UA643052990000026007891234567 в АТ КБ «ПРИВАТБАНК»</div>
                <div><strong>{lang === 'uk' ? 'Призначення платежу:' : 'Payment note:'}</strong> Оплата за ЗЗР згідно зам. {order.orderNumber}, в т.ч. ПДВ 20%</div>
              </div>
            </div>
          )}

          {/* Shipping Summary */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">{lang === 'uk' ? 'Отримувач:' : 'Customer:'}</span>
              <span className="font-bold text-stone-900">{order.customer.firstName} {order.customer.lastName} ({order.customer.phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{lang === 'uk' ? 'Місто доставки:' : 'Destination:'}</span>
              <span className="font-semibold text-stone-800">{order.shipping.cityName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{lang === 'uk' ? 'Куди:' : 'Location:'}</span>
              <span className="font-semibold text-stone-800 text-right max-w-xs">
                {order.shipping.branchName || order.shipping.courierAddress?.street}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold">
              <span className="text-stone-900">{currentT.total}:</span>
              <span className="font-mono text-emerald-800">{order.total.toLocaleString('uk-UA')} ₴</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              id="success-view-crm-btn"
              onClick={() => {
                onClose();
                onOpenCrm();
              }}
              className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-stone-600" />
              <span>{lang === 'uk' ? 'Переглянути в CRM' : 'Open in CRM'}</span>
            </button>

            <button
              type="button"
              id="success-continue-btn"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <span>{currentT.continueShopping}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
