const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tweets' },
    date_like: Date,
})

const Like = mongoose.model('likes', likeSchema);

module.exports = Like;