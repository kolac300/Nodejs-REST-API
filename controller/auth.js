const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerSchema = new mongoose.Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    avatarURL: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
    }
});

const User = mongoose.model('users', registerSchema);


async function loginUser(email, password) {
    const user = await User.findOne({ email })
    if (user === null) {
        throw new Error("Email or password is wrong")
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        throw new Error("Email or password is wrong")
    }
    const token = jwt.sign({ email: user.email, subscription: user.subscription, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const loginedUser = await User.findOneAndUpdate({ email }, { email, token, password: user.password }, { new: true })
    return { token, user: { email, subscription: loginedUser.subscription } }
}
async function updateSubscription(email, subscription) {
    const updatedUser = await User.findOneAndUpdate({ email }, { subscription }, { new: true }).catch(err => console.error(err));
    return {
        email: updatedUser.email,
        subscription: updatedUser.subscription
    }
}


module.exports = { loginUser, User, updateSubscription, bcrypt }


