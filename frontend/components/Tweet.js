import Image from "next/image";
import styles from "../styles/Tweet.module.css";
import {useDispatch} from 'react-redux';
import TrashIcon from './icons/TrashIcon';
import HeartIcon from './icons/HeartIcon';
import { useState } from "react";

function Tweet({onDelete, data}) {

    const [isLiked, setIsliked] = useState(false);
    const dispatch= useDispatch();

    // Calcul temps depuis création d'un tweet
    let totalMinutes = Math.floor((Date.parse(new Date) - Date.parse(data.date))/60000);
    let hours = Math.floor(totalMinutes/60)
    let minutes = totalMinutes % 60;
    let timeRecalculated = hours > 0 ? `${hours}h` : minutes < 0 ? `${minutes} min` : 'a few seconds ago..'


    return (
        <div className={styles.tweetContainer}>
            <div className={styles.topTweetContainer}>
                <Image 
                src='/colibri.png'
                width={50}
                height={50}
                alt='Logo Hackatweet'/>
                <p className={styles.firstname}>{data.user_id.firstname}</p>
                <p className={styles.tagandtime}>@{data.user_id.username} - {timeRecalculated}</p>
                

            </div>
            <div className={styles.contentTweet}>{data.user_id.content}</div>
            <div>
                <HeartIcon onClick={() => setIsliked(!isLiked)} value={isLiked}/>
                <TrashIcon onClick={onDelete}/>
            </div>

        </div>
    )

}

export default Tweet;