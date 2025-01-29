const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    user_token: String,
    created_at: Date,
})

const tweetSchema = mongoose.Schema({
    date: Date,
    content: String,
    likes: [likeSchema],
    like_count: Number,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
})

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;