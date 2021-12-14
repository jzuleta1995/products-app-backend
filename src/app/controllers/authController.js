const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try{
        let user = await User.findOne( { username });

        if(!user){
            return res.status(400).json({msg: `User does not exist!`});
        }

        const isValidPassword = await bcryptjs.compare(password, user.password);

        if(!isValidPassword){
            return res.status(400).json({ msg: 'Password is incorrect!' });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600 //1 Hour
        }, (error, token) => {
            if(error) throw error;

            res.json({ token });
        });
    }catch(error){
        console.log(error);
    }
}

exports.userAuthenticate = async (req, res) => {
    try{
        const user = await user.findOne(req.user.id).select('-password');
        res.json({ user });
    }catch(error){
        console.log(error);
    }
}