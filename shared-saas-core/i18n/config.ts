// i18n Configuration

export interface Locale {
  code: string
  name: string
  nativeName: string
  rtl: boolean
  currency: string
  dateFormat: string
  timeFormat: string
  numberFormat: string
  timezone: string
}

export const locales: Locale[] = [
  {code: 'en', name: 'English', nativeName: 'English', rtl: false, currency: 'USD', dateFormat: 'MM/dd/yyyy', timeFormat: '12h', numberFormat: '1,234.56', timezone: 'UTC'},
  {code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', rtl: false, currency: 'GBP', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Europe/London'},
  {code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, currency: 'EUR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Madrid'},
  {code: 'fr', name: 'French', nativeName: 'Français', rtl: false, currency: 'EUR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Paris'},
  {code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, currency: 'EUR', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Berlin'},
  {code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, currency: 'BRL', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'America/Sao_Paulo'},
  {code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', rtl: false, currency: 'BRL', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'America/Sao_Paulo'},
  {code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, currency: 'CNY', dateFormat: 'yyyy/MM/dd', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Asia/Shanghai'},
  {code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', rtl: false, currency: 'CNY', dateFormat: 'yyyy/MM/dd', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Asia/Shanghai'},
  {code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', rtl: false, currency: 'TWD', dateFormat: 'yyyy/MM/dd', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Asia/Taipei'},
  {code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, currency: 'JPY', dateFormat: 'yyyy/MM/dd', timeFormat: '24h', numberFormat: '1,234', timezone: 'Asia/Tokyo'},
  {code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, currency: 'KRW', dateFormat: 'yyyy. MM. dd', timeFormat: '24h', numberFormat: '1,234', timezone: 'Asia/Seoul'},
  {code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, currency: 'AED', dateFormat: 'dd/MM/yyyy', timeFormat: '12h', numberFormat: '1,234.56', timezone: 'Asia/Dubai'},
  {code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, currency: 'INR', dateFormat: 'dd/MM/yyyy', timeFormat: '12h', numberFormat: '1,234.56', timezone: 'Asia/Kolkata'},
  {code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false, currency: 'THB', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Asia/Bangkok'},
  {code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false, currency: 'VND', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234', timezone: 'Asia/Ho_Chi_Minh'},
  {code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false, currency: 'IDR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Asia/Jakarta'},
  {code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', rtl: false, currency: 'MYR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Asia/Kuala_Lumpur'},
  {code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, currency: 'TRY', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Istanbul'},
  {code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, currency: 'RUB', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Moscow'},
  {code: 'uk', name: 'Ukrainian', nativeName: 'Українська', rtl: false, currency: 'UAH', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Kiev'},
  {code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false, currency: 'PLN', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Warsaw'},
  {code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false, currency: 'EUR', dateFormat: 'dd-MM-yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Amsterdam'},
  {code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, currency: 'EUR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Rome'},
  {code: 'ro', name: 'Romanian', nativeName: 'Română', rtl: false, currency: 'RON', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Bucharest'},
  {code: 'cs', name: 'Czech', nativeName: 'Čeština', rtl: false, currency: 'CZK', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Prague'},
  {code: 'el', name: 'Greek', nativeName: 'Ελληνικά', rtl: false, currency: 'EUR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Athens'},
  {code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true, currency: 'ILS', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Asia/Jerusalem'},
  {code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false, currency: 'SEK', dateFormat: 'yyyy-MM-dd', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Stockholm'},
  {code: 'da', name: 'Danish', nativeName: 'Dansk', rtl: false, currency: 'DKK', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Copenhagen'},
  {code: 'fi', name: 'Finnish', nativeName: 'Suomi', rtl: false, currency: 'EUR', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Helsinki'},
  {code: 'no', name: 'Norwegian', nativeName: 'Norsk', rtl: false, currency: 'NOK', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Oslo'},
  {code: 'hu', name: 'Hungarian', nativeName: 'Magyar', rtl: false, currency: 'HUF', dateFormat: 'yyyy. MM. dd.', timeFormat: '24h', numberFormat: '1 234', timezone: 'Europe/Budapest'},
  {code: 'bg', name: 'Bulgarian', nativeName: 'Български', rtl: false, currency: 'BGN', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Sofia'},
  {code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', rtl: false, currency: 'EUR', dateFormat: 'dd. MM. yyyy.', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Zagreb'},
  {code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', rtl: false, currency: 'EUR', dateFormat: 'dd. MM. yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Bratislava'},
  {code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', rtl: false, currency: 'EUR', dateFormat: 'yyyy-MM-dd', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Vilnius'},
  {code: 'lv', name: 'Latvian', nativeName: 'Latviešu', rtl: false, currency: 'EUR', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Riga'},
  {code: 'et', name: 'Estonian', nativeName: 'Eesti', rtl: false, currency: 'EUR', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1 234,56', timezone: 'Europe/Tallinn'},
  {code: 'sr', name: 'Serbian', nativeName: 'Србиски', rtl: false, currency: 'RSD', dateFormat: 'dd.MM.yyyy.', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Belgrade'},
  {code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', rtl: false, currency: 'EUR', dateFormat: 'dd. MM. yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Ljubljana'},
  {code: 'mk', name: 'Macedonian', nativeName: 'Македонски', rtl: false, currency: 'MKD', dateFormat: 'dd.MM.yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Skopje'},
  {code: 'ca', name: 'Catalan', nativeName: 'Català', rtl: false, currency: 'EUR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Andorra'},
  {code: 'eu', name: 'Basque', nativeName: 'Euskara', rtl: false, currency: 'EUR', dateFormat: 'yyyy/MM/dd', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Bilbao'},
  {code: 'gl', name: 'Galician', nativeName: 'Galego', rtl: false, currency: 'EUR', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1.234,56', timezone: 'Europe/Santiago_de_Compostela'},
  {code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', rtl: false, currency: 'GBP', dateFormat: 'dd/MM/yyyy', timeFormat: '24h', numberFormat: '1,234.56', timezone: 'Europe/London'},
]

export const defaultLocale: Locale = locales[0] // English

export const rtlLocales = locales.filter(l => l.rtl)

export function isRTL(locale: string): boolean {
  return rtlLocales.some(l => l.code === locale)
}

export function getLocale(code: string): Locale {
  return locales.find(l => l.code === code) || defaultLocale
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    BRL: 'R$',
    RUB: '₽',
    THB: '฿',
    VND: '₫',
    IDR: 'Rp',
    MYR: 'RM',
    TRY: '₺',
    UAH: '₴',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    CHF: 'CHF',
    AUD: 'A$',
    CAD: 'C$',
    NZD: 'NZ$',
    SGD: 'S$',
    HKD: 'HK$',
    TWD: 'NT$',
    PHP: '₱',
    AED: 'د.إ',
    ILS: '₪',
    ZAR: 'R',
  }
  return symbols[currency] || currency
}
