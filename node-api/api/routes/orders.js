const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const OrderController = require('../controllers/order');

router.get('/:productId', authMiddleware, OrderController.getAll);

router.post('/', OrderController.create);

router.get('/:oid', authMiddleware, OrderController.getById);

router.delete('/:oid', authMiddleware, OrderController.delete);

router.post('/mark-as-done', authMiddleware, OrderController.markAsDone)

module.exports = router;
