export function formatPrice(price, lang = 'fr') {
  // Handle invalid inputs
  if (price === undefined || price === null || isNaN(price)) {
    return lang === 'ar' ? '0 دج' : '0 DA';
  }

  const formattedNumber = new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    maximumFractionDigits: 0,
  }).format(price);

  // Arabic: number + دج (currency after)
  if (lang === 'ar') {
    return `${formattedNumber} دج`;
  }

  // English & French: DA + number (currency before)
  return `${formattedNumber} DA`;
}