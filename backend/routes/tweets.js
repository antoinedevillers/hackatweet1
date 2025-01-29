var express = require('express');
var router = express.Router();

const Tweet = require('../models/tweets');
const User = require('../models/users'); // Modèle utilisateur

const { checkBody } = require('../modules/checkBody');


// Middleware pour authentifier l'utilisateur via le token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Le token est dans l'en-tête Authorization
  if (!token) {
    return res.status(401).json({ result: false, message: 'Token is missing' });
  }

  // Recherche de l'utilisateur via son token
  User.findOne({ token: token }).then((user) => {
    if (!user) {
      return res.status(403).json({ result: false, message: 'Invalid token' });
    }
    req.user = user; // Ajoute l'utilisateur trouvé à `req.user`
    next();
  }).catch(err => {
    console.error(err);
    res.status(500).json({ result: false, error: 'Internal server error' });
  });
}

//On récupère la liste des tweets
router.get('/', authenticateToken, function (req, res) {
  Tweet.find().populate('user_id')//permet de récupérer les données de l'utilisteur via la clé étrangère user_id
    .then(tweets => {
      const tweetsWithOwnership = tweets.map(tweet => ({
        ...tweet.toObject(),
        isOwner: tweet.user_id?._id.toString() === req.user._id.toString(), 
      })).sort((a, b) => new Date(b.date) - new Date(a.date));
      
      res.json({ result: true, tweets: tweetsWithOwnership });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Failed to fetch tweets' });
    });
});

// Ajouter un nouveau tweet
router.post('/', authenticateToken, function (req, res) {
  if (!checkBody(req.body, ['content'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const newTweet = new Tweet({
    date: new Date(),
    content: req.body.content,
    user_id: req.user._id,

  });

  newTweet.save()
    .then(newDoc => {
      res.json({
        result: true,
        tweet: {
          ...newDoc.toObject(),
          isOwner: true, // L'utilisateur connecté est le propriétaire de son propre tweet
        },
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Failed to create tweet' });
    });
});

// Supprimer un tweet
router.delete('/', authenticateToken, function (req, res) {
  if (!checkBody(req.body, ['tweetId'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Vérifie que l'utilisateur connecté est le propriétaire du tweet
  Tweet.findOneAndDelete({ _id: req.body.tweetId, user_id: req.user._id })
    .then((deletedTweet) => {
      if (deletedTweet) {
        res.json({ result: true, deletedTweet, message: 'Tweet deleted successfully' });
      } else {
        res.status(404).json({ result: false, error: 'Tweet not found or not owned by user' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Failed to delete tweet' });
    });
});

// Liker ou disliker un tweet
router.put('/', authenticateToken, (req, res) => {

    // Vérifie que le champ `tweetId` est présent dans le corps de la requête
    if (!checkBody(req.body, ['tweetId'])) {
      return res.status(400).json({ result: false, error: 'Missing or empty fields' });
    }
  
    const tweetId = req.body.tweetId; // ID du tweet
    const userToken = req.user.token; // Token déjà validé par `authenticateToken`
  
    Tweet.findOne({ _id: tweetId })
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({ result: false, error: 'Tweet not found' });
        }
  
        // Vérifie si l'utilisateur a déjà liké le tweet
        const hasLiked = tweet.likes.some(like => like.user_token === userToken);
  
        if (hasLiked) {
          // L'utilisateur a déjà liké : on retire le like
          return Tweet.findOneAndUpdate(
            { _id: tweetId },
            { 
              $pull: { likes: { user_token: userToken } }, 
              $inc: { like_count: -1 } 
            }
          ).then((updatedDoc) => res.json({ result: true, updatedDoc }));
        } else {
          // L'utilisateur n'a pas encore liké : on ajoute un like
          return Tweet.updateOne(
            { _id: tweetId },
            { 
              $push: { likes: { user_token: userToken, created_at: new Date() } }, 
              $inc: { like_count: 1 } 
            }
          ).then((updatedDoc) => res.json({ result: true, updatedDoc }));
        }
      })
      .catch(error => {
        console.error('Error during like/unlike:', error);
        res.status(500).json({ result: false, error: error.message });
      });
  });
  
module.exports = router;
