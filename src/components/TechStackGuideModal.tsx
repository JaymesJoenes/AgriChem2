import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  Database, 
  Server, 
  Code2, 
  Cpu, 
  CreditCard, 
  Truck, 
  FileSpreadsheet, 
  Lock, 
  Globe2, 
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Language } from '../types';

interface TechStackGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TechStackGuideModal: React.FC<TechStackGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState<'stack' | 'security' | 'integrations' | 'roadmap'>('stack');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        id="tech-stack-guide-modal"
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg font-serif">
                  {lang === 'uk' ? 'Архітектурний план та Технологічний стек' : 'Architecture & Tech Stack Blueprint'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-stone-300">
                {lang === 'uk' ? 'Комплексний огляд безпеки, продуктивності та масштабування' : 'Security, performance and scalability blueprint'}
              </p>
            </div>
          </div>

          <button
            id="close-tech-stack-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 py-2.5 flex gap-2 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSection('stack')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'stack' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'uk' ? '1. Рекомендований Стек' : '1. Recommended Stack'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('security')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'security' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'uk' ? '2. Безпека & Стабільність' : '2. Security & Compliance'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('integrations')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'integrations' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'uk' ? '3. Модулі (НП, Monobank, CRM)' : '3. Integrations'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('roadmap')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'roadmap' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {lang === 'uk' ? '4. Поетапний план впровадження' : '4. Implementation Roadmap'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-stone-700 space-y-6">
          {activeSection === 'stack' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-stone-900">
                {lang === 'uk' ? 'Оптимальний технологічний стек для агрохімічного e-commerce' : 'Optimal Tech Stack for Agrochem E-Commerce'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Code2 className="w-4 h-4 text-emerald-700" />
                    <span>Frontend & UI Layer</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                    <li><strong>React 19 + TypeScript + Vite:</strong> Блискавичний рендеринг, сувора типізація даних про препарати, фасування та дозування.</li>
                    <li><strong>Tailwind CSS v4:</strong> Адаптивний інтерфейс для мобільних пристроїв фермерів у польових умовах.</li>
                    <li><strong>i18n Readiness:</strong> Архітектура двомовності (UA основна + EN розширена).</li>
                  </ul>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Server className="w-4 h-4 text-blue-700" />
                    <span>Backend & Serverless API</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                    <li><strong>Node.js / Express or Fastify:</strong> Безпечна проксі-обробка секретних API-токенів Monobank та Нової Пошти.</li>
                    <li><strong>Webhook Handling:</strong> Обробка зворотних сповіщень Monobank <code>POST /api/webhook/monobank</code> про статус платежу.</li>
                    <li><strong>Cloud Run / Docker:</strong> Автоматичне масштабування під час піків весняно-осіннього агросезону.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Database className="w-4 h-4 text-amber-700" />
                    <span>Бази даних & CRM</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                    <li><strong>PostgreSQL / Cloud SQL / Firestore:</strong> Надійне зберігання замовлень, контрагентів (ФОП, ТОВ, ЄДРПОУ), ТТН і каталогів.</li>
                    <li><strong>Google Sheets API:</strong> Безшовна синхронізація для менеджерів з продажу на першому етапі без зайвих витрат на дорогі enterprise CRM.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <CreditCard className="w-4 h-4 text-indigo-700" />
                    <span>Платіжна інфраструктура</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                    <li><strong>Monobank Acquiring API:</strong> MonoPay QR, Apple Pay, Google Pay, захист 3DS 2.0.</li>
                    <li><strong>Генерація рахунків IBAN з ПДВ:</strong> Необхідно для великих агрохолдингів та фермерських господарств.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-stone-900">
                {lang === 'uk' ? 'Вимоги до кібербезпеки та захисту комерційних даних' : 'Cybersecurity & Commercial Data Protection'}
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    <span>Приховування API ключів на стороні сервера</span>
                  </div>
                  <p className="text-stone-600">
                    Токен Monobank (<code>X-Token</code>) та API ключ Нової Пошти ніколи не повинні потрапляти у браузер клієнта. Всі виклики проходять через захищені бекенд ендпоінти.
                  </p>
                </div>

                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Валідація Webhook сигнатур та ідемпотентність</span>
                  </div>
                  <p className="text-stone-600">
                    Перевірка цифрового підпису ECDSA від Monobank для уникнення підробки статусів оплат та дублювання списань.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-100 border border-stone-200 rounded-xl space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-stone-700" />
                    <span>Захист персональних даних клієнтів (GDPR / Законодавство України)</span>
                  </div>
                  <p className="text-stone-600">
                    Шифрування номерів телефонів, бази ЄДРПОУ господарств та адрес доставки за протоколами TLS 1.3.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-stone-900">
                {lang === 'uk' ? 'Специфікації інтеграцій для ринку України' : 'Ukraine Market Specific Integrations'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-red-950 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-red-600" />
                    <span>Нова Пошта API v2.0</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Автоматичний пошук міст (<code>searchSettlements</code>), вантажних відділень до 1100 кг для каністр ЗЗР, генерація ТТН (<code>InternetDocument</code>) та розрахунок вартості.
                  </p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Monobank Acquiring API</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Створення інвойсу (<code>/api/merchant/invoice/create</code>), підтримка MonoPay, холдування коштів та фіскалізація через ПРРО (Checkbox / Вчасно.Каса).
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Google Sheets / CRM Sync</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Миттєвий експорт замовлень у таблиці для менеджерів, розподіл клієнтів за регіонами, автоматичні SMS повідомлення клієнтам через TurboSMS/AlphaSMS.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'roadmap' && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-stone-900">
                {lang === 'uk' ? 'Поетапна дорожня карта розгортання платформи' : 'Step-by-Step Deployment Roadmap'}
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <span className="font-bold text-stone-900 block">{lang === 'uk' ? 'Етап 1: Каталог, Кошик та Оформлення (Готово)' : 'Stage 1: Catalog, Cart & Checkout'}</span>
                    <p className="text-stone-500 mt-0.5">{lang === 'uk' ? 'Інтерактивний каталог ЗЗР, швидке замовлення в 1 клік, модуль Нової Пошти, вибір 3 способів оплати.' : 'Interactive product catalog, 1-click buy, Nova Poshta module, 3 payment methods.'}</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <span className="font-bold text-stone-900 block">{lang === 'uk' ? 'Етап 2: Підключення бойових ключів API' : 'Stage 2: Live API Keys Activation'}</span>
                    <p className="text-stone-500 mt-0.5">{lang === 'uk' ? 'Додавання токенів Monobank Merchant та Нова Пошта API в налаштування середовища .env для автоматичної генерації реальних накладних.' : 'Connecting Monobank Merchant and Nova Poshta API keys in .env.'}</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <span className="font-bold text-stone-900 block">{lang === 'uk' ? 'Етап 3: Інтеграція ПРРО та масштабної CRM' : 'Stage 3: Fiscal PRRO & Scaled CRM'}</span>
                    <p className="text-stone-500 mt-0.5">{lang === 'uk' ? 'Підключення електронних чеків (Checkbox/Вчасно) та масштабування воронки продажів для агрономічних консультацій.' : 'Adding electronic fiscal receipts and enterprise agro sales pipeline.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            {lang === 'uk' ? 'Платформа спроектована згідно зі стандартами e-commerce України' : 'Engineered per Ukrainian e-commerce standards'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'uk' ? 'Зрозуміло' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
