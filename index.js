require('dotenv').config()
const express = require('express')
const app = express()
const route = require('./src/routes/index')
const port = process.env.PORT || 4000
const cors = require('cors')
const createError = require('http-errors')
const morgan = require('morgan');

app.use(cors())
app.use(express.json())
app.use(route)
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }))
app.use('/file', express.static('./src/upload'))
app.use('*', (req, res, next) => {
  const error = new createError.NotFound()
  next(error)
})
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  })
})

app.listen(port, () => {
  console.log('server is running on port ' + port)
})