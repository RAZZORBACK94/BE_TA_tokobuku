const md5 = require("md5");

const jwt = require("jsonwebtoken");

const userModel = require("../models/index").user;

const secret = "moklet";

exports.authenticate = async (request, response) => {
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

exports.authorize = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("")[1];

    let verivedUser = jwt.verify(token, secret);

    if (!verivedUser) {
      return response.json({
        success: false,
        auth: false,
        message: "User Unauthorize",
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
