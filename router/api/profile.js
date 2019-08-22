// login @ register
const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const Profile = require('../../models/Profile')



// 添加信息
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {}
    let arr = req.body       
    for (let key in arr) {
      if (arr[key]) {
        profileFields[key] = arr[key]
      }         
    }
    
    new Profile(profileFields).save()
      .then((profile) =>{
        res.json(profile)
      })
})

// @route  POST api/profiles/edit
// @desc   获取所有信息
// @access private
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.params.id);
  
  Profile.findOne({ _id: req.params.id})
    .then(profile => {
      if (!profile) {
        res.status(404).json('没有内容')
      }
      res.json(profile)
    })
    .catch(err => {
      res.status(404).json(err)
    })
})

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find()
    .then(profile => {
      if (!profile) {
        res.status(404).json('没有内容')
      }
      res.json(profile)
    })
    .catch(err => {
      res.status(404).json(err)
    })
})

// @route  POST api/profiles/edit
// @desc   编辑信息接口
// @access private
router.post('/edit/:id', passport.authenticate('jwt', { session:false }), (req, res) => {
  
  const profileFields = {}
  let arr = req.body     
  
  for (let key in arr) {
    if (arr[key]) {
      profileFields[key] = arr[key]
    }         
  }
  
  Profile.findByIdAndUpdate({_id: req.params.id}, profileFields, { new: true })
    .then((profile) => {
      res.json(profile)      
    })
    .catch( err => {
      res.status(404).json(err)
    })

})


// @route  POST api/profiles/edit
// @desc   删除信息接口
// @access private
router.delete('/delete/:id', passport.authenticate('jwt', { session:false }), (req, res) => {
  console.log(req.params.id);  
  Profile.findByIdAndRemove({_id: req.params.id})
    .then((profile) => {
      profile.save().then(profile => res.json(profile))
    })
    .catch( err => {
      res.status(404).json('err')
    })

})







module.exports = router