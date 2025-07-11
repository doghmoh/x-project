const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');
const { createCategoryValidator } = require('../validators/categoryValidator');

router.get('/', controller.getAll);
router.post('/', createCategoryValidator, controller.create);

module.exports = router;