const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const auth = require('../middlewares/auth')
const upload = require('../middlewares/multer')

router
  .get('/', auth.verifyAccess, userController.getAllUser)
  .post('/register', userController.register)
  .post('/login', userController.login)
  .get('/:idsaya', auth.verifyAccess, userController.getUserById)
  .put('/:id', auth.verifyAccess, upload.single('image'), userController.updateUser)
  .delete('/:id', auth.verifyAccess, userController.deleteUser)
module.exports = router