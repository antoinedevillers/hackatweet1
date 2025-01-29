import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import Tweet from './Tweet';
import Trend from './Trend';

const MAX_TWEET_LENGTH = 280;

function Home() {

  const user = useSelector((state) => state.user.value);

  const dispatch = useDispatch();
  const [tweet, setTweet] = useState('')
  const [tweetLength, setTweetLength] = useState(0);
  const [tweetList, setTweetList] = useState([]);
  const [hashtagList, setHashtagList] = useState([]);
  const [isTrendSearchedList, setIsTrendSearchedList] = useState(false);

  const fetchTweets = () => {
    // Récupère les tweets lors de l'initialisation
    fetch('http://localhost:3000/tweets', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`, // Ajoute le token utilisateur
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTweetList(data.tweets); // Met à jour la liste des tweets
      })
      .catch((error) => console.error('Fetch error:', error)); 
  }

 // Met à jour la liste complète des trends
  const fetchTrends = () => {
    fetch('http://localhost:3000/trends', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setHashtagList(data.trends);
        }
      })
      .catch(error => {
        console.error('Erreur lors du fetch des trends:', error);
      });
  };

  //Permet d'actualiser la page en fonction de l'utilisateur
  useEffect(() => {
    if (user.token) {
      fetchTweets();
      fetchTrends();
    }
  }, [user.token]);

  //Change la valeur de l'input de création d'un tweet ( limité à 280 caractères)
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_TWEET_LENGTH) {
      setTweet(value);
      setTweetLength(value.length);
    }
  };

  //Ajoute un tweet dans la bdd
  const handleRegisterTweet = () => {

    if (!tweet.trim() || tweet.length > MAX_TWEET_LENGTH) {
      setError("Le tweet ne peut pas être vide ou dépasser 280 caractères");
      return;
    }

    fetch('http://localhost:3000/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ user_id: user.id, content: tweet })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de l’envoi du tweet');
        }
        return res.json();
      })
      .then(data => {
        if (data.result) {
          setTweet('');
          setTweetList(prevTweetList => [data.tweet, //On actualise la liste avec le nouveau tweet créé
          ...prevTweetList

          ]);

          // Gestion des hashtags 
          
          const hashtags = tweet.match(/#[a-zA-Z0-9]+/g);

          if (hashtags) {
            //On ajoute tous les hastags trouvés
            Promise.all(hashtags.map(hashtag => { //Promise.all permet d'attendre que toutes les requêtes soient terminées avant de passer à l'étape suivante
              fetch('http://localhost:3000/trends', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json',
                  Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ trendContent: hashtag, tweetId: data.tweet._id })
              })
                .then(res => {
                  if (!res.ok) {
                    throw new Error('Erreur lors de l’envoi du hashtag');
                  }
                  return res.json();
                })
                .then(data => {
                  if (data.result) {

                    fetchTrends(); // On actualise l'affichage des trends après l'ajout d'un tweet qui en contient
                  }
                })
                .catch(error => {
                  console.error('Erreur lors de l’envoi du hashtag:', error);
                });
            }));
          }
        }
      })
      .catch(error => {
        console.error('Erreur lors de l’envoi du tweet:', error);
      });
  };
  //SUpprime un tweet dont on est l'auteur
  const handleDelete = (tweetId) => {
    fetch('http://localhost:3000/tweets', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ tweetId, token: user.token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          // On met à jour localement les tweets après une suppression
          setTweetList((previousList) => {
            const updatedList = previousList.filter((tweet) => tweet._id !== tweetId);
            return updatedList;
          });

          // On extrait des hashtags du tweet supprimé
          const hashtags = data.deletedTweet.content.match(/#[a-zA-Z0-9]+/g);

          if (hashtags && hashtags.length > 0) {
            // on regroupe les hashtags dans une seule requête pour optimiser
            fetch('http://localhost:3000/trends/', {
              method: 'PUT',
              headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
              body: JSON.stringify({ tweetId, trendContents: hashtags })
            })
              .then(res => res.json())
              .then(() => {
                // On met à jour les trends après suppression
                fetchTrends();
              })
              .catch(err => {
                console.error('Erreur lors de la mise à jour des tendances:', err);
              });
          }
        }
      })
      .catch(err => {
        console.error('Erreur lors de la suppression du tweet:', err);
      });
  };

  const handleTrendSearch = (trendContent) => {
    console.log('clicked')
    setIsTrendSearchedList(true) //On affiche la page Trend après avoir cliqué sur un hashtag
    setTweet(trendContent) //La valeur du trend s'affiche dans l'input
    fetch('http://localhost:3000/tweets', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`, // Ajoute le token utilisateur
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filteredTweets = data.tweets.filter(tweet => tweet.content.includes(trendContent));
        setTweetList(filteredTweets); // On met à jour la liste des tweets filtrés (ceux qui contiennent le même hashtag)
      })
      .catch((error) => console.error('Fetch error:', error)); // Gestion des erreurs
  }



//Retourne la liste globale de tweets
const tweets = tweetList.map((data) => {

  return <Tweet key={data._id} onDelete={handleDelete} data={data} onTrendSearch={handleTrendSearch} />
})

//Retourne la liste globale des hashtags
const trends = hashtagList.map((data) => {
  console.log(data)
  return <Trend key={data._id} data={data} onClick={() => handleTrendSearch(data.trendContent)} />
})

return (

  <div>

    <main className={styles.main}>
      <div className={styles.leftpart}>
        <div className={styles.headerLogo}>
          <Image
            src='/colibri.png'
            width={100}
            height={100}
            alt='Logo Hackatweet'
            onClick={() => {setIsTrendSearchedList(false), setTweet(''), fetchTweets()}}
          />
        </div >
        <div className={styles.infosContainerWithLogout}>
          <div className={styles.infosContainer}>
            <div>
              <Image
                src='/colibri.png'
                width={50}
                height={50}
                alt='Logo Hackatweet'
              />
            </div>
            <div className={styles.firstnameAndTagContainer}>
              <p className={styles.firstname}>{user.firstname}</p>
              <p className={styles.tag}>@{user.username}</p>
            </div>
          </div>
          <div>
            <button
              className={styles.logoutButton}
              onClick={() => dispatch(logout())}>
              Logout</button>
          </div>

        </div>
      </div>

      <div className={styles.middlepart}>
        {isTrendSearchedList ? (

          <div className={styles.topMiddlePart}>
            <h3>Hashtag</h3>
            <div className={styles.inputContainer}>
              <input

                className={styles.input}
                onChange={handleChange}
                value={tweet}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {

                    handleTrendSearch(tweet) // Fonction appelée lorsqu'on appuie sur "Enter"
                  }
                }}>
                  
                </input>
                
            </div>
          </div>)
          : (<div className={styles.topMiddlePart}>

            <h3>Home</h3>
            <div className={styles.inputContainer}>
              <input
                placeholder="What's up?"
                className={styles.input}
                onChange={handleChange}
                value={tweet}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRegisterTweet(); // Fonction appelée lorsqu'on appuie sur "Enter"
                  }
                }}
                ></input>
            </div>
            <div className={styles.buttonTweetContainer}>
              <p className={styles.lengthTweet}>{tweetLength}/280</p>
              <button className={styles.tweetButton}
                onClick={() => handleRegisterTweet()}>Tweet</button>
            </div>
          </div>)}

        <div className={styles.listTweets}>{tweets}</div>


      </div>
      <div className={styles.rightpart}>
        <h3>Trends</h3>
        <div className={styles.trendsDiv}>{trends}</div>
      </div>


    </main>

  </div>
);
}

export default Home;
