const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

var app =  express()

const user = require('./router/api/user')
const profile = require('./router/api/profile')


// 初始化 passport
app.use(passport.initialize())
require('./config/passport')(passport)


// mongoose 
const db = require('./config/key').mongoURL
mongoose.connect(db, {useNewUrlParser:true})
  .then(() => {
    console.log("mongoDB Connected")
  })
  .catch((err) => {
    console.log(err)
  })
  

  // 使用 bodyParser 中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  
// 使用 router
app.use('/api/users', user)
app.use('/api/profile', profile)

  
  
var port = process.env.PORT || 5000
app.listen(port, (data) => {
  console.log('listening····')
})