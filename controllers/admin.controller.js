/** load model for `users` table */
const adminModel = require(`../models/index`).admin
const md5 = require(`md5`)
/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getAllAdmin = async (request, response) => {
    /** call findAll() to get all data */
    let admins = await adminModel.findAll()
    return response.json({
        success: true,
        data: admins,
        message: `All admins have been loaded`
    })
}

/** create function for filter */
exports.findAdmin = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.params.key
    /** call findAll() within where clause and operation 
    * to find data based on keyword */
    let admins = await adminModel.findAll({
        where: {
            [Op.or]: [
                { id_admin: { [Op.substring]: keyword } },
                { nama_admin: { [Op.substring]: keyword } },
                { username_admin: { [Op.substring]: keyword } },
                { password: { [Op.substring]: keyword } },
            ]
        }
    })
    return response.json({
        success: true,
        data: admins,
        message: `All Admins have been loaded`
    })
}

/** create function for add new user */
exports.addAdmin = (request, response) => {
    /** prepare data from request */
    let newAdmin = {
        nama_admin: request.body.nama_admin,
        username_admin: request.body.username_admin,
        password: request.body.password,
    }
    /** execute inserting data to user's table */
    adminModel.create(newAdmin)
        .then(result => {
            /** if insert's process success */
            return response.json({
                success: true,
                data: result,
                message: `New admin has been inserted`
            })
        })
        .catch(error => {
            /** if insert's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for update user */
exports.updateAdmin = (request, response) => {
    /** prepare data that has been changed */
    let dataAdmin = {
        nama_admin: request.body.nama_admin,
        username_admin: request.body.username_admin,
        password: request.body.password,
    }
    if (request.body.password) {
        dataAdmin.password = md5(request.body.password)
    }
    /** define id user that will be update */
    let id_admin = request.params.id_admin
    /** execute update data based on defined id user */
    adminModel.update(dataAdmin, { where: { id_admin: id_admin } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data admin has been updated`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

/** create function for delete data */
exports.deleteAdmin = (request, response) => {
    /** define id user that will be update */
    let id_admin = request.params.id_admin
    /** execute delete data based on defined id user */
    adminModel.destroy({ where: { id_admin: id_admin } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data admin has been deleted`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
        })
    })
}
