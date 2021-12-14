const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/',
    authController.authenticateUser
);

router.get('/',
    auth,
    authController.userAuthenticate
);

module.exports = router;