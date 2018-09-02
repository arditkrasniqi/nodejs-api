const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(response => {
                    console.log(response);
                    res.status(201).json({
                        message: 'User created'
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                })
        }
    });
};

exports.login = (req, res, next) => {
    User.findOne({
            email: req.body.email
        }).exec()
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({
                                email: req.body.email,
                                userId: user._id
                            },
                            process.env.JWT_KEY, {
                                expiresIn: '1h'
                            }
                        );
                        res.status(200).json({
                            message: 'Auth successful',
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            message: 'Auth failed'
                        });
                    }
                });
            } else {
                res.status(401).json({
                    message: 'Auth failed'
                });
            }
        })
};

exports.delete = (req, res, next) => {
    User.deleteOne({
            _id: req.params.userId
        }).exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};