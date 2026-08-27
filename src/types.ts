export type CategoryType = 
  | 'all'
  | 'herbicides'      // Гербіциди
  | 'fungicides'      // Фунгіциди
  | 'insecticides'    // Інсектициди
  | 'seed_treatments' // Протруйники
  | 'growth_regulators' // Регулятори росту
  | 'microfertilizers'  // Мікродобрива
  | 'adjuvants';      // Прилипачі / Ад'юванти

export type Language = 'uk' | 'en';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryType;
  brand: string;
  activeIngredient: string;
  activeIngredientEn: string;
  concentration: string;
  formulation: string; // к.е., к.с., в.г. (концентрат емульсії, тощо)
  formulationEn: string;
  targetCrops: string[];
  targetCropsEn: string[];
  targetPests: string[];
  targetPestsEn: string[];
  dosageRate: string; // e.g. "0.5 - 1.5 л/га"
  dosageRatePerHa: number; // average for calculator
  pricePerUnit: number; // base packaging price in UAH
  unitSize: string; // e.g. "5 л", "10 л", "20 л", "1 кг"
  unitVolumeLiters: number;
  availablePackages: { size: string; volumeLiters: number; price: number }[];
  inStock: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewsCount: number;
  descriptionUk: string;
  descriptionEn: string;
  safetyHazardClass: number; // 2 or 3
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  selectedPackage: {
    size: string;
    volumeLiters: number;
    price: number;
  };
  quantity: number;
}

export type DeliveryMethod = 'branch' | 'postomat' | 'courier';

export type PaymentMethod = 'cash_on_delivery' | 'bank_transfer' | 'monobank';

export interface NovaPoshtaCity {
  ref: string;
  nameUk: string;
  nameEn: string;
  areaUk: string;
  areaEn: string;
}

export interface NovaPoshtaBranch {
  ref: string;
  cityRef: string;
  number: string;
  nameUk: string;
  nameEn: string;
  addressUk: string;
  addressEn: string;
  maxWeightKg: number;
  isPostomat: boolean;
}

export interface OrderCustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isCompany: boolean;
  companyName?: string;
  edrpou?: string; // ЄДРПОУ for Ukrainian legal entities / farms
  comment?: string;
}

export interface OrderShippingInfo {
  method: DeliveryMethod;
  cityRef: string;
  cityName: string;
  branchRef?: string;
  branchName?: string;
  courierAddress?: {
    street: string;
    building: string;
    apartment?: string;
    farmName?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  customer: OrderCustomerInfo;
  shipping: OrderShippingInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'on_delivery';
  orderStatus: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  total: number;
  ttnNumber?: string; // Номер ТТН Нової Пошти
  monobankInvoiceId?: string;
  notes?: string;
}
