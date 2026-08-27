/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  Hero 
} from './components/Hero';
import { 
  ProductCard 
} from './components/ProductCard';
import { 
  ProductModal 
} from './components/ProductModal';
import { 
  QuickBuyModal 
} from './components/QuickBuyModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  CheckoutPage 
} from './components/CheckoutPage';
import { 
  MonobankModal 
} from './components/MonobankModal';
import { 
  OrderSuccessModal 
} from './components/OrderSuccessModal';
import { 
  CrmPanel 
} from './components/CrmPanel';
import { 
  DosageCalculatorModal 
} from './components/DosageCalculatorModal';
import { 
  TechStackGuideModal 
} from './components/TechStackGuideModal';
import { 
  Footer 
} from './components/Footer';

import { 
  Product, 
  CartItem, 
  Order, 
  Language, 
  CategoryType 
} from './types';
import { 
  PRODUCTS, 
  CATEGORIES, 
  CROPS_LIST, 
  BRANDS_LIST 
} from './data/products';
import { t } from './data/translations';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  Search, 
  Sprout,
  Calculator,
  Database,
  ShoppingCart
} from 'lucide-react';

// Initial Seed Orders for CRM Demonstration
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-seed-1',
    orderNumber: 'AG-782104',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        product: PRODUCTS[0], // Roundup Max
        selectedPackage: PRODUCTS[0].availablePackages[1], // 20L
        quantity: 5,
      },
      {
        product: PRODUCTS[7], // Trend 90
        selectedPackage: PRODUCTS[7].availablePackages[1], // 5L
        quantity: 2,
      }
    ],
    customer: {
      firstName: 'Олександр',
      lastName: 'Мельник',
      phone: '+380671234567',
      email: 'o.melnyk@niva.ua',
      isCompany: true,
      companyName: 'ФГ «Нива Поділля»',
      edrpou: '38491204',
      comment: 'Терміново перед посівом ярого ячменю',
    },
    shipping: {
      method: 'branch',
      cityRef: 'city-vinnytsia',
      cityName: 'Вінниця',
      branchRef: 'branch-vin-1',
      branchName: 'Відділення №1 (Вантажне до 1100 кг для аграріїв)',
    },
    paymentMethod: 'monobank',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    subtotal: 27950,
    shippingCost: 0,
    total: 27950,
    ttnNumber: '20450891238471',
    monobankInvoiceId: 'mono_inv_9841284a',
  },
  {
    id: 'ord-seed-2',
    orderNumber: 'AG-549102',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    items: [
      {
        product: PRODUCTS[1], // Amistar Extra
        selectedPackage: PRODUCTS[1].availablePackages[0], // 5L
        quantity: 2,
      },
    ],
    customer: {
      firstName: 'Василь',
      lastName: 'Кравчук',
      phone: '+380509876543',
      email: 'kravchuk.agro@gmail.com',
      isCompany: false,
    },
    shipping: {
      method: 'branch',
      cityRef: 'city-poltava',
      cityName: 'Полтава',
      branchRef: 'branch-pol-1',
      branchName: 'Відділення №1 (Вантажне до 1100 кг)',
    },
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'on_delivery',
    orderStatus: 'shipped',
    subtotal: 11800,
    shippingCost: 120,
    total: 12176, // with COD fee
    ttnNumber: '20450771239845',
  }
];

