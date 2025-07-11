const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const { createProductValidator } = require('../validators/productValidator');

router.get('/', controller.getAll);
router.post('/', createProductValidator, controller.create);

module.exports = router;