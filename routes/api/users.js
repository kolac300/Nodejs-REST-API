

const logoutMiddleware = require("../../middlewares/logout")
const currentUser = require("../../middlewares/current")
const Joi = require('joi');
const Jimp = require('jimp');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where you want to store the files
        cb(null, 'avatars/');
    },
    filename: function (req, file, cb) {
        // Use the original filename for the uploaded file
        cb(null, file.originalname);
    }
});



const upload = multer({ storage: storage });

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

const { loginUser, updateSubscription } = require('../../controller/auth')
const { createUser, uploadAvatar } = require('../../modells/user')

router.post("/register", async function register(req, res, next) {
    const result = schemaRegister.validate(req.body);
    if (result.error) {
        return res.status(400).json({ message: result.error.details })
    }
    const { password, email, subscription = "starter" } = req.body
    try {
        await createUser(email, password, subscription)
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

})
router.patch("/avatars", currentUser, upload.single('avatar'), async (req, res, next) => {


    try {
        const uploadedFile = req.file;
        const image = await Jimp.read(uploadedFile.path);
        image.resize(250, 250) // resize
        await image.writeAsync(uploadedFile.path);



        const { email } = req.currentUser
        const { filename } = req.file
        const updatedUser = await uploadAvatar(email, filename)





        return res.status(200).json(updatedUser);
    } catch (error) {

        res.status(401).json({
            "message": "Not authorized"
        })
    }
}
);





module.exports = router



