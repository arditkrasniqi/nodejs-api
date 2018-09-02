const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.getAll = (req, res, next) => {
    Order.find({
            product: req.params.productId,
            markAsDone: false
        })
        .sort({
            createdAt: 'desc'
        })
        .select('_id quantity product createdAt')
        .populate('product', 'name')
        .exec()
        .then(orders => {
            res.status(200).json(orders)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.markAsDone = (req, res, next) => {
    Order.update({
            _id: req.body.orderId
        }, {
            $set: {
                markAsDone: req.body.markAsDone
            }
        }).exec()
        .then(response => {
            req.params.productId = req.body.productId;
            return this.getAll(req, res, next);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.create = (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    Product.findById(req.body.productId).exec().then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found.'
            });
        }
        order.save()
            .then(result => {
                res.status(201).json({
                    message: 'Order created',
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/orders/${order._id}`
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            })
    })
};

exports.getById = (req, res, next) => {
    const id = req.params.oid;
    Order.findById(id)
        .select('_id quantity product')
        .populate('product')
        .exec()
        .then(order => {
            res.status(200).json(order)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
};

exports.delete = (req, res, next) => {
    Order.remove({
            _id: req.params.oid
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                response: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};