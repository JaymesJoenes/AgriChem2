import React, { useState } from 'react';
import { 
  Sprout, 
  ShoppingCart, 
  Search, 
  Calculator, 
  PhoneCall, 
  Globe, 
  Database,
  Layers,
  CheckCircle2,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenDosageCalc: () => void;
  onOpenCrm: () => void;
  onOpenTechStack: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeView: 'store' | 'checkout';
  onNavigateStore: () => void;
  onScrollToCatalog?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  cartCount,
  onOpenCart,
  onOpenDosageCalc,
  onOpenCrm,
  onOpenTechStack,
  searchQuery,
  onSearchChange,
  activeView,
  onNavigateStore,
  onScrollToCatalog,
}) => {
  const currentT = t[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 font-medium text-emerald-300 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {lang === 'uk' ? 'Оригінальні ЗЗР 2026' : 'Official 2026 Protection'}
            </span>
            <span className="hidden sm:inline text-emerald-400/60">•</span>
            <span className="hidden md:inline text-emerald-200 truncate">
              {lang === 'uk' ? 'Швидка відправка Новою Поштою по Україні' : 'Fast Nova Poshta shipping across Ukraine'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs shrink-0">
            <button 
              id="nav-tech-stack-btn"
              type="button"
              onClick={onOpenTechStack}
              className="hidden sm:flex items-center gap-1 text-emerald-200 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>{lang === 'uk' ? 'Архітектура & Стек' : 'Tech Stack'}</span>
            </button>

            <a 
              href="tel:+380800330550" 
              className="flex items-center gap-1 text-emerald-100 hover:text-white font-mono font-medium"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>0 (800) 330-550</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo (Clickable) */}
        <button 
          id="nav-logo-btn"
          type="button"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onNavigateStore();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-800 transition-colors">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-xl tracking-tight text-stone-900 font-serif">
                {currentT.storeName}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded tracking-wide uppercase">
                UA
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden md:block leading-none mt-0.5">
              {currentT.storeSubtitle}
            </p>
          </div>
        </button>

        {/* Search Bar for Large Screens */}
        {activeView === 'store' && (
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={currentT.searchPlaceholder}
                className="w-full bg-stone-100/80 border border-stone-300 focus:border-emerald-600 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Dosage Calculator Button (Desktop) */}
          <button
            id="nav-dosage-calc-btn"
            type="button"
            onClick={onOpenDosageCalc}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title={currentT.navDosageCalc}
          >
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>{currentT.navDosageCalc}</span>
          </button>

          {/* CRM / Orders Manager (Desktop) */}
          <button
            id="nav-crm-btn"
            type="button"
            onClick={onOpenCrm}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title={currentT.navCrm}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">{currentT.navCrm}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="nav-lang-toggle-btn"
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Змінити мову / Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Shopping Cart Button */}
          <button
            id="nav-cart-btn"
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{currentT.cartTitle}</span>
            {cartCount > 0 && (
              <span 
                id="cart-badge-count"
                className="bg-amber-400 text-stone-900 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="nav-mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {activeView === 'store' && (
        <div className="px-3 pb-2.5 lg:hidden">
          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={currentT.searchPlaceholder}
              className="w-full bg-stone-100 border border-stone-300 focus:border-emerald-600 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-nav-dropdown"
          className="md:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150"
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleMobileNav(() => {
                onNavigateStore();
                if (onScrollToCatalog) onScrollToCatalog();
              })}
              className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-900 font-semibold rounded-xl text-xs"
            >
              <Sprout className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{lang === 'uk' ? 'Каталог ЗЗР' : 'Product Catalog'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileNav(onOpenDosageCalc)}
              className="flex items-center gap-2 p-2.5 bg-stone-50 text-stone-800 font-semibold rounded-xl text-xs border border-stone-200"
            >
              <Calculator className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{currentT.navDosageCalc}</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileNav(onOpenCrm)}
              className="flex items-center gap-2 p-2.5 bg-stone-50 text-stone-800 font-semibold rounded-xl text-xs border border-stone-200"
            >
              <Database className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{currentT.navCrm}</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileNav(onOpenTechStack)}
              className="flex items-center gap-2 p-2.5 bg-stone-50 text-stone-800 font-semibold rounded-xl text-xs border border-stone-200"
            >
              <Layers className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{lang === 'uk' ? 'Архітектура' : 'Tech Stack'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <a
              href="tel:+380800330550"
              className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-2 rounded-lg"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>0 (800) 330-550</span>
            </a>

            <button
              type="button"
              onClick={onToggleLang}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{lang === 'uk' ? 'Мова: УКР' : 'Language: ENG'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

