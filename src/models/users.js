const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./tasks.js');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valida!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length < 6){
                throw new Error("Password must be lenght 6 or greated.");
            }
            else if(value.toLowerCase().includes('password')){
                throw new Error("Password cannot contain the word \"password\"");
            }
        }
    },
    nick: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(value.length < 3){
                throw new Error("Nick name must have at least 3 characters.");
            }
        }
    },
    age: {
        type: Number,
        required: false,
        validate(value){
            if(value < 0 || value > 160){
                throw new Error("Your age is invalid.");
            }
        }
    },
    verification: {
        type: Boolean,
        default: false
    },
    avatar:{
        type: Buffer,
        required: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this;

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    
    return userObject;
}
//method to create an jwt token and save it to token user array
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'jakubvala');
    user.tokens = user.tokens.concat({token: token});
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email});
    if(!user){
        throw new Error("No user with these credentials.");
    }
    const validation = await bcrypt.compare(password, user.password);

    if(!validation){
        throw new Error("Unable to login!");
    }

    return user;
}

userSchema.pre('save', async function (next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id});

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
