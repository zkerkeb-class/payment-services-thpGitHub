const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

router.post('/create-payment-intent', PaymentController.createPaymentIntent);
router.post('/webhook', express.raw({type: 'application/json'}), PaymentController.handleWebhook);

module.exports = router; 