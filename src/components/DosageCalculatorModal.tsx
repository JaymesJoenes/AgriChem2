import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Sprout, 
  ShoppingCart, 
  ArrowRight, 
  Layers, 
  Sparkles,
  Info 
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product, Language } from '../types';
import { t } from '../data/translations';

interface DosageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddToCart: (product: Product, selectedPackage: { size: string; volumeLiters: number; price: number }, qty: number) => void;
}

export const DosageCalculatorModal: React.FC<DosageCalculatorModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddToCart,
}) => {
  const currentT = t[lang];
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [hectares, setHectares] = useState<number>(100);
  const [workingSolutionRate, setWorkingSolutionRate] = useState<number>(200); // 200 л/га води

  if (!isOpen) return null;

  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  const selectedPkg = selectedProduct.availablePackages[selectedProduct.availablePackages.length - 1] || selectedProduct.availablePackages[0];

  const totalChemicalLiters = hectares * selectedProduct.dosageRatePerHa;
  const canistersNeeded = Math.ceil(totalChemicalLiters / selectedPkg.volumeLiters);
  const estimatedCost = canistersNeeded * selectedPkg.price;
  const totalWaterM3 = (hectares * workingSolutionRate) / 1000;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="dosage-calculator-modal"
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg font-serif">
                {lang === 'uk' ? 'Агрономічний калькулятор норм ЗЗР' : 'Crop Chemistry Dosage Calculator'}
              </h2>
              <p className="text-xs text-emerald-100">
                {lang === 'uk' ? 'Точний розрахунок кількості каністр та витрат на гектар' : 'Calculate required canisters and cost per hectare'}
              </p>
            </div>
          </div>

          <button
            id="close-dosage-calc-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculator Form */}
        <div className="p-6 space-y-5 text-xs">
          {/* Step 1: Select Product */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5">
              {lang === 'uk' ? '1. Оберіть препарат для внесення:' : '1. Select Agro Chemical:'}
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            >
              {PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.brand}) — Норма: {p.dosageRate}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Hectares & Spraying Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {lang === 'uk' ? '2. Площа обробки (гектарів):' : '2. Field Area (hectares):'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={hectares}
                  onChange={(e) => setHectares(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold font-mono text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-stone-400 font-semibold text-xs">га</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                {lang === 'uk' ? '3. Вилив робочого розчину води:' : '3. Spray Water Volume:'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="500"
                  step="50"
                  value={workingSolutionRate}
                  onChange={(e) => setWorkingSolutionRate(Math.max(50, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold font-mono text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-stone-400 font-semibold text-xs">л/га</span>
              </div>
            </div>
          </div>

          {/* Calculation Output Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm pb-2 border-b border-emerald-200/60">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'uk' ? 'Результати розрахунку потреби:' : 'Calculation Results:'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-emerald-200/80">
                <span className="text-[11px] text-stone-500 block">{lang === 'uk' ? 'Норма на 1 га:' : 'Rate/ha:'}</span>
                <span className="font-bold font-mono text-stone-900 text-sm">{selectedProduct.dosageRatePerHa} л/га</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200/80">
                <span className="text-[11px] text-stone-500 block">{lang === 'uk' ? 'Всього препарату:' : 'Total chemical:'}</span>
                <span className="font-bold font-mono text-emerald-800 text-sm">{totalChemicalLiters.toFixed(1)} л</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200/80">
                <span className="text-[11px] text-stone-500 block">{lang === 'uk' ? 'Потрібно каністр:' : 'Canisters needed:'}</span>
                <span className="font-bold font-mono text-stone-900 text-sm">{canistersNeeded} шт ({selectedPkg.size})</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200/80">
                <span className="text-[11px] text-stone-500 block">{lang === 'uk' ? 'Об’єм води:' : 'Water volume:'}</span>
                <span className="font-bold font-mono text-stone-900 text-sm">{totalWaterM3} м³</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
              <div>
                <span className="text-stone-600 text-xs">{lang === 'uk' ? 'Орієнтовна вартість на всю площу:' : 'Total estimated cost:'}</span>
                <div className="text-2xl font-bold font-mono text-stone-950">
                  {estimatedCost.toLocaleString('uk-UA')} ₴
                </div>
              </div>

              <button
                type="button"
                id="calc-add-to-cart-btn"
                onClick={() => {
                  onAddToCart(selectedProduct, selectedPkg, canistersNeeded);
                  onClose();
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{lang === 'uk' ? `Додати ${canistersNeeded} шт в кошик` : `Add ${canistersNeeded} to cart`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
