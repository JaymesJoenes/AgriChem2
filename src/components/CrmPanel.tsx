import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  Phone, 
  Building2, 
  FileSpreadsheet, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Order, Language } from '../types';
import { t } from '../data/translations';

interface CrmPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  lang: Language;
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  onUpdatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
}

export const CrmPanel: React.FC<CrmPanelProps> = ({
  isOpen,
  onClose,
  orders,
  lang,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
}) => {
  const currentT = t[lang];
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus !== 'all' && ord.orderStatus !== filterStatus) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.customer.firstName.toLowerCase().includes(q) ||
      ord.customer.lastName.toLowerCase().includes(q) ||
      ord.customer.phone.includes(q) ||
      (ord.customer.companyName && ord.customer.companyName.toLowerCase().includes(q)) ||
      (ord.ttnNumber && ord.ttnNumber.includes(q))
    );
  });

  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const exportToGoogleSheetsCsv = () => {
    const headers = [
      'OrderNumber',
      'Date',
      'CustomerName',
      'Phone',
      'Email',
      'IsCompany',
      'CompanyName',
      'EDRPOU',
      'City',
      'Branch_Address',
      'PaymentMethod',
      'PaymentStatus',
      'OrderStatus',
      'ItemsCount',
      'Total_UAH',
      'TTN_NovaPoshta'
    ];

    const rows = orders.map(ord => [
      ord.orderNumber,
      new Date(ord.createdAt).toLocaleString('uk-UA'),
      `"${ord.customer.firstName} ${ord.customer.lastName}"`,
      `"${ord.customer.phone}"`,
      ord.customer.email || '',
      ord.customer.isCompany ? 'YES' : 'NO',
      `"${ord.customer.companyName || ''}"`,
      ord.customer.edrpou || '',
      `"${ord.shipping.cityName}"`,
      `"${ord.shipping.branchName || ord.shipping.courierAddress?.street || ''}"`,
      ord.paymentMethod,
      ord.paymentStatus,
      ord.orderStatus,
      ord.items.length,
      ord.total,
      ord.ttnNumber || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrochem_crm_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
      <div 
        id="crm-management-panel"
        className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CRM Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg tracking-tight">
                  {currentT.crmTitle}
                </h2>
                <span className="bg-blue-500/30 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                  v1.2 Sales Hub
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {currentT.crmSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export to Google Sheets CSV */}
            <button
              type="button"
              id="crm-export-sheets-btn"
              onClick={exportToGoogleSheetsCsv}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Експорт для Google Sheets / Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{currentT.exportSheets}</span>
            </button>

            <button
              id="close-crm-panel-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-500 block">{lang === 'uk' ? 'Всього замовлень:' : 'Total Orders:'}</span>
            <span className="font-bold font-mono text-base text-stone-900">{orders.length} шт</span>
          </div>
          <div>
            <span className="text-stone-500 block">{lang === 'uk' ? 'Загальний обіг:' : 'Total Revenue:'}</span>
            <span className="font-bold font-mono text-base text-emerald-800">{totalRevenue.toLocaleString('uk-UA')} ₴</span>
          </div>
          <div>
            <span className="text-stone-500 block">{lang === 'uk' ? 'Середній чек:' : 'Avg Order Value:'}</span>
            <span className="font-bold font-mono text-base text-stone-900">
              {orders.length ? Math.round(totalRevenue / orders.length).toLocaleString('uk-UA') : 0} ₴
            </span>
          </div>
          <div>
            <span className="text-stone-500 block">{lang === 'uk' ? 'Синхронізація:' : 'CRM Integration:'}</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Google Sheets Ready
            </span>
          </div>
        </div>

        {/* CRM Main Workspace (Split View) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Order List & Filters */}
          <div className="md:col-span-5 border-r border-stone-200 flex flex-col bg-stone-50/50">
            {/* Search & Status Filter */}
            <div className="p-3 border-b border-stone-200 space-y-2 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'uk' ? 'Пошук за номером, телефоном, ТТН...' : 'Search by order #, phone, TTN...'}
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-900 focus:bg-white focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {['all', 'new', 'processing', 'shipped', 'delivered'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded-md font-semibold shrink-0 transition-colors ${
                      filterStatus === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' && (lang === 'uk' ? 'Всі' : 'All')}
                    {st === 'new' && (lang === 'uk' ? 'Нові' : 'New')}
                    {st === 'processing' && (lang === 'uk' ? 'В обробці' : 'Processing')}
                    {st === 'shipped' && (lang === 'uk' ? 'Відправлені' : 'Shipped')}
                    {st === 'delivered' && (lang === 'uk' ? 'Завершені' : 'Done')}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Order Cards */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-200">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  {lang === 'uk' ? 'Замовлень не знайдено' : 'No orders found'}
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-3.5 transition-all cursor-pointer ${
                      selectedOrder?.id === ord.id
                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                        : 'hover:bg-stone-100/80 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold font-mono text-stone-900">{ord.orderNumber}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString('uk-UA')}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-stone-800">
                      {ord.customer.firstName} {ord.customer.lastName}
                      {ord.customer.companyName && (
                        <span className="block text-[11px] text-stone-500 font-normal">
                          {ord.customer.companyName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100 text-[11px]">
                      <span className="font-bold font-mono text-emerald-800">
                        {ord.total.toLocaleString('uk-UA')} ₴
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        ord.orderStatus === 'new' ? 'bg-amber-100 text-amber-800' :
                        ord.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                        ord.orderStatus === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Order Detail & Action Inspector */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-white space-y-6">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 font-mono">
                      {selectedOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {new Date(selectedOrder.createdAt).toLocaleString('uk-UA')}
                    </p>
                  </div>

                  {/* Status Modifiers */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => onUpdateOrderStatus(selectedOrder.id, e.target.value as Order['orderStatus'])}
                      className="px-2.5 py-1.5 bg-stone-100 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-none"
                    >
                      <option value="new">🟡 Нове замовлення</option>
                      <option value="processing">🔵 В обробці агрономом</option>
                      <option value="shipped">🟣 Відправлено Новою Поштою</option>
                      <option value="delivered">🟢 Доставлено & Отримано</option>
                      <option value="cancelled">🔴 Скасовано</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1.5">
                    <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                      {lang === 'uk' ? 'Контактні дані' : 'Customer Info'}
                    </span>
                    <div className="font-semibold text-stone-900">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </div>
                    <div className="flex items-center gap-1 text-stone-600 font-mono">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {selectedOrder.customer.phone}
                    </div>
                    {selectedOrder.customer.email && (
                      <div className="text-stone-500">{selectedOrder.customer.email}</div>
                    )}
                    {selectedOrder.customer.isCompany && (
                      <div className="pt-2 mt-2 border-t border-stone-200">
                        <div className="font-bold text-emerald-900">{selectedOrder.customer.companyName}</div>
                        <div className="text-stone-500">ЄДРПОУ: {selectedOrder.customer.edrpou}</div>
                      </div>
                    )}
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1.5">
                    <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                      {lang === 'uk' ? 'Доставка Новою Поштою' : 'Shipping'}
                    </span>
                    <div className="font-semibold text-stone-900">
                      {selectedOrder.shipping.cityName}
                    </div>
                    <div className="text-stone-600">
                      {selectedOrder.shipping.branchName || selectedOrder.shipping.courierAddress?.street}
                    </div>
                    {selectedOrder.ttnNumber && (
                      <div className="pt-2 mt-2 border-t border-stone-200">
                        <span className="text-[10px] text-stone-500 block">ТТН перевізника:</span>
                        <span className="font-mono font-bold text-red-700 text-sm">
                          {selectedOrder.ttnNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div>
                  <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider mb-2">
                    {lang === 'uk' ? 'Склад замовлення:' : 'Order Line Items:'}
                  </h4>
                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-stone-900 block">{it.product.name}</span>
                          <span className="text-stone-500 text-[11px]">{it.selectedPackage.size} • {it.product.brand}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-stone-900">
                            {it.quantity} × {it.selectedPackage.price.toLocaleString('uk-UA')} ₴
                          </span>
                          <span className="block text-[11px] font-mono text-stone-500">
                            = {(it.quantity * it.selectedPackage.price).toLocaleString('uk-UA')} ₴
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Status & Financials */}
                <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-stone-400 block">
                      {lang === 'uk' ? 'Спосіб оплати:' : 'Payment Method:'}
                    </span>
                    <span className="font-bold text-sm text-white">
                      {selectedOrder.paymentMethod === 'monobank' && 'Monobank Online Acquiring'}
                      {selectedOrder.paymentMethod === 'cash_on_delivery' && 'Післяплата на Новій Пошті'}
                      {selectedOrder.paymentMethod === 'bank_transfer' && 'IBAN Безготівковий розрахунок'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">
                      {lang === 'uk' ? 'Загальна сума:' : 'Total Amount:'}
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {selectedOrder.total.toLocaleString('uk-UA')} ₴
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-stone-400 text-xs">
                {lang === 'uk' ? 'Оберіть замовлення зі списку для перегляду' : 'Select an order from the list'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
