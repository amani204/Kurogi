const buildWhatsAppLink = (phone, message) => {
  const clean = phone.replace(/[^0-9]/g, ''); // wa.me needs digits only, country code included
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
};

module.exports = { buildWhatsAppLink };