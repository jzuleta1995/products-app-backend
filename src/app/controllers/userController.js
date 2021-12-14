const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try{
        let user = await User.findOne({ username });

        if(user){
            return res.status(400).json({ msg: 'User already exist!' });
        }

        user = new User(req.body);

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            res.json({ token });
        });
    }catch(error){
        console.log(error);
        res.status(500).send('An error has ocurred!');
    }
}

exports.getUsers = async (req, res) => {
    try{
        let users = await User.find().select('-password').sort({ name: 1 });

        if(!users){
            return res.status(404).json({msg: 'No Users in the database'});
        }

        return res.json({users});
    }catch(error){
        console.log(error);
        res.status(500).send('An error has ocurred!');
    }
}

exports.updateUser = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, password, role } = req.body;

    const newUser = {};

    if(name){
        newUser.name = name;
    }

    if(password){
        newUser.password = password;
    }

    if(role){
        newUser.role = role;
    }

    try{
        let user = await User.findById(req.params.id);

        if(!user){
            return req.status(400).json({msg: 'User not found'});
        }

        user = await User.findByIdAndUpdate({_id: req.params.id}, { $set: newUser }, {new: true});

        res.json({user});
    }catch(error){
        console.log(error);
        res.status(500).send('Internal server error');
    }
}

exports.deleteUser = async (req, res) => {
    try{
        let user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }

        user = await User.findByIdAndDelete({_id: req.params.id});

        res.json({msg: 'User removed!'});
    }catch(error){
        console.log(error);
        res.status(500).send('Internal server error');
    }
}