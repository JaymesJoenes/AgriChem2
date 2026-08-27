import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Zap, 
  Sparkles, 
  Check, 
  Info, 
  Star 
} from 'lucide-react';
import { Product, Language } from '../types';
import { t } from '../data/translations';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onAddToCart: (product: Product, selectedPackage: { size: string; volumeLiters: number; price: number }, qty: number) => void;
  onQuickBuy: (product: Product, selectedPackage: { size: string; volumeLiters: number; price: number }) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onAddToCart,
  onQuickBuy,
  onViewDetails,
}) => {
  const currentT = t[lang];
  const [selectedPkgIndex, setSelectedPkgIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const selectedPkg = product.availablePackages[selectedPkgIndex] || product.availablePackages[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedPkg, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickBuy(product, selectedPkg);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-emerald-500/60 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Badges Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 pointer-events-none">
        {product.isBestseller && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {lang === 'uk' ? 'Хіт продажу' : 'Bestseller'}
          </span>
        )}
        <span className="bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[10px] font-semibold px-2 py-0.5 rounded-md">
          {product.brand}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={lang === 'uk' ? product.name : product.nameEn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
          <span className="bg-white/90 text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
            <Info className="w-3.5 h-3.5 text-emerald-700" />
            {lang === 'uk' ? 'Детальні характеристики' : 'View Specifications'}
          </span>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.2 rounded text-[11px]">
              {product.formulation}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {lang === 'uk' ? product.name : product.nameEn}
          </h3>

          {/* Active Ingredient */}
          <div className="mt-1 text-xs text-stone-600 bg-stone-50 border border-stone-100 rounded-md p-1.5">
            <span className="text-stone-400 block text-[10px] font-semibold uppercase tracking-wider">
              {currentT.activeIngredient}:
            </span>
            <span className="font-medium text-stone-800 line-clamp-1">
              {lang === 'uk' ? product.activeIngredient : product.activeIngredientEn} ({product.concentration})
            </span>
          </div>

          {/* Target Crops Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {(lang === 'uk' ? product.targetCrops : product.targetCropsEn).slice(0, 3).map((crop, idx) => (
              <span 
                key={idx} 
                className="bg-stone-100 text-stone-600 text-[10px] px-1.5 py-0.5 rounded font-medium"
              >
                {crop}
              </span>
            ))}
          </div>
        </div>

        {/* Packaging Selector */}
        <div className="pt-2 border-t border-stone-100">
          <span className="block text-[11px] font-semibold text-stone-500 mb-1.5">
            {currentT.packaging}:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {product.availablePackages.map((pkg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPkgIndex(idx);
                }}
                className={`px-2 py-1 text-xs rounded-md border font-medium transition-all text-center ${
                  selectedPkgIndex === idx
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500/30'
                    : 'border-stone-200 bg-stone-50/60 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {pkg.size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-2.5">
            <div>
              <span className="text-xs text-stone-400 block leading-none mb-0.5">Ціна за {selectedPkg.size}:</span>
              <span className="text-xl font-bold font-mono text-stone-900">
                {selectedPkg.price.toLocaleString('uk-UA')} ₴
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">
              ≈ {Math.round(selectedPkg.price / selectedPkg.volumeLiters).toLocaleString('uk-UA')} ₴/л
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Quick 1-Click Buy */}
            <button
              type="button"
              id={`quick-buy-${product.id}`}
              onClick={handleQuickBuy}
              className="w-full flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 px-2 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title={currentT.buyOneClick}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{currentT.buyOneClick}</span>
            </button>

            {/* Add to Cart */}
            <button
              type="button"
              id={`add-cart-${product.id}`}
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                justAdded 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'uk' ? 'Додано' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{currentT.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
