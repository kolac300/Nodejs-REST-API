const jwt = require('jsonwebtoken')
const User = require("../controller/auth");

function auth(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
    const [bearer, token] = authHeader.split(' ', 2)
    if (bearer === "Bearer")
        jwt.verify(token, process.env.JWT_SECRET, (async (err, decoded) => {
            if (err) return res.status(401).json({ message: "invalid token" });
            const user = await User.findOne({ _id: decoded.id })
            if (user)
                req.user = decoded.id

        }))
    return next()
}

module.exports = auth