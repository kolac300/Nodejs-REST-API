

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


const schemaUpdateSubscription = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', "business").required()
});

const router = require('express').Router();

const { registerUser, loginUser, updateSubscription } = require('../../controller/auth')


router.post("/register", async function register(req, res, next) {
    const result = schemaRegister.validate(req.body);
    if (result.error) {
        return res.status(400).json({ message: result.error.details })
    }
    const { password, email, subscription = "starter" } = req.body
    try {
        await registerUser(email, password, subscription)
        return res.status(201).json({ user: { email, subscription } })
    } catch (error) {
        return res.status(409).json({ message: error.message })
    }
});

router.post("/login", async function login(req, res, next) {
    const result = schemaLogin.validate(req.body);
    if (result.error) {
        return res.status(400).json({ message: result.error.details })
    }
    const { password, email } = req.body
    try {
        const { token, user } = await loginUser(email, password)
        return res.status(200).json({ token, user })
    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
}
);

router.post("/logout", logoutMiddleware, async (req, res, next) => {
    return res.status(204).json("no data");
}

);
router.get("/current", currentUser, async (req, res, next) => {
    return res.status(200).json(req.currentUser);
}
);
router.patch("/", currentUser, async (req, res, next) => {
    const result = schemaUpdateSubscription.validate(req.body);
    if (result.error) {
        return res.status(400).json({ message: result.error.details })
    }
    const { email } = req.currentUser
    const { subscription } = req.body

    const updatedUser = await updateSubscription(email, subscription)
    return res.status(200).json(updatedUser);

}
);






module.exports = router



