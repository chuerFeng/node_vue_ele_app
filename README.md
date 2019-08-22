# 这是一个vue-cli项目中的node部分
## express
## 数据库mongoose
  1. mongoose.connect()
  2. mongoose.schema()
  3. mongoose.models()
  4. mongoose.findOne()
  5. mongoose.save()

## body-parser解析中间件
  ```
    // app.js
    var bodyParser = require('body-parser')
    // 此对象将包含键值对，其中值可以是字符串或数组
    app.use(bodyParser.urlencoded({extended: false}))
    // create application/json parser
    app.use(bodyParser.json())
  ```
  ```
    // index.js
    const express = require('express')
    const router = new Express()
    router.get('/test', (req, res) => {
      res.json({msg: 'test'})
    })  
  ```


## 加密模块bcrypt
1. 密码加密
  ```
  // User.js
  module.exports = User = mongoose.model('users', UserSchema)

  // index.js
  const User = require('User')
  const newPerson = new User({
    name: req.body.name,
    email: req.body.email,
    password:req.body.password,
    avatar
  })
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newPerson.password, salt, function(err, hash) {
      if (err) { throw err }  
      newPerson.password = hash

      newPerson.save()
        .then( users => { res.json(users) })
        .catch( err => console.log(err))
    });
  });
  ```

2. 密码匹配(登录)
  ```
  bcrypt.compare(password, user.password)
    .then((result) => {
      if(result){res.json({msg: 'success'})})
      }else{
        return res.status(400).json({password: '密码错误'})
      }
    })
  ```

## gravatar头像
 + 如果在gravatar中注册过email，那么在使用此email登录时会自动显示gravatar的头像
` var avatar = gravatar.url( req.body.email , {s: '200', r: 'pg', d: 'mm'}); `
  
## jsonwebtoken 
  + token 的前缀规定就是 'Brsrer '，如果替换为其他的会不能被解析识别
  + jwt.sign(规格 , 私钥, 过期时间, 回调)
  ```
    jwt.sign(rule , key.certOrKeys, {expiresIn: 3600}, (err, token) => {
      if (err) throw err
      res.json({
        success: 'success',        
        token: 'Brsrer ' + token
      })                
    })
  ```
## passport
 - passport是express框架的一个针对密码的中间件
 + passport.js是Nodejs中的一个做登录验证的中间件，极其灵活和模块化，并且可与Express、Sails等Web框架无缝集成。Passport功能单一，即只能做登录验证，但非常强大，支持本地账号验证和第三方账号登录验证（OAuth和OpenID等），支持大多数Web网站和服务。

 1. 初始化 passport
  ```
  // app.js
  const passport = require('passport')
  app.use(passport.initialize());

  // 引入passport.js文件，并把当前passport当作参数传过去
  retuire('./config/passport.js')(passport)
  ```

2. 新建passport.js
  ```
  var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
  const mongoose = require('mongoose')
  const User = mongoose.model('users')
  const keys = require('../config/key')

  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = keys.secretOrKey;

  module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);    
    }));
  }
  ```

  

## passport-jwt  
 - passport-jwt是一个针对jsonwebtoken的插件,用于对jsonwebtoken进行身份验证

 1. 使用passport-jwt之前需要先注册 passport
    + 初始化 passport
    ```
    // app.js
    const passport = require('passport')
    app.use(passport.initialize());

    // 引入passport.js文件，并把当前passport当作参数传过去
    retuire('./config/passport.js')(passport)
    ```
  

 2. 新建 passport.js,用来配置验证规格
    ```
    var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    const mongoose = require('mongoose')
    const User = mongoose.model('users')
    const keys = require('../config/key')

    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = keys.secretOrKey;

    module.exports = (passport) => {
      passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);    
      }));
    }
    ```

  3. router-> user.js文件中 验证请求
  ```
  // user.js
  const passport = require('passport')
  app.post('/profile', passport.authenticate('jwt', { session: false }),
      function(req, res) {
          res.send(req.user.profile);
      }
  );

  ```

  ## 前后端连载模块 concurrently
  