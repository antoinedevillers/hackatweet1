import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import Tweet from './Tweet';


function Home() {

  const user = useSelector((state) => state.user.value);
  console.log(user)
  const dispatch = useDispatch();
  const [tweet, setTweet] = useState('')
  const [tweetLength, setTweetLength] = useState(0);
  const [tweetList, setTweetList] = useState([])

  useEffect(()=> {
    fetch('http://localhost:3000/tweets')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setTweetList(data.data)
    })
  }, [])
  const handleChange = (e) => {
    const value = e.target.value;
    setTweet(value);
    setTweetLength(value.length);
  };

  const handleRegisterTweet = () => {
   
    fetch('http://localhost:3000/tweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, content: tweet })
    })
      .then(res => res.json())
      .then(data => {
       if(data.result){
        setTweet('')
        setTweetList((prevTweetList) => [
          ...prevTweetList,
          { user_id: user.id, content: tweet, created_at: new Date() }, // Ajouter un tweet à la liste
        ]);
       }
      });
     
      
  }
  const handleDelete = (tweetId) => {
    fetch('http://localhost:3000/tweets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setTweetList((previousList) =>
            previousList.filter(
              (tweet) => tweet._id !== tweetId
            )
          ); // On met à jour la liste après la suppression
        }
      })
  }

  const tweets = tweetList.map((data, i) => {

    return <Tweet key={i} onDelete={handleDelete} data={data}/>
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
          <div className={styles.topMiddlePart}>
            <h3>Home</h3>
            <div className={styles.inputContainer}>
              <input
                placeholder="What's up?"
                className={styles.input}
                onChange={handleChange}
                value={tweet}></input>
            </div>
            <div className={styles.buttonTweetContainer}>
              <p className={styles.lengthTweet}>{tweetLength}/280</p>
              <button className={styles.tweetButton}
                onClick={() => handleRegisterTweet()}>Tweet</button>
            </div>
          </div>
          <div className={styles.listTweets}>{tweets}</div>


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
