import { useState } from "react";
import Modal from 'react-modal';
import Image from "next/image";
import styles from "../styles/Signup.module.css";
import {useDispatch} from 'react-redux';
import { login } from '../reducers/user';

function SignUp({ modalSignUpIsOpen, setModalSignUpIsOpen }) {

    const dispatch = useDispatch();

    const [firstname, setFirstname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //Fonction pour s'inscrire
    const handleRegister = () => {
        fetch('http://localhost:3000/users/signup', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({firstname, username, password})
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                dispatch(login({firstname, username, token: data.token}))
                setUsername('')
                setFirstname('')
                setPassword('')
            }
        })
    }


    return (

        <Modal
            isOpen={modalSignUpIsOpen}
            onRequestClose={() => setModalSignUpIsOpen(false)}
            className={styles.modalContainer}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                }
            }}
        >
            <p className={styles.closeModal} onClick={() => setModalSignUpIsOpen(false)}>X</p>
            <div>

                <Image
                    src='/colibri.png'
                    width={100}
                    height={100}
                />
            </div>
            <div className={styles.InputsButtonContainer}>
                <h3>Create your Hackatweet account</h3>
                <input placeholder="Firstname" type= 'text' className={styles.input} onChange={(e) => setFirstname(e.target.value)} value={firstname} ></input>
                <input placeholder="Username" type= 'text' className={styles.input} onChange={(e) => setUsername(e.target.value)} value={username}></input>
                <input placeholder="Password" type='password' className={styles.input} onChange={(e) => setPassword(e.target.value)} value={password}></input>
                <button className={styles.button} onClick={() => handleRegister()}>Sign Up</button>
            </div>

        </Modal >
    )
}

export default SignUp;