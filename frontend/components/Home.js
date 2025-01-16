import { useState } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import {useDispatch, useSelector} from 'react-redux';
import { logout } from '../reducers/user';


function Home() {

  const user = useSelector((state) => state.user.value);
  const dispatch =useDispatch();

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
              <button className={styles.logoutButton} onClick={()=> dispatch(logout())}>Logout</button>
            </div>

          </div>
        </div>
        <div className={styles.middlepart}>
          <div className={styles.topMiddlePart}>
            <h3>Home</h3>
            <div className={styles.inputContainer}>
              <input placeholder= "What's up?"className={styles.input}></input>
            </div>
            <div className={styles.buttonTweetContainer}>
              <p className={styles.lengthTweet}>0/280</p>
              <button className={styles.tweetButton}>Tweet</button>
            </div>
          </div>
          <div className={styles.listTweets}></div>


        </div>
        <div className={styles.rightpart}>
          <h3>Trends</h3>
          <div></div>
        </div>


      </main>

    </div>
  );
}

export default Home;
