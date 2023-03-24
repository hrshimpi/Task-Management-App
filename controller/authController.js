const User = require('../models/Users');
const jwt = require('jsonwebtoken');



const handleError = ( err ) => {
    
    let errors = { email:'', password:'',username:''};

    if ( err.message === 'Incorrect email'){
        errors.email = 'This email or username is not registered';
        return errors;
    }
    if( err.message === 'Incorrect password' ){
        errors.password = 'Invalid Credentials';
        return errors;
    }

    //duplicate error code
    if ( err.code === 11000 ) {
        if(err.keyValue.email){
            errors.email = 'This email is already registered, please login!';
        }
        if(err.keyValue.username){
            errors.username = 'user already registered!';
        }
        return errors;
    }

    //vaidation error
    if( err.message.includes('user validation failed') ){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign( { id }, 'MY_JWT_SECRET_KEY',
        {
            expiresIn: maxAge
        });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    
    const { username, email, password, name, age } = req.body;   
    try {
        const user = await User.create({ username, email, password, name, age });
        console.log(user);
        res.status(201).json({user:user._id});
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const { email,password } = req.body;
    
    //using promise chaining
    User.login(email,password)
        .then((user)=>{
            console.log("user is loging--")
            const Token = createToken(user._id);
            req.session.jwt = Token;
            req.session.save();
            res.status(200).send( { user: user._id } ); 
        })
        .catch((err)=>{
            let errors = handleError(err);
            res.status(400);
            console.log(" --- This error is working---")
            res.json({errors});
        })
}

module.exports.logout_get = async (req, res)=>{
    req.session.destroy();
    res.redirect('/login');
}


module.exports.updateProfile = async (req, res)=>{
    let uid = req.params.id;
    try {
        const user = await User.findById(uid);
        if( user === null ){
            return res.status(400).json({message:"user does not exists"});
        }

        if(req.body.profile !== null){
            user.profile = req.file.path;
        }
        await user.save();
        res.status(201).redirect('/');
    } catch (err) {
        res.status(400).json({message:err.message});
    }
}
