const { validationResult, body } = require("express-validator");

const validateUser = [
  body("nama_user").notEmpty().withMessage("nama tidak boleh kosong"),
  body("jk_user").notEmpty().withMessage("jenis kelamin tidak boleh kosong"),
  body("alamat_user").notEmpty().withMessage("alamat tidak boleh kosong"),
  body("telepon_user").notEmpty().withMessage("telepon tidak boleh kosong"),
  body("username_user").notEmpty().withMessage("username tidak boleh kosong"),
  body("password_user").notEmpty().withMessage("password tidak boleh kosong"),

  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      let ermessage = errors
        .array()
        .map((it) => it.msg)
        .join(",");
      return response.status(422).json({
        success: false,
        message: ermessage,
      });
    }
    next();
  },
];

module.exports = { validateUser };
