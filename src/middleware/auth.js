const jwt = require("jsonwebtoken");
const User = require("../modal/user");
const {JWT_SECRET} =require("../utils/secrets")
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
