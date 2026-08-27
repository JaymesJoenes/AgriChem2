import { NovaPoshtaCity, NovaPoshtaBranch } from '../types';

export const NP_CITIES: NovaPoshtaCity[] = [
  { ref: 'city-kyiv', nameUk: 'Київ', nameEn: 'Kyiv', areaUk: 'Київська обл.', areaEn: 'Kyiv region' },
  { ref: 'city-dnipro', nameUk: 'Дніпро', nameEn: 'Dnipro', areaUk: 'Дніпропетровська обл.', areaEn: 'Dnipropetrovsk region' },
  { ref: 'city-vinnytsia', nameUk: 'Вінниця', nameEn: 'Vinnytsia', areaUk: 'Вінницька обл. (Агрохаб)', areaEn: 'Vinnytsia region' },
  { ref: 'city-poltava', nameUk: 'Полтава', nameEn: 'Poltava', areaUk: 'Полтавська обл.', areaEn: 'Poltava region' },
  { ref: 'city-cherkasy', nameUk: 'Черкаси', nameEn: 'Cherkasy', areaUk: 'Черкаська обл.', areaEn: 'Cherkasy region' },
  { ref: 'city-lviv', nameUk: 'Львів', nameEn: 'Lviv', areaUk: 'Львівська обл.', areaEn: 'Lviv region' },
  { ref: 'city-odesa', nameUk: 'Одеса', nameEn: 'Odesa', areaUk: 'Одеська обл.', areaEn: 'Odesa region' },
  { ref: 'city-kharkiv', nameUk: 'Харків', nameEn: 'Kharkiv', areaUk: 'Харківська обл.', areaEn: 'Kharkiv region' },
  { ref: 'city-khmelnytskyi', nameUk: 'Хмельницький', nameEn: 'Khmelnytskyi', areaUk: 'Хмельницька обл.', areaEn: 'Khmelnytskyi region' },
  { ref: 'city-kropyvnytskyi', nameUk: 'Кропивницький', nameEn: 'Kropyvnytskyi', areaUk: 'Кіровоградська обл.', areaEn: 'Kirovohrad region' },
  { ref: 'city-zhytomyr', nameUk: 'Житомир', nameEn: 'Zhytomyr', areaUk: 'Житомирська обл.', areaEn: 'Zhytomyr region' },
  { ref: 'city-terнопіль', nameUk: 'Тернопіль', nameEn: 'Ternopil', areaUk: 'Тернопільська обл.', areaEn: 'Ternopil region' },
  { ref: 'city-sumy', nameUk: 'Суми', nameEn: 'Sumy', areaUk: 'Сумська обл.', areaEn: 'Sumy region' },
  { ref: 'city-rivne', nameUk: 'Рівне', nameEn: 'Rivne', areaUk: 'Рівненська обл.', areaEn: 'Rivne region' },
  { ref: 'city-lutsk', nameUk: 'Луцьк', nameEn: 'Lutsk', areaUk: 'Волинська обл.', areaEn: 'Volyn region' },
];

