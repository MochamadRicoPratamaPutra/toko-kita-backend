const connection = require('../configs/db');

const getAllProduct = (page, limit, column, search, sort, keyword) => {
  return new Promise((resolve, reject) => {
    if (column !== undefined && sort !== undefined && keyword !== undefined && search !== undefined) {
      if (Number.isNaN(page) === false && Number.isNaN(limit) === false) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatingResult = {};
        connection.query(
          `SELECT * FROM products WHERE ${search} LIKE '%${keyword}%' ORDER BY ${column} ${sort} LIMIT ${limit} OFFSET ${startIndex};`,
          (error, result) => {
            if (!error) {
              connection.query('SELECT COUNT(*) AS count FROM products', (errorCount, resultCount) => {
                if (!errorCount) {

                  if (endIndex < resultCount[0].count) {
                    paginatingResult.next = {
                      page: page + 1,
                      limit: limit,
                    };
                  }
                  if (startIndex > 0) {
                    paginatingResult.previous = {
                      page: page - 1,
                      limit: limit,
                    };
                  }
                  paginatingResult.result = result;
                  resolve(paginatingResult);
                } else {
                  reject(errorCount);
                }
              });
            } else {
              reject(error);
            }
          }
        );
      } else {
        connection.query(`SELECT * FROM products ORDER BY ${column} ${sort}`, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        });
      }
    } else if (column !== undefined && sort !== undefined) {
      if (Number.isNaN(page) === false && Number.isNaN(limit) === false) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatingResult = {};
        connection.query(
          `SELECT * FROM products ORDER BY ${column} ${sort} LIMIT ${limit} OFFSET ${startIndex}`,
          (error, result) => {
            if (!error) {
              connection.query('SELECT COUNT(*) AS count FROM products', (errorCount, resultCount) => {
                if (!errorCount) {

                  if (endIndex < resultCount[0].count) {
                    paginatingResult.next = {
                      page: page + 1,
                      limit: limit,
                    };
                  }
                  if (startIndex > 0) {
                    paginatingResult.previous = {
                      page: page - 1,
                      limit: limit,
                    };
                  }
                  paginatingResult.result = result;
                  resolve(paginatingResult);
                } else {
                  reject(errorCount);
                }
              });
            } else {
              reject(error);
            }
          }
        );
      } else {
        connection.query(`SELECT * FROM products ORDER BY ${column} ${sort}`, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        });
      }
    } else if (keyword !== undefined && search !== undefined) {
      if (Number.isNaN(page) === false && Number.isNaN(limit) === false) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatingResult = {};
        connection.query(
          `SELECT * FROM products WHERE ${search} LIKE '%${keyword}%' LIMIT ${limit} OFFSET ${startIndex}`,
          (error, result) => {
            if (!error) {
              connection.query('SELECT COUNT(*) AS count FROM products', (errorCount, resultCount) => {
                if (!errorCount) {

                  if (endIndex < resultCount[0].count) {
                    paginatingResult.next = {
                      page: page + 1,
                      limit: limit,
                    };
                  }
                  if (startIndex > 0) {
                    paginatingResult.previous = {
                      page: page - 1,
                      limit: limit,
                    };
                  }
                  paginatingResult.result = result;
                  resolve(paginatingResult);
                } else {
                  reject(errorCount);
                }
              });
            } else {
              reject(error);
            }
          }
        );
      } else {
        connection.query(`SELECT * FROM products WHERE ${search} LIKE '%${keyword}%'`, (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        });
      }
    } else {
      if (Number.isNaN(page) === false && Number.isNaN(limit) === false) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatingResult = {};
        connection.query(`SELECT * FROM products LIMIT ${limit} OFFSET ${startIndex}`, (error, result) => {
          if (!error) {
            connection.query('SELECT COUNT(*) AS count FROM products', (errorCount, resultCount) => {
              if (!errorCount) {
                if (endIndex < resultCount[0].count) {
                  paginatingResult.next = {
                    page: page + 1,
                    limit: limit,
                  };
                }
                if (startIndex > 0) {
                  paginatingResult.previous = {
                    page: page - 1,
                    limit: limit,
                  };
                }
                paginatingResult.result = result;
                resolve(paginatingResult);
              } else {
                reject(errorCount);
              }
            });
          } else {
            reject(error);
          }
        });
      } else {
        connection.query('SELECT * FROM products', (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        });
      }
    }
  });
};
const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM products WHERE id = ?', id, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const insertProduct = (data) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO products SET ?', data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const updateProduct = (id, data) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE products SET ? WHERE id = ?', [data, id], (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM products WHERE id = ?', id, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const findProduct = (name) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM products where nama = ?', name, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};
module.exports = {
  getAllProduct,
  getProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
  findProduct
};
