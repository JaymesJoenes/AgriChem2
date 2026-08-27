import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  User, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  CircleDot, 
  FileText, 
  Lock,
  ChevronRight,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { 
  CartItem, 
  Language, 
  DeliveryMethod, 
  PaymentMethod, 
  OrderCustomerInfo, 
  OrderShippingInfo,
  Order 
} from '../types';
import { NP_CITIES, getBranchesForCity } from '../data/novaposhta';
import { t } from '../data/translations';

interface CheckoutPageProps {
  items: CartItem[];
  lang: Language;
  onBackToStore: () => void;
  onPlaceOrder: (order: Order) => void;
  onTriggerMonobankPayment: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  lang,
  onBackToStore,
  onPlaceOrder,
  onTriggerMonobankPayment,
}) => {
  const currentT = t[lang];

  // Customer State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+380 ');
  const [email, setEmail] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [edrpou, setEdrpou] = useState('');
  const [comment, setComment] = useState('');

  // Shipping State
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('branch');
  const [selectedCityRef, setSelectedCityRef] = useState<string>(NP_CITIES[0].ref);
  const [selectedBranchRef, setSelectedBranchRef] = useState<string>('');
  const [courierStreet, setCourierStreet] = useState('');
  const [courierBuilding, setCourierBuilding] = useState('');
  const [courierFarmName, setCourierFarmName] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('monobank');

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get available branches for the selected city
  const availableBranches = useMemo(() => {
    return getBranchesForCity(selectedCityRef, deliveryMethod === 'postomat' ? true : false);
  }, [selectedCityRef, deliveryMethod]);

  // Set default branch when city changes
  React.useEffect(() => {
    if (availableBranches.length > 0) {
      setSelectedBranchRef(availableBranches[0].ref);
    }
  }, [availableBranches]);

  const selectedCity = NP_CITIES.find(c => c.ref === selectedCityRef) || NP_CITIES[0];
  const selectedBranch = availableBranches.find(b => b.ref === selectedBranchRef) || availableBranches[0];

  const subtotal = items.reduce(
    (sum, item) => sum + item.selectedPackage.price * item.quantity,
    0
  );

  const freeShipping = subtotal >= 15000;
  const estimatedShippingCost = freeShipping ? 0 : (deliveryMethod === 'courier' ? 180 : 120);
  const grandTotal = subtotal + (paymentMethod === 'cash_on_delivery' ? Math.round(subtotal * 0.02 + 20) : 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = lang === 'uk' ? "Вкажіть ім'я" : 'First name required';
    if (!lastName.trim()) newErrors.lastName = lang === 'uk' ? "Вкажіть прізвище" : 'Last name required';
    if (!phone || phone.length < 10) newErrors.phone = lang === 'uk' ? 'Вкажіть коректний телефон' : 'Valid phone required';
    
    if (isCompany) {
      if (!companyName.trim()) newErrors.companyName = lang === 'uk' ? 'Вкажіть назву агрофірми/ФОП' : 'Company name required';
      if (!edrpou.trim() || edrpou.length < 8) newErrors.edrpou = lang === 'uk' ? 'Вкажіть 8-значний код ЄДРПОУ' : '8-digit code required';
    }

    if (deliveryMethod === 'courier') {
      if (!courierStreet.trim()) newErrors.courierStreet = lang === 'uk' ? 'Вкажіть вулицю / дорогу' : 'Street required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const customer: OrderCustomerInfo = {
      firstName,
      lastName,
      phone,
      email,
      isCompany,
      companyName: isCompany ? companyName : undefined,
      edrpou: isCompany ? edrpou : undefined,
      comment,
    };

    const shipping: OrderShippingInfo = {
      method: deliveryMethod,
      cityRef: selectedCityRef,
      cityName: lang === 'uk' ? selectedCity.nameUk : selectedCity.nameEn,
      branchRef: deliveryMethod !== 'courier' ? selectedBranch?.ref : undefined,
      branchName: deliveryMethod !== 'courier' ? (lang === 'uk' ? selectedBranch?.nameUk : selectedBranch?.nameEn) : undefined,
      courierAddress: deliveryMethod === 'courier' ? {
        street: courierStreet,
        building: courierBuilding,
        farmName: courierFarmName,
      } : undefined,
    };

    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substring(2, 9),
      orderNumber: `AG-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: [...items],
      customer,
      shipping,
      paymentMethod,
      paymentStatus: paymentMethod === 'monobank' ? 'pending' : 'on_delivery',
      orderStatus: 'new',
      subtotal,
      shippingCost: estimatedShippingCost,
      total: grandTotal,
      ttnNumber: `20450${Math.floor(10000000 + Math.random() * 90000000)}`,
      monobankInvoiceId: paymentMethod === 'monobank' ? `mono_inv_${Math.random().toString(36).substr(2, 10)}` : undefined,
    };

    if (paymentMethod === 'monobank') {
      onTriggerMonobankPayment(newOrder);
    } else {
      onPlaceOrder(newOrder);
    }
  };

  return (
    <div className="bg-stone-100/70 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <button
          type="button"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-700 mb-6 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{currentT.continueShopping}</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            {currentT.checkoutTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {lang === 'uk' 
              ? 'Заповніть інформацію для доставки Новою Поштою та оберіть зручний метод оплати' 
              : 'Complete your shipping information and choose preferred payment method'}
          </p>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact Info */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="font-bold text-base text-stone-900">{currentT.stepCustomer}</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {currentT.firstName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-firstname"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={lang === 'uk' ? 'Іван' : 'John'}
                        className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none ${
                          errors.firstName ? 'border-red-500' : 'border-stone-300 focus:border-emerald-600'
                        }`}
                      />
                      {errors.firstName && <span className="text-[10px] text-red-500 mt-0.5">{errors.firstName}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {currentT.lastName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-lastname"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={lang === 'uk' ? 'Коваленко' : 'Smith'}
                        className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none ${
                          errors.lastName ? 'border-red-500' : 'border-stone-300 focus:border-emerald-600'
                        }`}
                      />
                      {errors.lastName && <span className="text-[10px] text-red-500 mt-0.5">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {currentT.phone} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+380 (__) ___-__-__"
                        className={`w-full px-3 py-2 bg-stone-50 border rounded-xl text-xs font-mono text-stone-900 focus:bg-white focus:outline-none ${
                          errors.phone ? 'border-red-500' : 'border-stone-300 focus:border-emerald-600'
                        }`}
                      />
                      {errors.phone && <span className="text-[10px] text-red-500 mt-0.5">{errors.phone}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {currentT.email} ({lang === 'uk' ? 'для чека та ТТН' : 'for receipt'})
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="agro.firm@example.com"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Legal Entity / Farm Toggle */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                      <input
                        id="checkout-is-company-check"
                        type="checkbox"
                        checked={isCompany}
                        onChange={(e) => setIsCompany(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
                      />
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        {currentT.isEntity}
                      </span>
                    </label>

                    {isCompany && (
                      <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            {currentT.companyName} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="checkout-company-name"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={lang === 'uk' ? 'ФГ «Нива Поділля» або ТОВ «АгроІнвест»' : 'Farm Enterprise LLC'}
                            className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs text-stone-900 ${
                              errors.companyName ? 'border-red-500' : 'border-stone-300 focus:border-emerald-600'
                            }`}
                          />
                          {errors.companyName && <span className="text-[10px] text-red-500">{errors.companyName}</span>}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                            {currentT.edrpou} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="checkout-company-edrpou"
                            type="text"
                            maxLength={8}
                            value={edrpou}
                            onChange={(e) => setEdrpou(e.target.value)}
                            placeholder="38491204"
                            className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-mono text-stone-900 ${
                              errors.edrpou ? 'border-red-500' : 'border-stone-300 focus:border-emerald-600'
                            }`}
                          />
                          {errors.edrpou && <span className="text-[10px] text-red-500">{errors.edrpou}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Nova Poshta Delivery Module */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-stone-900">{currentT.stepShipping}</h2>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {lang === 'uk' ? 'Офіційний партнер доставки для агросектору' : 'Official Agro Delivery Partner'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded tracking-wider">
                    НОВА ПОШТА
                  </div>
                </div>

                {/* Delivery Mode Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    id="delivery-tab-branch"
                    onClick={() => setDeliveryMethod('branch')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      deliveryMethod === 'branch'
                        ? 'border-red-600 bg-red-50/80 text-red-900 ring-1 ring-red-500/30'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-red-600" />
                    <span className="text-center">{lang === 'uk' ? 'Відділення (до 1.1т)' : 'Cargo Branch'}</span>
                  </button>

                  <button
                    type="button"
                    id="delivery-tab-postomat"
                    onClick={() => setDeliveryMethod('postomat')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      deliveryMethod === 'postomat'
                        ? 'border-red-600 bg-red-50/80 text-red-900 ring-1 ring-red-500/30'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <PackageCheck className="w-4 h-4 text-red-600" />
                    <span className="text-center">{lang === 'uk' ? 'Поштомат (до 20 кг)' : 'Parcel Locker'}</span>
                  </button>

                  <button
                    type="button"
                    id="delivery-tab-courier"
                    onClick={() => setDeliveryMethod('courier')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      deliveryMethod === 'courier'
                        ? 'border-red-600 bg-red-50/80 text-red-900 ring-1 ring-red-500/30'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-center">{lang === 'uk' ? 'Кур’єр в господарство' : 'Courier to Farm'}</span>
                  </button>
                </div>

                {/* City & Branch Selectors */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {currentT.selectCity} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="checkout-np-city-select"
                      value={selectedCityRef}
                      onChange={(e) => setSelectedCityRef(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:border-red-500 focus:outline-none"
                    >
                      {NP_CITIES.map((city) => (
                        <option key={city.ref} value={city.ref}>
                          {lang === 'uk' ? `${city.nameUk} (${city.areaUk})` : `${city.nameEn} (${city.areaEn})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {deliveryMethod !== 'courier' ? (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {deliveryMethod === 'postomat' ? currentT.methodPostomat : currentT.selectBranch} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="checkout-np-branch-select"
                        value={selectedBranchRef}
                        onChange={(e) => setSelectedBranchRef(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:border-red-500 focus:outline-none"
                      >
                        {availableBranches.map((branch) => (
                          <option key={branch.ref} value={branch.ref}>
                            {lang === 'uk' 
                              ? `${branch.nameUk} — ${branch.addressUk}` 
                              : `${branch.nameEn} — ${branch.addressEn}`}
                          </option>
                        ))}
                      </select>
                      <span className="block text-[11px] text-stone-500 mt-1">
                        {lang === 'uk' 
                          ? '💡 Для замовлення 20-літрових каністр та бочок обирайте вантажні відділення.' 
                          : '💡 Select freight branches for chemical drums and canisters over 30kg.'}
                      </span>
                    </div>
                  ) : (
                    /* Courier / Farm Address Inputs */
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          {currentT.street} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="checkout-courier-street"
                          type="text"
                          value={courierStreet}
                          onChange={(e) => setCourierStreet(e.target.value)}
                          placeholder={lang === 'uk' ? 'вул. Польова, 12 або Автошлях Т-0205, км 14' : 'Field route or street'}
                          className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                        />
                        {errors.courierStreet && <span className="text-[10px] text-red-500">{errors.courierStreet}</span>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          {currentT.farmName}
                        </label>
                        <input
                          id="checkout-courier-farm"
                          type="text"
                          value={courierFarmName}
                          onChange={(e) => setCourierFarmName(e.target.value)}
                          placeholder={lang === 'uk' ? 'Склад агрохімії №2, тракторна бригада' : 'Agro storage / brigade'}
                          className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600">
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{currentT.shippingEstimate}</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h2 className="font-bold text-base text-stone-900">{currentT.stepPayment}</h2>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Monobank Acquiring (MonoPay / Apple / Google / Card) */}
                  <label
                    id="payment-option-monobank"
                    onClick={() => setPaymentMethod('monobank')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'monobank'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 mt-0.5 rounded-full border border-indigo-600 flex items-center justify-center">
                          {paymentMethod === 'monobank' && (
                            <div className="w-2 h-2 rounded-full bg-indigo-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">
                              {currentT.paymentMono}
                            </span>
                            <span className="bg-stone-950 text-white font-bold text-[9px] px-1.5 py-0.2 rounded font-mono">
                              monobank
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                            {currentT.paymentMonoDesc}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-white border border-stone-200 text-[10px] font-bold px-2 py-0.5 rounded text-stone-700 shadow-2xs">
                              MonoPay
                            </span>
                            <span className="bg-white border border-stone-200 text-[10px] font-bold px-2 py-0.5 rounded text-stone-700 shadow-2xs">
                              Apple Pay
                            </span>
                            <span className="bg-white border border-stone-200 text-[10px] font-bold px-2 py-0.5 rounded text-stone-700 shadow-2xs">
                              Google Pay
                            </span>
                            <span className="bg-white border border-stone-200 text-[10px] font-bold px-2 py-0.5 rounded text-stone-700 shadow-2xs">
                              Visa / Mastercard
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery (Післяплата) */}
                  <label
                    id="payment-option-cod"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-0.5 rounded-full border border-emerald-600 flex items-center justify-center">
                        {paymentMethod === 'cash_on_delivery' && (
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">
                          {currentT.paymentCod}
                        </span>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                          {currentT.paymentCodDesc}
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Bank Transfer via IBAN Invoice with VAT */}
                  <label
                    id="payment-option-bank"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-0.5 rounded-full border border-blue-600 flex items-center justify-center">
                        {paymentMethod === 'bank_transfer' && (
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">
                          {currentT.paymentBank}
                        </span>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                          {currentT.paymentBankDesc}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Placement CTA */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs sticky top-24 space-y-5">
                <h3 className="font-bold text-base text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span>{lang === 'uk' ? 'Ваше замовлення' : 'Order Summary'}</span>
                  <span className="text-xs text-stone-500 font-mono font-normal">
                    {items.length} {lang === 'uk' ? 'поз.' : 'items'}
                  </span>
                </h3>

                {/* Line Items */}
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="pr-2">
                        <span className="font-bold text-stone-900 block line-clamp-1">
                          {lang === 'uk' ? item.product.name : item.product.nameEn}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {item.quantity} шт × {item.selectedPackage.size}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-stone-900 shrink-0">
                        {(item.selectedPackage.price * item.quantity).toLocaleString('uk-UA')} ₴
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Calculation */}
                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>{currentT.subtotal}:</span>
                    <span className="font-mono font-semibold text-stone-900">{subtotal.toLocaleString('uk-UA')} ₴</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>{currentT.shipping}:</span>
                    <span className="font-semibold text-emerald-700">
                      {freeShipping 
                        ? (lang === 'uk' ? '0 ₴ (Безкоштовно від 15 000 ₴)' : 'Free') 
                        : (lang === 'uk' ? 'За тарифами НП' : 'Per carrier')}
                    </span>
                  </div>

                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>{lang === 'uk' ? 'Комісія післяплати НП (2% + 20 ₴):' : 'COD Fee (2% + 20 ₴):'}</span>
                      <span className="font-mono">{Math.round(subtotal * 0.02 + 20).toLocaleString('uk-UA')} ₴</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-stone-950 font-bold">
                    <span className="text-sm">{currentT.total}:</span>
                    <span className="text-xl font-mono text-emerald-900">
                      {grandTotal.toLocaleString('uk-UA')} ₴
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  id="checkout-submit-order-btn"
                  className={`w-full font-bold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'monobank'
                      ? 'bg-stone-950 hover:bg-stone-900 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'monobank' 
                      ? currentT.payWithMono 
                      : currentT.placeOrder}
                  </span>
                </button>

                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 space-y-1 text-[11px] text-stone-500">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'uk' ? 'Гарантія безпеки та автентичності' : 'Security & Authenticity Guarantee'}</span>
                  </div>
                  <p>
                    {lang === 'uk' 
                      ? 'Усі замовлення супроводжуються видатковою накладною, сертифікатом та номером відстеження ТТН.' 
                      : 'Every order is insured and accompanied by VAT invoice, certificates and tracking number.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
