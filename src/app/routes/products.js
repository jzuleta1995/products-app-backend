const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/',
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty()
    ],
    ProductController.uploadImg,
    ProductController.createProduct
);

router.get('/',
    auth,
    ProductController.getProducts
);

router.put('/:id',
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty()
    ],
    ProductController.uploadImg,
    ProductController.updateProduct
);

router.delete('/:id',
    auth,
    ProductController.deleteProduct
);

module.exports = router;