const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: [true,'please enter an username'],
        unique:true
    },
    email: { 
        type:String, 
        required: [true,'please enter an email'], 
        unique:true,
        lowercase:true,
        validate:[ isEmail, 'please enter a valid email']
    },
    password: { 
        type:String, 
        required:[true,'please enter the password'] ,
        minLength:[3,'minimum password length is 3 chars']
    },
    name:{
        type:String,
        required: [true,'please enter your name']
    },
    age:{
        type:Number,
        required:[true,'please enter your age']
    },
    profile:{
        type: String,
    }
}); 

userSchema.statics.login = async function(email, password){

    const user = await this.findOne({ $or: [{ "username":email }, { "email":email }] });
    
    if( user ){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw new Error('Incorrect password');
    }else{
        throw new Error('Incorrect email');
    }
}

userSchema.pre('save', async function(next){
    const user = this;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
})


const User = mongoose.model('user',userSchema);

module.exports = User;