export const NP_BRANCHES: NovaPoshtaBranch[] = [
  // Kyiv
  {
    ref: 'branch-kyiv-1',
    cityRef: 'city-kyiv',
    number: '1',
    nameUk: 'Відділення №1 (Вантажне до 1100 кг, ідеально для каністр ЗЗР)',
    nameEn: 'Branch #1 (Freight up to 1100 kg, ideal for chemical drums)',
    addressUk: 'вул. Пирогівський шлях, 135',
    addressEn: '135 Pyrohivskyi Shlyakh St.',
    maxWeightKg: 1100,
    isPostomat: false,
  },
  {
    ref: 'branch-kyiv-4',
    cityRef: 'city-kyiv',
    number: '4',
    nameUk: 'Відділення №4 (Вантажне без обмежень по вазі)',
    nameEn: 'Branch #4 (Heavy Freight)',
    addressUk: 'вул. Верховинна, 69',
    addressEn: '69 Verkhovynna St.',
    maxWeightKg: 1500,
    isPostomat: false,
  },
  {
    ref: 'branch-kyiv-12',
    cityRef: 'city-kyiv',
    number: '12',
    nameUk: 'Відділення №12 (до 30 кг)',
    nameEn: 'Branch #12 (up to 30 kg)',
    addressUk: 'вул. Васильківська, 34',
    addressEn: '34 Vasylkivska St.',
    maxWeightKg: 30,
    isPostomat: false,
  },
  {
    ref: 'postomat-kyiv-8821',
    cityRef: 'city-kyiv',
    number: '8821',
    nameUk: 'Поштомат №8821 (до 20 кг)',
    nameEn: 'Parcel Locker #8821 (up to 20 kg)',
    addressUk: 'просп. Академіка Палладіна, 46',
    addressEn: '46 Palladina Ave.',
    maxWeightKg: 20,
    isPostomat: true,
  },

  // Vinnytsia (Major Agrarian Hub)
  {
    ref: 'branch-vin-1',
    cityRef: 'city-vinnytsia',
    number: '1',
    nameUk: 'Відділення №1 (Вантажне до 1100 кг для аграріїв)',
    nameEn: 'Branch #1 (Freight up to 1100 kg)',
    addressUk: 'вул. Якова Шепеля, 1',
    addressEn: '1 Yakova Shepelia St.',
    maxWeightKg: 1100,
    isPostomat: false,
  },
  {
    ref: 'branch-vin-3',
    cityRef: 'city-vinnytsia',
    number: '3',
    nameUk: 'Відділення №3 (до 30 кг)',
    nameEn: 'Branch #3 (up to 30 kg)',
    addressUk: 'вул. Соборна, 85',
    addressEn: '85 Soborna St.',
    maxWeightKg: 30,
    isPostomat: false,
  },
  {
    ref: 'postomat-vin-4412',
    cityRef: 'city-vinnytsia',
    number: '4412',
    nameUk: 'Поштомат №4412 (до 20 кг)',
    nameEn: 'Parcel Locker #4412 (up to 20 kg)',
    addressUk: 'вул. Келецька, 51',
    addressEn: '51 Keletska St.',
    maxWeightKg: 20,
    isPostomat: true,
  },

  // Poltava
  {
    ref: 'branch-pol-1',
    cityRef: 'city-poltava',
    number: '1',
    nameUk: 'Відділення №1 (Вантажне до 1100 кг)',
    nameEn: 'Branch #1 (Freight up to 1100 kg)',
    addressUk: 'вул. Європейська, 150',
    addressEn: '150 Yevropeyska St.',
    maxWeightKg: 1100,
    isPostomat: false,
  },
  {
    ref: 'branch-pol-5',
    cityRef: 'city-poltava',
    number: '5',
    nameUk: 'Відділення №5 (до 30 кг)',
    nameEn: 'Branch #5 (up to 30 kg)',
    addressUk: 'вул. Соборності, 46',
    addressEn: '46 Sobornosti St.',
    maxWeightKg: 30,
    isPostomat: false,
  },

  // Dnipro
  {
    ref: 'branch-dnipro-1',
    cityRef: 'city-dnipro',
    number: '1',
    nameUk: 'Відділення №1 (Вантажне до 1100 кг)',
    nameEn: 'Branch #1 (Freight up to 1100 kg)',
    addressUk: 'вул. Маршала Малиновського, 98а',
    addressEn: '98a Marshala Malynovskoho St.',
    maxWeightKg: 1100,
    isPostomat: false,
  },
  {
    ref: 'branch-dnipro-7',
    cityRef: 'city-dnipro',
    number: '7',
    nameUk: 'Відділення №7 (до 30 кг)',
    nameEn: 'Branch #7 (up to 30 kg)',
    addressUk: 'просп. Дмитра Яворницького, 65',
    addressEn: '65 Dmytra Yavornytskoho Ave.',
    maxWeightKg: 30,
    isPostomat: false,
  },

  // Kropyvnytskyi (Central Agro Heartland)
  {
    ref: 'branch-krop-1',
    cityRef: 'city-kropyvnytskyi',
    number: '1',
    nameUk: 'Відділення №1 (Вантажне відділення для агропідприємств)',
    nameEn: 'Branch #1 (Heavy Freight Agro Hub)',
    addressUk: 'вул. Родімцева, 1',
    addressEn: '1 Rodimtseva St.',
    maxWeightKg: 1100,
    isPostomat: false,
  },

  // Cherkasy
  {
    ref: 'branch-cher-1',
    cityRef: 'city-cherkasy',
    number: '1',
    nameUk: 'Відділення №1 (Вантажне до 1100 кг)',
    nameEn: 'Branch #1 (Freight up to 1100 kg)',
    addressUk: 'вул. Чигиринська, 11',
    addressEn: '11 Chyhyrynska St.',
    maxWeightKg: 1100,
    isPostomat: false,
  }
];

export function getBranchesForCity(cityRef: string, filterPostomats?: boolean): NovaPoshtaBranch[] {
  const list = NP_BRANCHES.filter(b => b.cityRef === cityRef);
  if (list.length > 0) {
    if (filterPostomats === true) return list.filter(b => b.isPostomat);
    if (filterPostomats === false) return list.filter(b => !b.isPostomat);
    return list;
  }
  
  // Fallback dynamic branch generation for any chosen city in Ukraine
  return [
    {
      ref: `${cityRef}-branch-1`,
      cityRef: cityRef,
      number: '1',
      nameUk: 'Відділення №1 (Вантажне до 1100 кг, прийом каністр ЗЗР)',
      nameEn: 'Branch #1 (Freight up to 1100 kg)',
      addressUk: 'вул. Центральна, 1',
      addressEn: '1 Tsentralna St.',
      maxWeightKg: 1100,
      isPostomat: false,
    },
    {
      ref: `${cityRef}-branch-2`,
      cityRef: cityRef,
      number: '2',
      nameUk: 'Відділення №2 (до 30 кг)',
      nameEn: 'Branch #2 (up to 30 kg)',
      addressUk: 'вул. Шевченка, 24',
      addressEn: '24 Shevchenka St.',
      maxWeightKg: 30,
      isPostomat: false,
    },
    {
      ref: `${cityRef}-postomat-1`,
      cityRef: cityRef,
      number: '5501',
      nameUk: 'Поштомат №5501 (до 20 кг)',
      nameEn: 'Parcel Locker #5501 (up to 20 kg)',
      addressUk: 'вул. Незалежності, 15',
      addressEn: '15 Nezalezhnosti St.',
      maxWeightKg: 20,
      isPostomat: true,
    }
  ];
}
