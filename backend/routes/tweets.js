var express = require('express');
var router = express.Router();

const Tweet = require('../models/tweets');
const {checkBody} = require('../modules/checkBody');

//Ajout Tweet
router.post('/', function(req,res){
    if(!checkBody(req.body, ['content'])){
        res.json({result:false, error: 'Missing or empty fields'});
        return;
    }

    const newTweet = new Tweet({
        date: new Date(),
        content: req.body.content,
        isLiked: false,
    })

    newTweet.save().then((newDoc) => {
        res.json({result: true, content: newDoc.content})
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