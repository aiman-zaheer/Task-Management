const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAccessToken = (ss) => {
  const accessToken = jwt.sign(
    { name: ss.name, email: ss.email, role: ss.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "20m" }
  );
  return accessToken;
};
const getRefreshToken = (ss) => {
  const refreshToken = jwt.sign(
    { name: ss.name, email: ss.email, role: ss.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "14d" }
  );
  return refreshToken;
};
const encryptedPassword = async (password) => {
  const saltRounds = Number(process.env.HASH_ROUNDS);
  try {
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
  } catch (err) {
    console.log(err);
  }
};
const decryptedPassword = async (password, ss) => {
    try {
        const decryptedPassword = await bcrypt.compare(password, ss.password);
        return decryptedPassword;
    } catch(err){
        console.log(err);
    }
};
module.exports = {
  getAccessToken,
  getRefreshToken,
  encryptedPassword,
  decryptedPassword,
};