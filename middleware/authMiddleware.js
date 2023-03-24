const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const requireAuth = (req ,res, next) => {

    const token = req.session.jwt;
    if( token ){
        // eslint-disable-next-line no-unused-vars
        jwt.verify(token, 'MY_JWT_SECRET_KEY', (err, decodedtoken )=>{
            //when the token is invalid
            console.log("JWT:--> ",token);
            if( err ){
                res.redirect('/login');
            }else{
                next();
            }
        })
    }else{
        res.redirect('/login');
    }
}


const checkUser = (req, res, next ) => {

    const token = req.session.jwt;
    if(token){
        jwt.verify(token, 'MY_JWT_SECRET_KEY', async (err, decodedtoken )=>{
            //when the token is invalid
            if( err ){
                res.locals.user = null;
                next();
            }else{
                let user = await User.findById(decodedtoken.id);
                req.userId = user._id || null;
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };