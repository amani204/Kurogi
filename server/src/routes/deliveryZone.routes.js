const express = require('express');
const router = express.Router();
const { getDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone } = require('../controllers/deliveryZone.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, deliveryZoneCreateRules, deliveryZoneUpdateRules } = require('../middleware/validators');

router.get('/', getDeliveryZones); // public — checkout needs this

router.post('/', protect, authorize('owner'), deliveryZoneCreateRules, validate, createDeliveryZone);
router.put('/:id', protect, authorize('owner'), deliveryZoneUpdateRules, validate, updateDeliveryZone);
router.delete('/:id', protect, authorize('owner'), deleteDeliveryZone);

module.exports = router;