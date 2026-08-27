import React from 'react';
import { 
  Sprout, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Layers,
  FileCheck 
} from 'lucide-react';
import { Language, CategoryType } from '../types';
import { t } from '../data/translations';

interface FooterProps {
  lang: Language;
  onOpenDosageCalc: () => void;
  onOpenTechStack: () => void;
  onOpenCrm: () => void;
  onScrollToCatalog: (category?: CategoryType) => void;
  onNavigateStore?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenDosageCalc,
  onOpenTechStack,
  onOpenCrm,
  onScrollToCatalog,
  onNavigateStore,
}) => {
  const currentT = t[lang];

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      {/* Top Partner Strip */}
      <div className="border-b border-stone-800/80 bg-stone-950/60 py-5 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-stone-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-600 text-white font-bold flex items-center justify-center text-[10px]">
                НП
              </div>
              <span className="font-semibold text-stone-200">Нова Пошта (Вантажні відділення до 1.1т)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white text-stone-950 font-extrabold flex items-center justify-center text-[10px]">
                mono
              </div>
              <span className="font-semibold text-stone-200">Monobank Acquiring API</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-[11px]">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lang === 'uk' ? 'Офіційна ліцензія на торгівлю ЗЗР №582914' : 'Certified Agro Chemical Distributor License'}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info (Clickable) */}
        <div className="space-y-4">
          <button 
            type="button"
            onClick={() => {
              if (onNavigateStore) onNavigateStore();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-bold text-base text-white font-serif tracking-tight group-hover:text-emerald-300 transition-colors">
              {currentT.storeName}
            </span>
          </button>

          <p className="text-stone-400 text-xs leading-relaxed">
            {lang === 'uk'
              ? 'Надійний постачальник оригінальних засобів захисту рослин, мікродобрив та насіння для українських аграріїв, фермерів та агрохолдингів.'
              : 'Reliable supplier of genuine crop protection products, fertilizers and agro chemicals for Ukrainian farmers.'}
          </p>

          <div className="pt-1 text-stone-400 text-[11px] space-y-1">
            <div>ТОВ «АгроХім Маркет Україна»</div>
            <div>Код ЄДРПОУ: 42890123 • Платник ПДВ 20%</div>
          </div>
        </div>

        {/* Col 2: Navigation & Services */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            {lang === 'uk' ? 'Каталог препаратів' : 'Product Categories'}
          </h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button 
                type="button" 
                onClick={() => onScrollToCatalog('herbicides')}
                className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
              >
                {lang === 'uk' ? 'Гербіциди суцільної та вибіркової дії' : 'Herbicides'}
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onScrollToCatalog('fungicides')}
                className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
              >
                {lang === 'uk' ? 'Фунгіциди з грін-ефектом' : 'Fungicides'}
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onScrollToCatalog('insecticides')}
                className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
              >
                {lang === 'uk' ? 'Інсектициди та протруйники насіння' : 'Insecticides & Seed Treatments'}
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onScrollToCatalog('fertilizers')}
                className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
              >
                {lang === 'uk' ? 'Хелатні мікродобрива та прилипачі' : 'Microfertilizers & Adjuvants'}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Tools & Management */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            {lang === 'uk' ? 'Сервіси & Інтеграції' : 'Tools & Infrastructure'}
          </h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button
                type="button"
                id="footer-calc-btn"
                onClick={onOpenDosageCalc}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span>{currentT.navDosageCalc}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                id="footer-tech-stack-btn"
                onClick={onOpenTechStack}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span>{lang === 'uk' ? 'Архітектурний план проекту' : 'Tech Stack Architecture'}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                id="footer-crm-btn"
                onClick={onOpenCrm}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span>{lang === 'uk' ? 'Панель менеджменту замовлень (CRM)' : 'Order Management & CRM'}</span>
              </button>
            </li>
            <li className="text-[11px] text-stone-500 pt-1">
              {lang === 'uk' ? 'Доставка: Нова Пошта (всі області України)' : 'Carrier: Nova Poshta Ukraine'}
            </li>
          </ul>
        </div>

        {/* Col 4: Contacts & Hotlines */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            {lang === 'uk' ? 'Консультація агронома' : 'Agronomist Hotline'}
          </h4>
          <div className="space-y-2 text-stone-400">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href="tel:+380800330550" className="text-white font-mono font-bold hover:text-emerald-400 transition-colors">
                0 (800) 330-550
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-500 shrink-0" />
              <a href="mailto:sales@agrochem.ua" className="font-mono text-[11px] hover:text-emerald-400 transition-colors">sales@agrochem.ua</a>
            </div>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>м. Вінниця, вул. Аграрна 14 / м. Київ, вул. Пирогівський шлях 135</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="border-t border-stone-800 py-4 px-4 sm:px-6 lg:px-8 text-center text-stone-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 {currentT.storeName}. {lang === 'uk' ? 'Всі права захищено.' : 'All rights reserved.'}</span>
          <span>{lang === 'uk' ? 'Безпечна платформа розроблена на базі React 19, TypeScript, Nova Poshta & Monobank Acquiring API' : 'Powered by React 19, TypeScript, Nova Poshta & Monobank Acquiring API'}</span>
        </div>
      </div>
    </footer>
  );
};

