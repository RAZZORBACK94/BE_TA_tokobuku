exports.IsUser = async (request, response, next) => {
  console.log(request.user.role_user);
  if (request.user.role_user == "pengguna") {
    next();
  } else {
    return response.status(401).json({
      success: false,
      auth: false,
      message: "forbidden, You Not User",
    });
  }
};

exports.IsAdmin = async (request, response, next) => {
  if (request.user.role_user == "admin") {
    next();
  } else {
    return response.status(401).json({
      success: false,
      auth: false,
      message: "forbidden, You Not Admin",
    });
  }
};
