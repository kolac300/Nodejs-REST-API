const { User, bcrypt } = require('../controller/auth')
const gravatar = require('gravatar');
const { sendEmail } = require("../helpers/index")
const crypto = require('crypto')


async function createUser(email, password, subscription) {
    const hash = await bcrypt.hash(password, 10)
    const user = await User.findOne({ email })
    if (user !== null) {
        throw new Error("Email in use")
    }
    const avatarURL = await gravatar.url(email)
    const verificationToken = crypto.randomUUID()
    await User.create({ password: hash, email,verificationToken, subscription, avatarURL })
    await sendEmail({ to: email, subject: `welcome ${email}`, html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm your Email</a>` })
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