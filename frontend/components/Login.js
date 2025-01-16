import { useState } from 'react';
import styles from '../styles/Login.module.css';
import Image from 'next/image';
import SignIn from './Signin';
import SignUp from './Signup';

function Login() {

  const [modalSignUpIsOpen, setModalSignUpIsOpen] = useState(false);
  const [modalSignInIsOpen, setModalSignInIsOpen] = useState(false);

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.leftpart}></div>
        <div className={styles.middlepart}>

          <div className={styles.headerLogo}>
            <Image
              src='/colibri.png'
              width={100}
              height={100}
              alt='Logo Hackatweet'
            />
          </div>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>See what's happening</h1>
            <div className={styles.signContainer}>
              <h2>Join Hackatweet today</h2>
              <div className={styles.buttonsContainer}>
                <button className={styles.signUp} onClick={() => setModalSignUpIsOpen(true)}>Sign up</button>
                <p>Already have an account?</p>
                <button className={styles.signIn} onClick={() => setModalSignInIsOpen(true)}>Sign in</button>
              </div>
            </div>
          </div>


        </div>
        <div className={styles.rightpart}></div>


      </main>
      <div>
        {modalSignUpIsOpen && <SignUp
          modalSignUpIsOpen={modalSignUpIsOpen}
          setModalSignUpIsOpen={setModalSignUpIsOpen} /> }
        {modalSignInIsOpen && <SignIn
          modalSignInIsOpen={modalSignInIsOpen}
          setModalSignInIsOpen={setModalSignInIsOpen} /> }

      </div>
    </div>
  );
}

export default Login;
