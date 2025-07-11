const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const router = require('express').Router();

router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
module.exports = router;