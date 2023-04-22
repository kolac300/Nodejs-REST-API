

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logoutMiddleware = require("../../middlewares/logout")
const currentUser = require("../../middlewares/current")
const Joi = require('joi');

const schemaRegister = Joi.object({
    password: Joi.string().required().min(6).max(20),
    email: Joi.string().email().required(),
    subscription: Joi.string().valid('starter', 'pro', "business")
});
const schemaLogin = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
});

const router = require('express').Router();

const User = require("../../controller/auth")


router.post("/register", async (req, res, next) => {



    const result = schemaRegister.validate(req.body);
    if (result.error) {
        return res.status(400).json({ message: result.error.details })
    }
    const { password, email, subscription = "starter" } = req.body
    const hash = await bcrypt.hash(password, 10)

    try {
        console.log('first', User)
        const user = await User.findOne({ email })
        if (user !== null) {
            return res.status(409).json({ massege: "Email in use" })
        }

        await User.create({ password: hash, email, subscription })

        return res.status(201).json({ user: { email, subscription } })
    } catch (error) {

        return res.status(404).json({ massege: error })
    }

});



router.post("/login", async (req, res, next) => {
    const { password, email } = req.body

    const result = schemaLogin.validate(req.body);
    if (result.error) {
        return res.status(400).json({ message: result.error.details })
    }
    try {
        const user = await User.findOne({ email })
        if (user === null) {
            return res.status(401).json({ massege: "Email or password is wrong" })
        }
        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Internal Server Error" })
            }
            if (result) {
                const token = jwt.sign({ email: user.email, subscription: user.subscription, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
                const loginedUser = await User.findOneAndUpdate({ email }, { email, token, password: user.password }, { new: true })
                return res.status(200).json({
                    token,
                    user: {
                        email,
                        subscription: loginedUser.subscription,
                    }
                });
            } else {
                return res.status(401).json({ message: "Email or password is wrong" })
            }
        })
    } catch (error) {
        return res.status(404).json({ massege: error })
    }
}
);


router.post("/logout", logoutMiddleware, async (req, res, next) => {
    return res.status(204).json();
}

);
router.get("/current", currentUser, async (req, res, next) => {
    return res.status(200).json();

}
);






module.exports = router



