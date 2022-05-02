import React, {useContext, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import mainContext from "../context/mainContext";

const LoginUser = () => {
    const pw1Ref = useRef()
    const usernameRef = useRef()
    const [stayLogged, setStayLogged] = useState(false)
    const nav = useNavigate()
    const {setUser, setThreads} = useContext(mainContext)


    async function registerUser() {
        const item = {
            username: usernameRef.current.value,
            pw1: pw1Ref.current.value,
            stayLogged: stayLogged


        }
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        }
        const response = await fetch(`http://localhost:4000/login`, options)
        const data = await response.json()
        if (data.success) {
            alert("Success! You've Logged In")
            nav("/")
            setUser(data.user)
            setThreads(data.threads)
            if (stayLogged) {
                localStorage.setItem('userSecret', data.user.secret);
            } else {
                localStorage.setItem('userSecret', null);
            }
        } else {
            alert(data.errorMessage)
        }
    }

    return (
        <div>
            <div className='d-flex flex-column m-5 align-items-center'>

                <input ref={usernameRef} defaultValue="asdasd" type="text"/>
                <input defaultValue="asdasd" ref={pw1Ref} type="text"/>
                Stay Logged In
                <input onChange={() => setStayLogged(!stayLogged)} type="checkbox"/>

                <button onClick={registerUser}>Login</button>

            </div>
        </div>
    );
};

export default LoginUser;