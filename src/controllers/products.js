const productModel = require('../models/products');
const helpers = require('../helpers/helpers');
const createError = require('http-errors');
const getAllProduct = (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const column = req.query.column;
  const search = req.query.search;
  const sort = req.query.sort;
  const keyword = req.query.keyword;
  productModel
    .getAllProduct(page, limit, column, search, sort, keyword)
    .then((result) => {
      const products = result;
      helpers.response(res, products, 200);
    })
    .catch((error) => {
      console.log(error);
      const errorMessage = new createError.InternalServerError();
      next(errorMessage);
    });
};
const getProductById = (req, res, next) => {
  const id = req.params.idsaya;
  productModel
    .getProductById(id)
    .then((result) => {
      const products = result;
      helpers.response(res, products, 200);
    })
    .catch((error) => {
      console.log(error);
      const errorMessage = new createError.InternalServerError();
      next(errorMessage);
    });
};

const insertProduct = async (req, res, next) => {
  const penjual = req.id;
  const { nama, harga_jual, harga_beli, stok } = req.body;
  const product = await productModel.findProduct(nama);
  if (product.length > 0) {
    return helpers.response(res, null, 401, { message: 'product already registered' });
  }
  const data = {
    nama: nama,
    harga_jual: harga_jual,
    harga_beli: harga_beli,
    stok: stok,
    gambar: `${process.env.BASE_URL}/file/${req.file.filename}`,
    penjual: penjual,
    createdAt: new Date(),
  };
  productModel
    .insertProduct(data)
    .then(() => {
      helpers.response(res, data, 200);
    })
    .catch((error) => {
      console.log(error);
      const errorMessage = new createError.InternalServerError();
      next(errorMessage);
    });
};

const updateProduct = async (req, res, next) => {
  const id = req.params.id;
  const { nama, harga_jual, harga_beli, stok } = req.body;
  const product = await productModel.findProduct(nama);
  if (product.length > 0) {
    return helpers.response(res, null, 401, { message: 'product name already registered' });
  }
  const data = {
    nama: nama,
    harga_jual: harga_jual,
    harga_beli: harga_beli,
    stok: stok,
    updatedAt: new Date(),
  };
  if (req.file) {
    data.gambar = `${process.env.BASE_URL}/file/${req.file.filename}`;
  }
  productModel
    .updateProduct(id, data)
    .then(() => {
      res.json({
        message: 'data berhasil di insert',
        data: data,
      });
    })
    .catch((error) => {
      console.log(error);
      const errorMessage = new createError.InternalServerError();
      next(errorMessage);
    });
};

const deleteProduct = (req, res, next) => {
  const id = req.params.id;
  productModel
    .deleteProduct(id)
    .then(() => {
      res.status(200);
      res.json({
        message: 'data berhasil di hapus',
      });
    })
    .catch((err) => {
      console.log(err);
      const errorMessage = new createError.InternalServerError();
      next(errorMessage);
    });
};

module.exports = {
  getAllProduct,
  getProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
};
