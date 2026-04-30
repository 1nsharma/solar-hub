const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProductsAndServices);
router.get('/services', productController.getServices);

module.exports = router;
