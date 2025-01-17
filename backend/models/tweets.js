const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    date: Date,
    content: String,
    isLiked: Boolean,
    user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
})

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;