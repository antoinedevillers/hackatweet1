const mongoose = require("mongoose");

const trendSchema = mongoose.Schema({
    trendContent: String,
    tweet_ids: [{type: mongoose.Schema.Types.ObjectId , ref: 'tweets'}],
    hashtag_count: Number
});

const Trend = mongoose.model('trends', trendSchema);

module.exports = Trend