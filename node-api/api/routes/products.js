const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middlewares/auth');
const ProductController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // accepts the file
    } else {
        cb(new Error('Only image/jpeg and image/png files are allowed to be uploaded.'), false); // rejects the file
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: fileFilter
})

router.get('/', ProductController.getAll);

router.post('/', authMiddleware, upload.single('productImage'), ProductController.create);

router.get('/id/:pid', ProductController.getById);

router.get('/me', authMiddleware, ProductController.getUserProducts);

router.patch('/:pid', authMiddleware, ProductController.update);

router.delete('/:pid', authMiddleware, ProductController.delete);

router.delete('/', ProductController.deleteAll);

module.exports = router;