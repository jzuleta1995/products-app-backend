const jwt = require('jsonwebtoken');

const TOKEN_HEADER = 'x-auth-token';

module.exports = function(req, res, next){
    const token = req.header(TOKEN_HEADER);

    if(!token){
        return res.status(401).json({msg: 'Not Token, Invalid permission!'})
    }

    try{
        const encryption = jwt.verify(token, process.env.SECRET_KEY);
        req.user = encryption.user;
        next();
    }catch(error){
        res.status(401).json({msg: 'Token Invalid'});
    }
}