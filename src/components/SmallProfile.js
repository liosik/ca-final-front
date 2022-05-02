import React, {useContext} from 'react';
import mainContext from "../context/mainContext";
import {useNavigate} from "react-router-dom";


const SmallProfile = () => {
    const {user, setUser} = useContext(mainContext)
    const nav = useNavigate()
    return (
        <div className='d-flex flex-column m-5'>
            <img className='roundImg' src={user.picture} alt="user picture"/>
            <h3><b>{user.username}</b></h3>
            <button onClick={() => {
                setUser(null)
                nav("/")
                localStorage.setItem('userSecret', null)
            }
            }>Log Out
            </button>
        </div>
    );
};

export default SmallProfile