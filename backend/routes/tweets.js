var express = require('express');
var router = express.Router();

const Tweet = require('../models/tweets');
const {checkBody} = require('../modules/checkBody');

//Récupère la list de tweets de l'utilisateur

router.get('/', function(req, res) {
    Tweet.find()
    .populate('user_id')
    .then(data => {
        res.json({data})
    })
})

//Ajout Tweet
router.post('/', function(req,res){
    if(!checkBody(req.body, ['user_id','content'])){
        res.json({result:false, error: 'Missing or empty fields'});
        return;
    }

    const newTweet = new Tweet({
        date: new Date(),
        content: req.body.content,
        isLiked: false,
        user_id: req.body.user_id,
    })

    newTweet.save().then((newDoc) => {
        res.json({result: true, content: newDoc.content, user: newDoc.user_id})
    })
})
// Suppression de Tweet
router.delete('/:_id', function(req,res){

    Tweet.deleteOne({_id: req.params._id})
    .then(data => {
        if (data.deletedCount > 0) {
            Tweet.find().then(data =>
                res.json({result:true, data})
            ) 
        } else {
                res.json({result:false, error: 'Content not found'})
        }}
    )
})

module.exports = router;