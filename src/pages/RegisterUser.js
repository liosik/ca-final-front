import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";

const RegisterUser = () => {
    const pw1Ref = useRef()
    const pw2Ref = useRef()
    const usernameRef = useRef()
    const nav = useNavigate()




    async function registerUser() {
        const item = {

            username: usernameRef.current.value,
            pw1: pw1Ref.current.value,
            pw2: pw2Ref.current.value,
            picture: '',

        }

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        }


        const response = await fetch(`http://localhost:4000/register`, options)
        const data = await response.json()
        if (data.success) {
            alert("Success! You've Added a User")
            nav("/login")
        } else {
            alert(data.errorMessage)
        }

    }

    return (
        <div className='d-flex flex-column m-5 align-items-center'>

            <input ref={usernameRef} defaultValue="asdasd" type="text"/>
            <input defaultValue="asdasd" ref={pw1Ref} type="text"/>
            <input defaultValue="asdasd" ref={pw2Ref} type="text"/>

            <button onClick={registerUser}>Register</button>

        </div>
    );
};

export default RegisterUser;