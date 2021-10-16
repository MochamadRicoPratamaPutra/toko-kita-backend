const userModel = require('../models/users');
const { v4: uuidv4 } = require('uuid');
const helpers = require('../helpers/helpers');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUser = (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const column = req.query.column;
  const search = req.query.search;
  const sort = req.query.sort;
  const userRole = req.role;
  if (userRole === 'admin') {
    const keyword = req.query.keyword;
    userModel
      .getAllUser(page, limit, column, search, sort, keyword)
      .then((result) => {
        const users = result;
        helpers.response(res, users, 200);
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = new createError.InternalServerError();
        next(errorMessage);
      });
  } else {
    const errorMessage = new createError.Forbidden();
    next(errorMessage);
  }
};
const getUserById = (req, res, next) => {
  const id = req.params.idsaya;
  userModel
    .getUserById(id)
    .then((result) => {
      const users = result;
      helpers.response(res, users, 200);
    })
    .catch((error) => {
      console.log(error);
      const errorMessage = new createError.InternalServerError();
      next(errorMessage);
    });
};

const updateUser = (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      const data = {
        name: name,
        email: email,
        password: hash,
        updatedAt: new Date(),
      };
      if (req.file) {
        data.image = `${process.env.BASE_URL}/file/${req.file.filename}`;
      }
    });
    userModel
      .updateUser(id, data)
      .then(() => {
        res.json({
          message: 'data successfuly updated',
          data: data,
        });
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = new createError.InternalServerError();
        next(errorMessage);
      });
  });
};

const deleteUser = (req, res, next) => {
  const id = req.params.id;
  userModel
    .deleteUser(id)
    .then(() => {
      res.status(200);
      res.json({
        message: 'user berhasil dihapus',
      });
    })
    .catch(() => {
      const errorMessage = new createError.InternalServerError();
      next(errorMessage);
    });
};

const register = async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await userModel.findUser(email);
  if (user.length > 0) {
    return helpers.response(res, null, 401, { message: 'email already registered' });
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      const data = {
        id: uuidv4(),
        name: name,
        email: email,
        password: hash,
        createdAt: new Date(),
      };
      userModel
        .insertUser(data)
        .then(() => {
          delete data.password;
          helpers.response(res, data, 200);
        })
        .catch(() => {
          const errorMessage = new createError.InternalServerError();
          next(errorMessage)
        });
    });
  });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const result = await userModel.findUser(email);
  const user = result[0];
  bcrypt.compare(password, user.password, function (err, resCompare) {
    if (!resCompare) {
      return helpers.response(res, null, 401, { message: 'password wrong' });
    }
    jwt.sign(
      { email: user.email, id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: 60 * 60 },
      function (err, token) {
        delete user.password;
        user.token = token;
        helpers.response(res, user, 200);
      }
    );
  });
};
module.exports = {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  register,
  login,
};
