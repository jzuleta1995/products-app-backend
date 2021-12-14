const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('username', 'Username is required').not().isEmpty(),
        check('username').isEmail(),
        check('password', 'Password must be minimun 8 characters').isLength({min: 8})
    ],
    UserController.createUser
);

router.get('/',
    auth,
    UserController.getUsers
);

router.put('/:id',
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password must be minimun 8 characters').isLength({min: 8})
    ],
    UserController.updateUser
);

router.delete('/:id',
    auth,
    UserController.deleteUser
);

module.exports = router;