const express = require('express')
const router = express.Router()
const productController = require('../controllers/products')
const upload = require('../middlewares/multer')
const auth = require('../middlewares/auth')
// const redisCache = require('../middlewares/redis')
router
  .get('/', productController.getAllProduct)
  .get('/:idsaya', productController.getProductById)
  .post('/', auth.verifyAccess, upload.single('gambar'), productController.insertProduct)
  .put('/:id', auth.verifyAccess, upload.single('gambar'), productController.updateProduct)
  .delete('/:id', auth.verifyAccess, productController.deleteProduct)
module.exports = router