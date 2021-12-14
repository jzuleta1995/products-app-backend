const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const multer = require('multer');


//handle storagefiles
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './src/app/uploads');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

exports.uploadImg = multer({storage: storage}).single('image');

exports.createProduct = async (req, res) => {
    const errors = validationResult(req.body);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{

        const { name } = req.body;

        let product = await Product.findOne({name});
        if(product){
            return res.status(400).json({msg: 'Product already exist!'});
        }

        product = new Product(req.body);
        product.user = req.user.id;

        console.log(req.file);
        if(req.file){
            product.image = req.file.filename;
        }
        
        product.save();

        res.status(201).json(product);
    }catch(error){
        console.log(error);
    }
}

exports.getProducts = async (req, res) => {
    try{
        const products = await Product.find().sort({name: -1});

        if(!products){
            res.status(404).send({msg: 'No Products in the database'});
        }

        res.json({products});
    }catch(error){
        console.log(error);
        req.status(500).send('An error has ocurred');
    }
}

exports.updateProduct = async (req, res) => {
    const errors = validationResult(req.body);

    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
    }

    const { name, price, quantity, description } = req.body;

    const newProduct = {};

    if(name){
        newProduct.name = name;
    }

    if(price){
        newProduct.price = price;
    }

    if(quantity){
        newProduct.quantity = quantity;
    }

    if(req.file){
        newProduct.image = req.file.filename;
    }

    if(description){
        newProduct.description = description;
    }

    try{
        let product = Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({msg: 'Product not found'});
        }

        product = await Product.findByIdAndUpdate({_id: req.params.id}, {$set: newProduct}, {new: true});

        res.json({product});
    }catch(error){
        console.log(error);
        res.status(500).send('Internal server error');
    }
}

exports.deleteProduct = async (req, res) => {
    try{
        let product = await Product.findById(req.params.id);

        if(!product){
            return res.json(404).send({msg: 'Product not found'});
        }

        product = await Product.findByIdAndDelete({_id: req.params.id});

        res.json({msg: 'Product removed'});
    }catch(error){
        console.log(error);
        return res.status(500).send('Internal server error');
    }
}