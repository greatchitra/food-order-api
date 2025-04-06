const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    role : {
        type: String,
        enum: ['admin', 'user', 'restaurant_owner'],
        default: 'user'
    },
    imageUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png",
    },
    otp: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otpExpiry: {
         type: Date 
        },
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
};

userSchema.methods.validatePassword = async function (PasswordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(PasswordInputByUser, passwordHash);
    return isPasswordValid;
};


const User = mongoose.model('User', userSchema);
module.exports = User;