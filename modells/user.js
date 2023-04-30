const { User, bcrypt } = require('../controller/auth')
const gravatar = require('gravatar');


async function createUser(email, password, subscription) {
    const hash = await bcrypt.hash(password, 10)
    const user = await User.findOne({ email })
    if (user !== null) {
        throw new Error("Email in use")
    }
    const avatarURL = await gravatar.url(email)
    await User.create({ password: hash, email, subscription, avatarURL })
}
async function uploadAvatar(email, avatarURL) {
    try {
        const res = await User.findOneAndUpdate(email, { avatarURL }, { new: true })
        return res
    } catch (error) {
        return error
    }
}
module.exports = { createUser, uploadAvatar }