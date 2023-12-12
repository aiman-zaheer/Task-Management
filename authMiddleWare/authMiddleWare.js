const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const sendResponse = (res, data, success, statusCode, message) => {
    res.json({
      resData: data,
      success: success,
      status: statusCode,
      message: message,
    });
  };
const authMiddleWare = (req, res, next) => {
  let authorizationToken;
  if(req.headers["authorization"]){
    authorizationToken = req.headers["authorization"].split(" ")[1];
    if (authorizationToken) {
      jwt.verify(
        authorizationToken,
        process.env.ACCESS_TOKEN_SECRET,
        (error, decode) => {
          if (error) {
            sendResponse(res, null, false, 401, "Unauthorized");
          } else {
            next();
          }
        }
      );
    } else {
      sendResponse(res, null, false, 401, "token not exist");
    }
  }else {
    sendResponse(res, null, false, 401, "Authorization empty");
  }
};
module.exports = authMiddleWare;
