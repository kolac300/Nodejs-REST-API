const { User } = require("../controller/auth");
const jwt = require('jsonwebtoken')


async function logout(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [bearer, token] = authHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const updatedUser = await User.findOneAndUpdate({ _id: decoded.id }, { token: null })

    console.log('first', updatedUser)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


module.exports = logout