export default function App() {
  // Localization State
  const [lang, setLang] = useState<Language>('uk');
  const currentT = t[lang];

  // View Navigation: 'store' | 'checkout'
  const [activeView, setActiveView] = useState<'store' | 'checkout'>('store');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('agrochem_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders & CRM State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('agrochem_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Modals Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDosageCalcOpen, setIsDosageCalcOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => prev?.text === text ? null : prev);
    }, 3500);
  };

  // Selected Product for Detail Modal
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Quick Buy Modal State
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const [quickBuyPackage, setQuickBuyPackage] = useState<{ size: string; volumeLiters: number; price: number } | null>(null);

  // Monobank Payment Modal State
  const [monobankPendingOrder, setMonobankPendingOrder] = useState<Order | null>(null);

  // Order Success Modal State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Dynamic Document Title
  useEffect(() => {
    if (activeView === 'checkout') {
      document.title = lang === 'uk' 
        ? 'Оформлення замовлення | АгроХім Маркет' 
        : 'Checkout & Delivery | AgroChem Market';
    } else {
      document.title = lang === 'uk'
        ? 'АгроХім Маркет — Оригінальні ЗЗР, добрива та насіння для аграріїв України'
        : 'AgroChem Market — Genuine Crop Protection & Fertilizers in Ukraine';
    }
  }, [lang, activeView]);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrochem_cart', JSON.stringify(cartItems));
    } catch {
      // safe fallback
    }
  }, [cartItems]);

  // Save Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrochem_orders', JSON.stringify(orders));
    } catch {
      // safe fallback
    }
  }, [orders]);

  // Cart Actions
  const handleAddToCart = (
    product: Product, 
    selectedPackage: { size: string; volumeLiters: number; price: number }, 
    qty: number = 1
  ) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        it => it.product.id === product.id && it.selectedPackage.size === selectedPackage.size
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += qty;
        return copy;
      }
      return [...prev, { product, selectedPackage, quantity: qty }];
    });

    const name = lang === 'uk' ? product.name : product.nameEn;
    showToast(
      lang === 'uk' 
        ? `✅ Додано в кошик: ${name} (${selectedPackage.size} × ${qty} шт.)` 
        : `✅ Added to cart: ${name} (${selectedPackage.size} × ${qty})`,
      'success'
    );
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems(prev => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    const item = cartItems[index];
    if (item) {
      const name = lang === 'uk' ? item.product.name : item.product.nameEn;
      showToast(lang === 'uk' ? `Видалено з кошика: ${name}` : `Removed from cart: ${name}`, 'info');
    }
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast(lang === 'uk' ? 'Кошик очищено' : 'Cart cleared', 'info');
  };

  // Quick Buy Action
  const handleOpenQuickBuy = (
    product: Product, 
    pkg: { size: string; volumeLiters: number; price: number }
  ) => {
    setQuickBuyProduct(product);
    setQuickBuyPackage(pkg);
  };

  const handleConfirmQuickOrder = (orderData: {
    product: Product;
    pkg: { size: string; volumeLiters: number; price: number };
    quantity: number;
    phone: string;
    name: string;
  }) => {
    const total = orderData.pkg.price * orderData.quantity;
    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substring(2, 9),
      orderNumber: `AG-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: [
        {
          product: orderData.product,
          selectedPackage: orderData.pkg,
          quantity: orderData.quantity,
        }
      ],
      customer: {
        firstName: orderData.name,
        lastName: '(Швидке замовлення)',
        phone: orderData.phone,
        email: '',
        isCompany: false,
        comment: 'Швидке замовлення в 1 клік — передзвонити для уточнення відділення Нової Пошти',
      },
      shipping: {
        method: 'branch',
        cityRef: 'city-kyiv',
        cityName: 'Уточнюється агрономом за телефоном',
      },
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'on_delivery',
      orderStatus: 'new',
      subtotal: total,
      shippingCost: 0,
      total: total,
      ttnNumber: `20450${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setOrders(prev => [newOrder, ...prev]);
    setConfirmedOrder(newOrder);
    showToast(
      lang === 'uk' 
        ? `✅ Швидке замовлення #${newOrder.orderNumber} прийнято! Агроном зателефонує вам.` 
        : `✅ Quick order #${newOrder.orderNumber} placed! Agronomist will call you shortly.`,
      'success'
    );
  };

  // Order Placement Handlers
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setActiveView('store');
    setConfirmedOrder(newOrder);
    showToast(
      lang === 'uk' 
        ? `🎉 Замовлення #${newOrder.orderNumber} успішно оформлено!` 
        : `🎉 Order #${newOrder.orderNumber} placed successfully!`,
      'success'
    );
  };

  const handleTriggerMonobankPayment = (order: Order) => {
    setMonobankPendingOrder(order);
  };

  const handleMonobankSuccess = (paidOrder: Order) => {
    setMonobankPendingOrder(null);
    setOrders(prev => [paidOrder, ...prev]);
    setCartItems([]);
    setActiveView('store');
    setConfirmedOrder(paidOrder);
    showToast(
      lang === 'uk' 
        ? `💳 Оплату через Monobank підтверджено! Замовлення #${paidOrder.orderNumber}` 
        : `💳 Monobank payment confirmed! Order #${paidOrder.orderNumber}`,
      'success'
    );
  };

  // CRM Status Updates
  const handleUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, orderStatus: status } : ord));
    showToast(lang === 'uk' ? 'Статус замовлення оновлено в CRM' : 'Order status updated in CRM', 'info');
  };

  const handleUpdatePaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, paymentStatus: status } : ord));
    showToast(lang === 'uk' ? 'Статус оплати оновлено' : 'Payment status updated', 'info');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }
      // Crop filter
      if (selectedCrop !== 'all') {
        const crops = lang === 'uk' ? product.targetCrops : product.targetCropsEn;
        if (!crops.some(c => c.toLowerCase().includes(selectedCrop.toLowerCase()))) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q) || product.nameEn.toLowerCase().includes(q);
        const matchesIngr = product.activeIngredient.toLowerCase().includes(q) || product.activeIngredientEn.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCrops = product.targetCrops.some(c => c.toLowerCase().includes(q));
        if (!matchesName && !matchesIngr && !matchesBrand && !matchesCrops) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [selectedCategory, selectedBrand, selectedCrop, searchQuery, sortBy, lang]);

  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.isFeatured);
  }, []);

  const totalCartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  const scrollToCatalog = (category?: CategoryType) => {
    if (category) {
      setSelectedCategory(category);
    }
    if (activeView !== 'store') {
      setActiveView('store');
    }
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 font-sans text-stone-900 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900 pb-16 md:pb-0 overflow-x-hidden">
      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div 
          id="global-toast-alert"
          className="fixed top-16 sm:top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 ${
            toastMessage.type === 'error'
              ? 'bg-rose-900/95 text-rose-100 border-rose-700'
              : toastMessage.type === 'info'
              ? 'bg-stone-900/95 text-stone-100 border-stone-700'
              : 'bg-emerald-900/95 text-emerald-50 border-emerald-700'
          }`}>
            <span className="text-sm font-medium leading-tight flex-1">
              {toastMessage.text}
            </span>
            <button 
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-stone-300 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={() => setLang(prev => prev === 'uk' ? 'en' : 'uk')}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenDosageCalc={() => setIsDosageCalcOpen(true)}
        onOpenCrm={() => setIsCrmOpen(true)}
        onOpenTechStack={() => setIsTechStackOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onNavigateStore={() => setActiveView('store')}
        onScrollToCatalog={() => scrollToCatalog()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'checkout' ? (
          <CheckoutPage
            items={cartItems}
            lang={lang}
            onBackToStore={() => setActiveView('store')}
            onPlaceOrder={handlePlaceOrder}
            onTriggerMonobankPayment={handleTriggerMonobankPayment}
          />
        ) : (
          <div>
            {/* Landing Hero */}
            <Hero
              lang={lang}
              onScrollToCatalog={scrollToCatalog}
              onOpenDosageCalc={() => setIsDosageCalcOpen(true)}
            />

            {/* Featured Products Carousel / Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      {lang === 'uk' ? 'Рекомендації агронома' : 'Agronomist Picks'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-0.5">
                    {currentT.featuredProducts}
                  </h2>
                </div>

                <button
                  type="button"
                  id="view-all-featured-btn"
                  onClick={scrollToCatalog}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
                >
                  {lang === 'uk' ? 'Дивитись весь каталог →' : 'View Full Catalog →'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredProducts.slice(0, 4).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    onAddToCart={handleAddToCart}
                    onQuickBuy={(p, pkg) => handleOpenQuickBuy(p, pkg)}
                    onViewDetails={setDetailProduct}
                  />
                ))}
              </div>
            </section>

            {/* Full Catalog Section */}
            <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-200">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {lang === 'uk' ? 'Каталог ЗЗР' : 'Product Directory'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
                    {currentT.allProductsTitle}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {lang === 'uk' 
                      ? 'Знайдено ' + filteredProducts.length + ' сертифікованих препаратів' 
                      : 'Found ' + filteredProducts.length + ' certified products'}
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">{currentT.sortBy}:</span>
                  <select
                    id="catalog-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
                  >
                    <option value="popular">{currentT.sortPopular}</option>
                    <option value="price_asc">{currentT.sortPriceAsc}</option>
                    <option value="price_desc">{currentT.sortPriceDesc}</option>
                    <option value="rating">{currentT.sortRating}</option>
                  </select>
                </div>
              </div>

              {/* Category Pills Strip */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    id={`filter-cat-${cat.id}`}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as CategoryType)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {lang === 'uk' ? cat.nameUk : cat.nameEn}
                    <span className="ml-1.5 opacity-70 text-[10px]">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Sub-Filters: Crop & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-stone-200 mb-8 shadow-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                    {currentT.filterCrop}:
                  </label>
                  <select
                    id="filter-crop-select"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="all">{lang === 'uk' ? 'Всі с/г культури' : 'All Crops'}</option>
                    {CROPS_LIST.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                    {currentT.filterBrand}:
                  </label>
                  <select
                    id="filter-brand-select"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
                  >
                    <option value="all">{lang === 'uk' ? 'Всі виробники' : 'All Brands'}</option>
                    {BRANDS_LIST.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  {(selectedCategory !== 'all' || selectedBrand !== 'all' || selectedCrop !== 'all' || searchQuery) && (
                    <button
                      type="button"
                      id="reset-filters-btn"
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedBrand('all');
                        setSelectedCrop('all');
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:text-red-600 font-semibold underline underline-offset-2"
                    >
                      {lang === 'uk' ? 'Скинути всі фільтри' : 'Reset all filters'}
                    </button>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-stone-800 text-base">
                    {lang === 'uk' ? 'Препаратів за вашим запитом не знайдено' : 'No products match your search criteria'}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {lang === 'uk' 
                      ? 'Спробуйте змінити фільтри культур або зателефонуйте нашому черговому агроному для індивідуального підбору.' 
                      : 'Try changing category or crop filters or call our agronomist for customized recommendations.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setSelectedCrop('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    {lang === 'uk' ? 'Показати всі препарати' : 'Show all products'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      lang={lang}
                      onAddToCart={handleAddToCart}
                      onQuickBuy={(p, pkg) => handleOpenQuickBuy(p, pkg)}
                      onViewDetails={setDetailProduct}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Agronomic Consultation Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/50">
                <div className="space-y-2 text-center md:text-left">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    {lang === 'uk' ? 'Безкоштовна консультація' : 'Free Agronomic Support'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif">
                    {lang === 'uk' ? 'Потрібна допомога у підборі бакової суміші?' : 'Need assistance formulating your tank mix?'}
                  </h3>
                  <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                    {lang === 'uk' 
                      ? 'Наші фахівці-агрономи допоможуть розрахувати норми внесення під ваш тип ґрунту, культуру та погодні умови з безкоштовною доставкою Новою Поштою.' 
                      : 'Our certified agronomists calculate optimal rates tailored to your soil, crop and climate conditions.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+380800330550"
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>0 (800) 330-550</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsDosageCalcOpen(true)}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Sprout className="w-4 h-4 text-emerald-300" />
                    <span>{currentT.navDosageCalc}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        lang={lang}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setActiveView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductModal
          product={detailProduct}
          lang={lang}
          onClose={() => setDetailProduct(null)}
          onAddToCart={handleAddToCart}
          onQuickBuy={(p, pkg) => {
            setDetailProduct(null);
            handleOpenQuickBuy(p, pkg);
          }}
        />
      )}

      {/* Quick Buy 1-Click Modal */}
      {quickBuyProduct && quickBuyPackage && (
        <QuickBuyModal
          product={quickBuyProduct}
          selectedPackage={quickBuyPackage}
          lang={lang}
          onClose={() => {
            setQuickBuyProduct(null);
            setQuickBuyPackage(null);
          }}
          onConfirmQuickOrder={handleConfirmQuickOrder}
        />
      )}

      {/* Monobank Payment Modal */}
      {monobankPendingOrder && (
        <MonobankModal
          order={monobankPendingOrder}
          lang={lang}
          onClose={() => setMonobankPendingOrder(null)}
          onPaymentSuccess={handleMonobankSuccess}
        />
      )}

      {/* Order Success Modal */}
      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          lang={lang}
          onClose={() => setConfirmedOrder(null)}
          onOpenCrm={() => setIsCrmOpen(true)}
        />
      )}

      {/* CRM & Sales Management Panel */}
      {isCrmOpen && (
        <CrmPanel
          isOpen={isCrmOpen}
          onClose={() => setIsCrmOpen(false)}
          orders={orders}
          lang={lang}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
        />
      )}

      {/* Agronomic Dosage Calculator Modal */}
      {isDosageCalcOpen && (
        <DosageCalculatorModal
          isOpen={isDosageCalcOpen}
          onClose={() => setIsDosageCalcOpen(false)}
          lang={lang}
          onAddToCart={(p, pkg, qty) => {
            handleAddToCart(p, pkg, qty);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Tech Stack & Architecture Guide Modal */}
      {isTechStackOpen && (
        <TechStackGuideModal
          isOpen={isTechStackOpen}
          onClose={() => setIsTechStackOpen(false)}
          lang={lang}
        />
      )}

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenDosageCalc={() => setIsDosageCalcOpen(true)}
        onOpenTechStack={() => setIsTechStackOpen(true)}
        onOpenCrm={() => setIsCrmOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        onNavigateStore={() => setActiveView('store')}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div 
        id="mobile-sticky-bottom-bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-3 flex items-center justify-around shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            setActiveView('store');
            scrollToCatalog();
          }}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-stone-600 hover:text-emerald-700 active:scale-95 transition-transform"
        >
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-semibold mt-0.5">{lang === 'uk' ? 'Каталог' : 'Catalog'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDosageCalcOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-stone-600 hover:text-emerald-700 active:scale-95 transition-transform"
        >
          <Calculator className="w-5 h-5 text-emerald-700" />
          <span className="text-[10px] font-semibold mt-0.5">{lang === 'uk' ? 'Норми' : 'Calculator'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCrmOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-stone-600 hover:text-blue-600 active:scale-95 transition-transform"
        >
          <Database className="w-5 h-5 text-blue-600" />
          <span className="text-[10px] font-semibold mt-0.5">{lang === 'uk' ? 'CRM' : 'CRM'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-stone-600 hover:text-emerald-700 active:scale-95 transition-transform"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-emerald-800" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-stone-950 text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">{lang === 'uk' ? 'Кошик' : 'Cart'}</span>
        </button>

        <a
          href="tel:+380800330550"
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-stone-600 hover:text-emerald-700 active:scale-95 transition-transform"
        >
          <PhoneCall className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-semibold mt-0.5">{lang === 'uk' ? 'Агроном' : 'Call'}</span>
        </a>
      </div>
    </div>
  );
}
