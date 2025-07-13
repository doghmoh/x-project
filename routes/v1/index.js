const productRoutes = require('./productRoutes');
const operatorRoutes = require('./operatorRoutes');
const storeRoutes = require('./storeRoutes');
const categoryRoutes = require('./categoryRoutes');
const router = require('express').Router();

router.use('/product', productRoutes);
router.use('/operator', operatorRoutes);
router.use('/store', storeRoutes);
router.use('/category', categoryRoutes);
module.exports = router;