const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getAll = (req, res, next) => {
    Product.find()
        .select('name price _id productImage description userId createdAt')
        .sort({
            createdAt: 'desc'
        })
        .populate('userId', 'email _id')
        .exec().then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    if (doc.description.length > 100) {
                        doc.description = doc.description.substring(0, 100) + '...';
                    }
                    return {
                        doc,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/products/${doc._id}`
                        }
                    }
                })
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

exports.getUserProducts = (req, res, next) => {
    const userId = req.userData.userId;

    Product.find({
            userId: userId
        })
        .sort({
            createdAt: 'desc'
        })
        .populate('userId', 'email _id').exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                result
            });
        })
        .catch(err => res.status(500).json({
            error: err
        }))
}

exports.create = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        productImage: req.file.path,
        userId: req.userData.userId
    });
    product.save().then(result => {
        res.status(201).json({
            message: 'Product created successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                userId: req.userData.userId,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.getById = (req, res, next) => {
    Product.findById(req.params.pid)
        .select('name price _id productImage description userId createdAt')
        .populate('userId', 'email _id')
        .exec().then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCTS',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.update = (req, res, next) => {
    // data from front end should come like this
    // [
    //     { "propName": "name", "value": "new name" },
    //     { "propName": "price", "value": "19.99" }
    // ]
    const id = req.params.pid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
        _id: id
    }, {
        $set: updateOps
    }).exec().then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: `http://localhost:3000/products/${id}`
            }
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.delete = (req, res, next) => {
    Product.remove({
        _id: req.params.pid
    }).exec().then(result => {
        return this.getUserProducts(req, res, next);
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
};

exports.deleteAll = (req, res, next) => {
    Product.remove()
        .exec()
        .then(response => {
            res.status(200).json({
                message: 'All products removed'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};