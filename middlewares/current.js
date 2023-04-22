const jwt = require('jsonwebtoken')
const User = require("../controller/auth");

function currentUser(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ "message": "Not authorized" });
    const [bearer, token] = authHeader.split(' ', 2)
    if (bearer === "Bearer")
        jwt.verify(token, process.env.JWT_SECRET, (async (err, decoded) => {
            if (err) return res.status(401).json({ message: "invalid token" });
            const user = await User.findOne({ token })

            if (user)
                return res.status(200).json({
                    "email": user.email,
                    "subscription": user.subscription
                })
            else return res.status(401).json({ "message": "Not authorized" })
        }))

}

module.exports = currentUser