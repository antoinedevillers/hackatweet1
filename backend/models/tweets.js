const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    date: Date,
    content: String,
    isLiked: Boolean,
})

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;