const productRoutes = require('./productRoutes');
const stockoutRoutes = require('./stockoutRoutes');
const stockinRoutes = require('./stockinRoutes');
const customerRoutes = require('./customerRoutes');
const supplierRoutes = require('./supplierRoutes');
const operatorRoutes = require('./operatorRoutes');
const categoryRoutes = require('./categoryRoutes');
const router = require('express').Router();

router.use('/product', productRoutes);
router.use('/stockout', stockoutRoutes);
router.use('/stockin', stockinRoutes);
router.use('/customer', customerRoutes);
router.use('/supplier', supplierRoutes);
router.use('/operator', operatorRoutes);
router.use('/category', categoryRoutes);
module.exports = router;