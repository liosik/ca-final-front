import React, {useContext, useEffect, useRef, useState} from 'react';
import mainContext from "../context/mainContext";
import SmallProfile from "../components/SmallProfile";
import {Modal} from "react-bootstrap";
import {buttonClasses} from "@mui/material";
import {useNavigate} from "react-router-dom";

const MyAccount = () => {
    const {user, setUser, threads} = useContext(mainContext)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const pictureRef = useRef()
    const nav = useNavigate()
    const [userThreads, setUserThreads] = useState(null)

    useEffect(() => {
       const newThreads = threads.filter(x => x.user.secret === user.secret)
        setUserThreads(newThreads)
    }, [])

    const changePicture = async () => {
        const item = {
            newPicture: pictureRef.current.value,
            userSecret: user.userSecret
        }
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        }
        const response = await fetch(`http://localhost:4000/changepicture`, options)
        const data = await response.json()
        if (data.success) {
            alert("Success! You've Changed Picture")
            setUser(data.user)
            handleClose()
        } else {
            alert(data.errorMessage)
        }

    }
    return (
        <div className='d-flex  m-5'>
            <div className='d-flex flex-column'>
                <SmallProfile/>
                <button onClick={handleShow}>Change Picture</button>
            </div>
            <div className='d-flex flex-column w-100'>
                {userThreads && userThreads.map((x,i) => {
                    return(
                        <button onClick={() => nav(`/threads/${x._id}`)} className='w-100 thread' key={i}>{x.name}</button>
                    )
                })}
            </div>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Picture Change</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input ref={pictureRef} type="text"/>
                </Modal.Body>
                <Modal.Footer>
                    <button variant="secondary" onClick={handleClose}>
                        Close
                    </button>
                    <button variant="primary" onClick={changePicture}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyAccount;