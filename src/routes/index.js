const express = require('express')
const route = express.Router()
const productRouter = require('./products')
const userRouter = require('./users')

route
  .use('/products', productRouter)
  .use('/users', userRouter)
module.exports = route