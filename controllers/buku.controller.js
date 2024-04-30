/** load model for `events` table */
const bukuModel = require(`../models/index`).buku;
/** load Operation from Sequelize */
const Op = require(`sequelize`).Op;
/** load library 'path' and 'filestream' */
const path = require(`path`);
const fs = require(`fs`);

/** create function for read all data */
exports.getAllBuku = async (request, response) => {
  /** call findAll() to get all data */
  let bukus = await bukuModel.findAll();
  return response.json({
    success: true,
    data: bukus,
    message: `All Bukus have been loaded`,
  });
};

exports.getBukubyKategori = async (request, response) => {
  let kategori = request.body.kategori;
  /** call findAll() to get all data */
  let bukus = await bukuModel.findAll({
    where: { kategori_buku: kategori },
  });
  return response.json({
    success: true,
    data: bukus,
    message: `All Bukus have been loaded`,
  });
};

/** create function for filter */
exports.findBuku = async (request, response) => {
  /** define keyword to find data */
  let keyword = request.body.keyword;
  /** call findAll() within where clause and operation
   * to find data based on keyword */
  let bukus = await bukuModel.findAll({
    where: {
      [Op.or]: [
        { isbn: { [Op.substring]: keyword } },
        { nama_buku: { [Op.substring]: keyword } },
        { author_buku: { [Op.substring]: keyword } },
        { penerbit_buku: { [Op.substring]: keyword } },
        { kategori_buku: { [Op.substring]: keyword } },
        { deskripsi_buku: { [Op.substring]: keyword } },
        { stok_buku: { [Op.substring]: keyword } },
        { harga_buku: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: bukus,
    message: `All Bukus have been loaded`,
  });
};

/** load function from `upload-image`
 * single(`image`) means just upload one file
 * with request name `image`
 */
const upload = require("./upload-image-buku").single(`cover_buku`);

/** create function to add new event */
exports.addBuku = (request, response) => {
  /** run function upload */
  upload(request, response, async (error) => {
    /** check if there are error when upload */
    if (error) {
      return response.json({ message: error });
    }
    /** check if file is empty */
    if (!request.file) {
      return response.json({
        message: `Nothing to Upload`,
      });
    }
    /** prepare data from request */
    let newBuku = {
      isbn: request.body.isbn,
      nama_buku: request.body.nama_buku,
      author_buku: request.body.author_buku,
      penerbit_buku: request.body.penerbit_buku,
      kategori_buku: request.body.kategori_buku,
      deskripsi_buku: request.body.deskripsi_buku,
      cover_buku: request.file.filename,
      stok_buku: request.body.stok_buku,
      harga_buku: request.body.harga_buku,
    };
    /** execute inserting data to event's table */
    bukuModel
      .create(newBuku)
      .then((result) => {
        /** if insert's process success */
        return response.json({
          success: true,
          data: result,
          message: `New buku has been inserted`,
        });
      })
      .catch((error) => {
        /** if insert's process fail */
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

/** create function to update event */
exports.updateBuku = async (request, response) => {
  /** run upload function */
  upload(request, response, async (error) => {
    /** check if there are error when upload */
    if (error) {
      return response.json({ message: error });
    }
    /** store selected event ID that will update */
    let id = request.params.id;
    /** prepare event's data that will update */
    let dataBuku = {
      isbn: request.body.isbn,
      nama_buku: request.body.nama_buku,
      author_buku: request.body.author_buku,
      penerbit_buku: request.body.penerbit_buku,
      kategori_buku: request.body.kategori_buku,
      deskripsi_buku: request.body.deskripsi_buku,
      stok_buku: request.body.stok_buku,
      harga_buku: request.body.harga_buku,
    };
    /** check if file is not empty,
     * it means update data within reupload file
     */
    if (request.file) {
      /** get selected event's data */
      const selectedbuku = await bukuModel.findOne({
        where: { id: id },
      });

      if (selectedbuku && selectedbuku.cover_buku) {
        const oldImage = selectedbuku.cover_buku;
        const pathImage = path.join(__dirname, `../cover`, oldImage);
        /** check file existence */
        if (fs.existsSync(pathImage)) {
          /** delete old image file */
          fs.unlink(pathImage, (error) => {
            if (error) {
              console.log("eror deleting", error);
            }
          });
        }
        /** add new image filename to event object */
      }
      dataBuku.cover_buku = request.file.filename;
    }
    /** execute update data based on defined id event */
    bukuModel
      .update(dataBuku, {
        where: {
          id: id,
        },
      })
      .then((result) => {
        /** if update's process success */
        return response.json({
          success: true,
          message: `Data buku has been updated`,
        });
      })
      .catch((error) => {
        /** if update's process fail */
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

/** create function to delete event */
exports.deleteBuku = async (request, response) => {
  /** store selected event's ID that will be delete */
  const id = request.params.id;
  /** -- delete image file -- */
  /** get selected event's data */
  const buku = await bukuModel.findOne({
    where: {
      id: id,
    },
  });
  /** get old filename of image file */
  const oldImage = buku.cover_buku;
  /** prepare path of old image to delete file */
  const pathImage = path.join(__dirname, `../cover`, oldImage);
  /** check file existence */
  if (fs.existsSync(pathImage)) {
    /** delete old image file */
    fs.unlink(pathImage, (error) => console.log(error));
  }
  /** -- end of delete image file -- */
  /** execute delete data based on defined id event */
  bukuModel
    .destroy({ where: { id: id } })
    .then((result) => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data buku has been deleted`,
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
