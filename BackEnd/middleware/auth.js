const { verifyJWT } = require("../utils/generateTokens");

const verifyUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ success: false, messsage: "Please sign in     " });
    }
    let user = await verifyJWT(token);
    req.user = user.id;
    next();
  } catch (error) {}
};

module.exports = verifyUser;