const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,'jakubvala');
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        
        if(!user || !user.verification){
            throw new Error("Please authenticate or verify.");
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch(err){
        res.status(401)
            .send({error: err.message});
    }
}

module.exports = auth;