var express = require('express');
var router = express.Router();

const User = require('../models/users');
const {checkBody} = require('../modules/checkBody');

const bcrypt =require('bcrypt');
const uid2 = require('uid2');



//Sign Up
router.post('/signup', function(req, res) {

  if(!checkBody(req.body, ['firstname','username', 'password'])) {
    res.json({result: false, error: 'Missing or empty fields'});
    return;
  }
  User.findOne({username: req.body.username}).then(data => {
    if (data === null){
      const hash = bcrypt.hashSync(String(req.body.password), 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
        canTweet: true,
        canLike: true
      });
    
    newUser.save().then((newDoc) => {
      res.json({result: true, token: newDoc.token})
    })
    } else {
      res.json({result: false, error: 'User already saved'})
    }
  })
});

//Sign In

router.post('/signin', (req, res) =>  {
  if(!checkBody(req.body, ['username', 'password'])) {
    res.json({result: false, error: 'Missing or empty fields'})
    return;
  }

  User.findOne({username: req.body.username})
  .then(data => {
    if (data && bcrypt.compareSync(String(req.body.password), String(data.password))) {
      console.log(data)
      res.json({result: true, token: data.token, firstname: data.firstname})
      
    } else {
      res.json({result: false, error: 'User not found'})
    }
  })
})

module.exports = router;
