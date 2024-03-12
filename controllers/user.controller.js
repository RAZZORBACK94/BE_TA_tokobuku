/** load model for `users` table */
const userModel = require(`../models/index`).user;
const md5 = require(`md5`);

const bycrpt = require("bcrypt");

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op;

/** create function for read all data */
exports.getAllUser = async (request, response) => {
  /** call findAll() to get all data */
  let users = await userModel.findAll();
  return response.json({
    success: true,
    data: users,
    message: `All users have been loaded`,
  });
};

/** create function for filter */
exports.findUser = async (request, response) => {
  /** define keyword to find data */
  let keyword = request.params.key;
  /** call findAll() within where clause and operation
   * to find data based on keyword */
  let users = await userModel.findAll({
    where: {
      [Op.or]: [
        { id: { [Op.substring]: keyword } },
        { nama_user: { [Op.substring]: keyword } },
        { jk_user: { [Op.substring]: keyword } },
        { alamat_user: { [Op.substring]: keyword } },
        { telepon_user: { [Op.substring]: keyword } },
        { saldo_user: { [Op.substring]: keyword } },
        { username_user: { [Op.substring]: keyword } },
        { password_user: { [Op.substring]: keyword } },
        { role_user: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: users,
    message: `All Users have been loaded`,
  });
};

exports.register = async (request, response) => {
  const defaultRole = "pengguna";
  const defaultSaldo = 0;

  let newUser = {
    id: request.body.id,
    nama_user: request.body.nama_user,
    jk_user: request.body.jk_user,
    alamat_user: request.body.alamat_user,
    telepon_user: request.body.telepon_user,
    saldo_user: defaultSaldo,
    username_user: request.body.username_user,
    password_user: md5(request.body.password_user),
    role_user: request.body.role_user || defaultRole,
  };
  userModel
    .create(newUser)
    .then((result) => {
      return response.json({
        success: true,
        data: newUser,
        message: `New user has been inserted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

/** create function for add new user */
exports.addUser = (request, response) => {
  /** prepare data from request */
  let newUser = {
    id: request.body.id,
    nama_user: request.body.nama_user,
    jk_user: request.body.jk_user,
    alamat_user: request.body.alamat_user,
    telepon_user: request.body.telepon_user,
    saldo_user: request.body.saldo_user,
    username_user: request.body.username_user,
    password_user: md5(request.body.password_user),
    role_user: request.body.role_user,
  };
  /** execute inserting data to user's table */
  userModel
    .create(newUser)
    .then((result) => {
      /** if insert's process success */
      return response.json({
        success: true,
        data: newUser,
        message: `New user has been inserted`,
      });
    })
    .catch((error) => {
      /** if insert's process fail */
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

/** create function for update user */
exports.updateUser = (request, response) => {
  /** prepare data that has been changed */
  let dataUser = {
    nama_user: request.body.nama_user,
    jk_user: request.body.jk_user,
    alamat_user: request.body.alamat_user,
    telepon_user: request.body.telepon_user,
    saldo_user: request.body.saldo_user,
    username_user: request.body.username_user,
    role_user: request.body.role_user,
  };
  if (request.body.password_user) {
    dataUser.password_user = md5(request.body.password_user);
  }
  /** define id user that will be update */
  let id = request.params.id;
  /** execute update data based on defined id user */
  userModel
    .update(dataUser, { where: { id: id } })
    .then((result) => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data user has been updated`,
      });
    })
    .catch((error) => {
      /** if update's process fail */
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

/** create function for delete data */
exports.deleteUser = (request, response) => {
  /** define id user that will be update */
  let id = request.params.id;
  /** execute delete data based on defined id user */
  userModel
    .destroy({ where: { id: id } })
    .then((result) => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data user has been deleted`,
      });
    })
    .catch((error) => {
      /** if update's process fail */
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

// error done
exports.resetPW = async (request, response) => {
  try {
    let id = request.params.id;

    let users = await userModel.findOne({ where: { id: id } });

    if (!users) {
      return response.status(404).json({ error: "User not found" });
    }

    const newPass = md5(request.body.password_user);
    userModel.update({ password_user: newPass }, { where: { id: id } });

    response.status(200).json({ message: "password reset sukses" });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
