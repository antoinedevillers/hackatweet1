import Image from "next/image";
import styles from "../styles/Tweet.module.css";
import { useSelector } from 'react-redux';
import TrashIcon from './icons/TrashIcon';
import HeartIcon from './icons/HeartIcon';
import { useState } from "react";

function Tweet({ onDelete, data , onTrendSearch}) {

  const user = useSelector((state) => state.user.value)
  // Calcul durée depuis création d'un tweet
  let totalMinutes = Math.floor((Date.parse(new Date) - Date.parse(data.date)) / 60000);
  let hours = Math.floor(totalMinutes / 60)
  let minutes = totalMinutes % 60;
  let timeRecalculated = hours > 0 ? `${hours}h` : minutes < 0 ? `${minutes} min` : 'a few seconds ago..';

 
  const hasLiked = data.likes.some((like) => like.user_token === user.token); // Vérifie si l'utilisateur a liké ce tweet
  const [isLiked, setIsLiked] = useState(hasLiked); // État local
  const [likesCount, setLikesCount] = useState(data.like_count)

  //On applique un style, un span et un click pour chaque hashtag dans chaque tweet
  const formatContentWithHashtags = (content, handleTrendSearch) => {
    const hashtagRegex = /#\w+/g; // Expression régulière pour capturer les hashtags
    return content.split(/(\s+)/).map((word, index) => { // /(\s+)/ regex pour conserver les espaces
      if (hashtagRegex.test(word)) {
        console.log('word', word)
        return (
          <span key={index} className={styles.hashtag}  onClick={() => handleTrendSearch(word.replace(/[^#\w]/g, ""))}> 
            {word}
          </span>
        );
        // word.replace(/[^#\w]/g, "") retire la ponctuation après les hashtags
      }
      return word + ' ';
    });
  }

// Fonction pour liker ou unliker un tweet
  const handleLike = () => {
    fetch('http://localhost:3000/tweets', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ tweetId: data._id }),
    })
      .then((res) => res.json())
      .then((updatedData) => {
        if (updatedData.result) {
          setIsLiked(!isLiked); // Met à jour l'état local du like par l'utilisateur
          isLiked ? setLikesCount(likesCount -= 1) : setLikesCount(likesCount += 1)// Met à jour le nombre de likes d'un tweet
        }
      })
      .catch((error) => console.error('Like error:', error)); // Gestion des erreurs
  };



  return (
    <div className={styles.tweetContainer}>
      <div className={styles.topTweetContainer}>
        <Image
          src='/colibri.png'
          width={50}
          height={50}
          alt='Logo Hackatweet' />
        <p className={styles.firstname}>{data.user_id.firstname}</p>
        <p className={styles.tagandtime}>@{data.user_id.username} - {timeRecalculated}</p>


      </div>
      <div className={styles.contentTweet}>
        {formatContentWithHashtags(data.content, onTrendSearch)}
      </div>

      <div className={styles.iconsContent}>
        <HeartIcon
          onClick={() => handleLike(data._id)}
          isLiked={isLiked} // Passe l'état actuel de "isLiked"
          tweetId={data._id}

        />
        <p className={styles.likeCount}>{likesCount}</p>
        {data.isOwner && <TrashIcon onClick={() => onDelete(data._id)} tweetId={data._id} />} 
        {/* isOwner permet de savoir si l'utilisateur est bien l'auteur du tweet afin de pouvoir le supprimer*/}

      </div>

    </div>
  )

}

export default Tweet;