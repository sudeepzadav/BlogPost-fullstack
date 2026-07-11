const jwt = require("jsonwebtoken");
async function generateJWT(payload) {
  let token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}
async function verifyJWT(token) {
  try {
    let data = await jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    return false;
  }
}

module.exports = { generateJWT, verifyJWT };