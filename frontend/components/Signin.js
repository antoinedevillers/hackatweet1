import { useState } from "react";
import Modal from 'react-modal';
import Image from "next/image";
import styles from "../styles/Signin.module.css";
import {useDispatch} from 'react-redux';
import { login } from '../reducers/user';

function SignIn({ modalSignInIsOpen, setModalSignInIsOpen }) {

    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //Fonction pour se connecter
    const handleRegister = () => {
        fetch('http://localhost:3000/users/signin', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({username, password })
        })
        .then(res => res.json())
        .then(data => {
            if(data) {
                console.log('data1',data.id)
                dispatch(login({username, firstname: data.firstname, token: data.token, _id: data.id}))
                
                setUsername('');
                setPassword('');
            }
        })
    }

    return (

        <Modal
            isOpen={modalSignInIsOpen}
            onRequestClose={() => setModalSignInIsOpen(false)}
            className={styles.modalContainer}
            style={{overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)', 
              }}}
        >
            <p className={styles.closeModal} onClick={() => setModalSignInIsOpen(false)}>X</p>
            <div>
            <Image
                src='/colibri.png'
                width={100}
                height={100}
            />
            </div>
            <div className={styles.InputsButtonContainer}>
                <h3>Connect to Hackatweet</h3>
                <input placeholder="Username" type='text' className={styles.input} onChange={(e) => setUsername(e.target.value)} value= {username}></input>
                <input placeholder="Password" type="password" className={styles.input} onChange={(e) => setPassword(e.target.value)} value = {password}></input>
                <button className={styles.button} onClick={() => handleRegister()}>Sign In</button>
            </div>

        </Modal>
    )
}

export default SignIn