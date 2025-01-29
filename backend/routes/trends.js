var express = require('express');
var router = express.Router();
const Trend = require('../models/trends');
const User = require('../models/users'); 

// Middleware pour authentifier l'utilisateur via le token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ result: false, message: 'Token is missing' });
    }

    User.findOne({ token: token }).then((user) => {
        if (!user) {
            return res.status(403).json({ result: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    }).catch(err => {
        console.error(err);
        res.status(500).json({ result: false, error: 'Internal server error' });
    });
}

//Permet de récupérer la liste des trends en bdd
router.get('/', authenticateToken, (req, res) => {
    Trend.find()
        .then(data => {
            if (!data) {
                return res.json({ result: false, error: 'No trends found' });
            }
            res.json({ result: true, trends: data });
        })
        .catch(error => {
            res.status(500).json({ result: false, error: 'Internal server error' });
        });
});

//Permet d'ajouter un ou plusieurs trends en bdd 
router.post('/', authenticateToken, (req, res) => {

    Trend.findOne({ trendContent: req.body.trendContent })
        .then(trend => {
            if (trend) {
  
                // Si le hashtag existe, on ajoute le tweetId (s'il n'existe pas déjà) dans le tableau tweet_ids d'un document précédemment créé 
                if (!trend.tweet_ids.includes(req.body.tweetId)) {
                    trend.tweet_ids.push(req.body.tweetId);
                    trend.hashtag_count += 1;// On incrémente le compteur du hashtag
                    trend.save();
                }
                return res.json({ result: true, trendContent: trend.trendContent, isNew: false });
            } else {

                const newTrend = new Trend({
                    trendContent: req.body.trendContent,
                    tweet_ids: [req.body.tweetId],
                    hashtag_count: 1
                });

                newTrend.save()
                    .then(newDoc => res.json({ result: true, trendContent: newDoc.trendContent , isNew: true }))
                    .catch(error => {
                        res.status(500).json({ result: false, error: 'Error saving trend' });
                    });
            }
        })

});

//Permet de modifier un trend ou de le supprimer
router.put('/', authenticateToken, async (req, res) => {
    // Validation des champs requis
    if (!req.body.trendContents || !Array.isArray(req.body.trendContents) || !req.body.tweetId) {
      return res.status(400).json({ result: false, error: 'Missing or invalid fields' });
    }
  
    try {
      // On parcourt tous les trendContents pour mise à jour
      const updatePromises = req.body.trendContents.map(async (trendContent) => {
        const updatedDoc = await Trend.findOneAndUpdate(
          { trendContent, hashtag_count: { $gt: 0 } }, // Filtre les hashtags valides
          { 
            $pull: { tweet_ids: req.body.tweetId }, // Supprime le tweet de la liste
            $inc: { hashtag_count: -1 } // Décrémente le compteur
          },
          { new: true } // on retourne le document mis à jour
        );
  
        // Si le document existe mais devient vide, on le supprime
        if (updatedDoc && updatedDoc.tweet_ids.length === 0 && updatedDoc.hashtag_count <= 0) {
          await Trend.deleteOne({ _id: updatedDoc._id });
          return { trendContent, deleted: true }; // on indique que ce trend a été supprimé
        }
  
        return { trendContent, updated: true }; // on indique que ce trend a été mis à jour
      });
  
      // on fait toutes les mises à jour en parallèle
      const results = await Promise.all(updatePromises);
  
      res.json({ result: true, trends: results }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: false, error: 'Internal server error' });
    }
  });
  

module.exports = router;