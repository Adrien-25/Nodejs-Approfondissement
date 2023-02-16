const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    const userId = decoded.userId;
    // const user = await User.findById(decoded.id);
    req.user = decoded;
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
