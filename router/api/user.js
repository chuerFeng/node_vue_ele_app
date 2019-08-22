// login @ register
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const key= require('../../config/key')
const passport = require('passport')

router.get('/test', (req, res) => {
  res.json({msg: 'test'})
})  


router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
    .then((users) => {
      if(users){
        return res.status(400).json( '邮箱已被注册')
      }else{
        var avatar = gravatar.url( req.body.email , {s: '200', r: 'pg', d: 'mm'});
        const newPerson = new User({
          name: req.body.name,
          email: req.body.email,
          password:req.body.password,
          identity: req.body.identity,
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

      }
    })
    .catch((err) => {
      console.log(2);      
      console.log(err);      
    })
  
})


router.post('/login', (req, res) => {
  
  const email = req.body.email,
        password = req.body.password
    // 查询数据库
    User.findOne({email: email})
      .then((user) => {        
        if (!user) { return res.status(404).json('用户不存在')}

        // 密码匹配
        bcrypt.compare(password, user.password)
          .then((result) => {
            if(result){
              // res.json({msg: 'success'})
              const rule = { 
                id:user.id, 
                name:user.name,
                avatar:user.avatar,
                identity: user.identity
              }
              jwt.sign(rule , key.secretOrKey, {expiresIn: 3600}, (err, token) => {
                if (err) throw err
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                })                
              })
            }else{
              return res.status(400).json('密码错误')
            }
          })
      })
})

router.get('/current', passport.authenticate('jwt', { session: false }) ,(req, res) =>{
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    identity: req.user.identity
  })  
})





module.exports = router