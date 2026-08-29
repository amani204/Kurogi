const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
];

const loginRules = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const bookingRules = [
  body('customerName').trim().notEmpty().isLength({ max: 100 }),
  body('phone').trim().matches(/^[0-9+\s-]{8,15}$/),
  body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body('partySize').isInt({ min: 1, max: 30 }).toInt(),
  body('date').isISO8601().toDate(),
  body('timeSlot').trim().notEmpty(),
  body('specialRequests').optional().trim().isLength({ max: 300 }),
];

const orderRules = [
  body('customerName').trim().notEmpty().isLength({ max: 100 }),
  body('phone').trim().matches(/^[0-9+\s-]{8,15}$/),
  body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body('fulfillment').isIn(['delivery', 'pickup']),
  body('address').if(body('fulfillment').equals('delivery')).trim().notEmpty().isLength({ max: 300 }),
  body('deliveryZoneId').if(body('fulfillment').equals('delivery')).isMongoId().withMessage('Select a delivery zone'),
  body('items').isArray({ min: 1 }),
  body('items.*.menuItemId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1, max: 50 }),
  body('notes').optional().trim().isLength({ max: 300 }),
];

const menuItemRules = [
  body('slug').trim().toLowerCase().matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase letters, numbers, and hyphens only').isLength({ max: 60 }),
  body('name.en').trim().notEmpty().isLength({ max: 100 }),
  body('name.fr').trim().notEmpty().isLength({ max: 100 }),
  body('name.ar').trim().notEmpty().isLength({ max: 100 }),
  body('description.en').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('description.fr').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('description.ar').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('price').isFloat({ min: 0 }).toFloat(),
  body('category').trim().notEmpty().toLowerCase(),
  body('photoUrl').trim().notEmpty().withMessage('Photo URL is required').isURL().withMessage('photoUrl must be a valid URL'),
  body('available').optional().isBoolean(),
  body('featured').optional().isBoolean(),
];
const categoryCreateRules = [
  body('slug').trim().toLowerCase().matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase letters, numbers, and hyphens only').isLength({ max: 40 }),
  body('label.en').trim().notEmpty().isLength({ max: 50 }),
  body('label.fr').trim().notEmpty().isLength({ max: 50 }),
  body('label.ar').trim().notEmpty().isLength({ max: 50 }),
  body('order').optional().isInt({ min: 0 }).toInt(),
];

const categoryUpdateRules = [
  body('label.en').trim().notEmpty().isLength({ max: 50 }),
  body('label.fr').trim().notEmpty().isLength({ max: 50 }),
  body('label.ar').trim().notEmpty().isLength({ max: 50 }),
  body('order').optional().isInt({ min: 0 }).toInt(),
];

const deliveryZoneCreateRules = [
  body('wilaya').trim().notEmpty().isLength({ max: 100 }),
  body('price').isFloat({ min: 0 }).toFloat(),
];

const deliveryZoneUpdateRules = [
  body('price').isFloat({ min: 0 }).toFloat(),
];

const restaurantSettingsRules = [
  body('name').optional().trim().isLength({ max: 100 }),
  body('capacityPerSlot').optional().isInt({ min: 1 }).toInt(),
  body('slotLengthMinutes').optional().isInt({ min: 15 }).toInt(),
  body('hours').optional().isArray(),
  body('hours.*.day').optional().isIn(['mon','tue','wed','thu','fri','sat','sun']),
  body('hours.*.open').optional({ checkFalsy: true }).matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('open must be HH:mm'),
  body('hours.*.close').optional({ checkFalsy: true }).matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('close must be HH:mm'),
  body('contact.phone').optional({ checkFalsy: true }).trim().matches(/^[0-9+\s-]{8,20}$/),
  body('contact.whatsapp').optional({ checkFalsy: true }).trim().matches(/^[0-9+\s-]{8,20}$/),
  body('contact.email').optional({ checkFalsy: true }).trim().isEmail().normalizeEmail(),
  body('contact.address').optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
  body('contact.facebook').optional({ checkFalsy: true }).trim().isURL().withMessage('facebook must be a valid URL'),
  body('contact.instagram').optional({ checkFalsy: true }).trim().isURL().withMessage('instagram must be a valid URL'),
];

module.exports = {
  validate,
  registerRules, loginRules,
  bookingRules,
  orderRules,
  menuItemRules,
  categoryCreateRules, categoryUpdateRules,
  deliveryZoneCreateRules, deliveryZoneUpdateRules,
  restaurantSettingsRules,
};