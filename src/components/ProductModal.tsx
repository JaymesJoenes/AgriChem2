import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  ShoppingCart, 
  Zap, 
  Calculator, 
  AlertTriangle, 
  Check, 
  Package, 
  FileText 
} from 'lucide-react';
import { Product, Language } from '../types';
import { t } from '../data/translations';

interface ProductModalProps {
  product: Product | null;
  lang: Language;
  onClose: () => void;
  onAddToCart: (product: Product, selectedPackage: { size: string; volumeLiters: number; price: number }, qty: number) => void;
  onQuickBuy: (product: Product, selectedPackage: { size: string; volumeLiters: number; price: number }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  lang,
  onClose,
  onAddToCart,
  onQuickBuy,
}) => {
  const currentT = t[lang];
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [hectaresCalc, setHectaresCalc] = useState<number>(50);
  const [showDosageCalc, setShowDosageCalc] = useState(false);

  if (!product) return null;

  const selectedPkg = product.availablePackages[selectedPkgIndex] || product.availablePackages[0];

  const totalVolumeLiters = hectaresCalc * product.dosageRatePerHa;
  const canistersNeeded = Math.ceil(totalVolumeLiters / selectedPkg.volumeLiters);
  const estimatedCost = canistersNeeded * selectedPkg.price;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="product-detail-modal"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image & Badges */}
          <div className="md:col-span-5 bg-stone-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div>
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-white border border-stone-200 shadow-xs mb-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span className="font-semibold">{lang === 'uk' ? 'Виробник / Бренд:' : 'Manufacturer:'}</span>
                  <span className="font-bold">{product.brand}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-100 text-stone-800">
                  <span className="font-semibold">{lang === 'uk' ? 'Клас токсичності:' : 'Hazard Class:'}</span>
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {product.safetyHazardClass} клас ВООЗ
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-stone-100 text-stone-800">
                  <span className="font-semibold">{lang === 'uk' ? 'Формуляція:' : 'Formulation:'}</span>
                  <span className="font-bold">{product.formulation}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-200 text-xs text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'uk' ? 'Оригінальний сертифікований продукт з голограмою' : 'Official certified product with hologram'}</span>
            </div>
          </div>

          {/* Right Column: Detailed Info & Interactive Buying */}
          <div className="md:col-span-7 p-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {product.category.toUpperCase()}
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                {lang === 'uk' ? product.name : product.nameEn}
              </h2>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {lang === 'uk' ? product.descriptionUk : product.descriptionEn}
              </p>
            </div>

            {/* Active Ingredient & Dosage */}
            <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs space-y-2">
              <div>
                <span className="font-semibold text-stone-500">{currentT.activeIngredient}:</span>{' '}
                <span className="font-bold text-stone-900">{product.activeIngredient} ({product.concentration})</span>
              </div>
              <div>
                <span className="font-semibold text-stone-500">{currentT.dosageRate}:</span>{' '}
                <span className="font-bold text-emerald-700">{product.dosageRate}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-500">{lang === 'uk' ? 'Цільові культури:' : 'Crops:'}</span>{' '}
                <span className="text-stone-800">{(lang === 'uk' ? product.targetCrops : product.targetCropsEn).join(', ')}</span>
              </div>
            </div>

            {/* In-Modal Field Dosage Calculator Toggle */}
            <div className="border border-emerald-200 bg-emerald-50/70 rounded-xl p-3 text-xs">
              <button
                type="button"
                onClick={() => setShowDosageCalc(!showDosageCalc)}
                className="w-full flex items-center justify-between font-semibold text-emerald-900 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'uk' ? 'Швидкий розрахунок на площу поля' : 'Field Area Requirement Calculator'}</span>
                </div>
                <span className="text-emerald-700 underline text-[11px]">
                  {showDosageCalc ? (lang === 'uk' ? 'Згорнути' : 'Hide') : (lang === 'uk' ? 'Розрахувати' : 'Calculate')}
                </span>
              </button>

              {showDosageCalc && (
                <div className="mt-3 pt-3 border-t border-emerald-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-stone-700">{lang === 'uk' ? 'Площа поля (гектарів):' : 'Field area (hectares):'}</label>
                    <input 
                      type="number"
                      min="1"
                      max="5000"
                      value={hectaresCalc}
                      onChange={(e) => setHectaresCalc(Math.max(1, Number(e.target.value)))}
                      className="w-24 px-2 py-1 bg-white border border-emerald-300 rounded font-mono font-bold text-right text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded border border-emerald-200">
                    <div>
                      <span className="text-stone-500 block">{lang === 'uk' ? 'Потрібно препарату:' : 'Volume needed:'}</span>
                      <span className="font-bold text-stone-900 font-mono text-xs">{totalVolumeLiters.toFixed(1)} л</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">{lang === 'uk' ? 'Кількість каністр:' : 'Canisters:'}</span>
                      <span className="font-bold text-emerald-700 font-mono text-xs">{canistersNeeded} шт ({selectedPkg.size})</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Packaging Choice */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                {currentT.packaging}:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.availablePackages.map((pkg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPkgIndex(idx)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      selectedPkgIndex === idx
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div>{pkg.size}</div>
                    <div className="font-mono text-stone-900 mt-0.5">{pkg.price.toLocaleString('uk-UA')} ₴</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Total Price */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">{currentT.quantity}:</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono font-bold text-xs text-stone-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 block">{currentT.subtotal}:</span>
                <span className="text-xl font-bold font-mono text-stone-900">
                  {(selectedPkg.price * quantity).toLocaleString('uk-UA')} ₴
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onQuickBuy(product, selectedPkg);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>{currentT.buyOneClick}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, selectedPkg, quantity);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{currentT.addToCart}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
