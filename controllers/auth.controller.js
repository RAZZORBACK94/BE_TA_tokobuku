const md5 = require("md5");

const jwt = require("jsonwebtoken");

const userModel = require("../models/index").user;

const secret = "moklet";

const authenticate = async (request, response) => {
  // login
  let dataLogin = {
    username_user: request.body.username_user,
    password_user: md5(request.body.password_user),
  };
  let dataUser = await userModel.findOne({ where: dataLogin });

  console.log(dataUser);

  if (dataUser) {
    let payload = JSON.stringify(dataUser);
    console.log(payload);

    let tkn = jwt.sign(payload, secret);

    return response.json({
      success: true,
      logged: true,
      message: "berhasil authentication",
      tkn: tkn,
      data: dataUser,
    });
  }
  return response.json({
    success: false,
    logged: false,
    message: "Invalid username dan password",
  });
};

//Done no Error
const authorize = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let verivedUser;
    try {
      verivedUser = jwt.verify(token, secret);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return response.status(400).json({
          message: "token expired",
          err: error,
        });
      }
      return response.status(400).json({
        message: "Auth Invalid",
        err: error,
      });
    }
    request.user = verivedUser;
    next();
  } else {
    return response.json({
      success: false,
      auth: false,
      message: "USer Unauthorize",
    });
  }
};

module.exports = { authorize, authenticate };
