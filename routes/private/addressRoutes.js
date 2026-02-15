const express = require('express');
const router = express.Router();
const { addressController } = require('../../controllers');
const { auth } = require('../../middlewares');

// All address routes are protected
router.use(auth);

// Get all addresses
router.get('/', addressController.getAddresses);

// Get single address
router.get('/:id', addressController.getAddress);

// Create address
router.post('/', addressController.createAddress);

// Update address
router.put('/:id', addressController.updateAddress);

// Set default address
router.put('/:id/set-default', addressController.setDefaultAddress);

// Delete address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
