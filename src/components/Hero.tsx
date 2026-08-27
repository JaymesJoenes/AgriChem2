import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  UserCheck, 
  ArrowRight, 
  Calculator,
  Award,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';

interface HeroProps {
  lang: Language;
  onScrollToCatalog: () => void;
  onOpenDosageCalc: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onScrollToCatalog, onOpenDosageCalc }) => {
  const currentT = t[lang];

  return (
    <div className="relative bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-900 text-white overflow-hidden py-12 md:py-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'uk' ? 'Сезон захисту врожаю 2026' : 'Crop Protection Season 2026'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight text-stone-50">
              {currentT.heroTitle}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {currentT.heroDesc}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-catalog-cta-btn"
                onClick={onScrollToCatalog}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>{currentT.heroCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-calc-cta-btn"
                onClick={onOpenDosageCalc}
                className="flex items-center gap-2 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-emerald-300 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>{currentT.heroCalcCta}</span>
              </button>
            </div>

            {/* Agrarian Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800 text-stone-300 text-xs">
              <div>
                <span className="block font-bold text-lg text-emerald-400 font-mono">100%</span>
                <span>{lang === 'uk' ? 'Сертифіковано в Україні' : 'Certified in UA'}</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-emerald-400 font-mono">24-48 год</span>
                <span>{lang === 'uk' ? 'Доставка Новою Поштою' : 'Nova Poshta Shipping'}</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-emerald-400 font-mono">0 ₴</span>
                <span>{lang === 'uk' ? 'Без комісії в Monobank' : '0% Monobank Fee'}</span>
              </div>
            </div>
          </div>

          {/* Value Proposition Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-stone-800/60 backdrop-blur-xs border border-stone-700/60 p-4 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-emerald-400 flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-sm text-stone-100 mb-1">{currentT.featureOriginal}</h2>
              <p className="text-xs text-stone-400 leading-relaxed">{currentT.featureOriginalDesc}</p>
            </div>

            <div className="bg-stone-800/60 backdrop-blur-xs border border-stone-700/60 p-4 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-red-950/80 text-red-400 flex items-center justify-center mb-2.5">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-sm text-stone-100 mb-1">{currentT.featureDelivery}</h2>
              <p className="text-xs text-stone-400 leading-relaxed">{currentT.featureDeliveryDesc}</p>
            </div>

            <div className="bg-stone-800/60 backdrop-blur-xs border border-stone-700/60 p-4 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-400 flex items-center justify-center mb-2.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-sm text-stone-100 mb-1">{currentT.featurePayment}</h2>
              <p className="text-xs text-stone-400 leading-relaxed">{currentT.featurePaymentDesc}</p>
            </div>

            <div className="bg-stone-800/60 backdrop-blur-xs border border-stone-700/60 p-4 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center mb-2.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-sm text-stone-100 mb-1">{currentT.featureAgronomist}</h2>
              <p className="text-xs text-stone-400 leading-relaxed">{currentT.featureAgronomistDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
