import React, {useContext, useRef} from 'react';
import mainContext from "../context/mainContext";
import {useNavigate} from "react-router-dom";


const AddThread = () => {
    const threadRef = useRef()
    const {user, setThreads} = useContext(mainContext)
    const nav = useNavigate()
    async function addThread() {
        const item = {
            name: threadRef.current.value,
            user,
            comments: [],
        }
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        }
        const response = await fetch(`http://localhost:4000/addthread`, options)
        const data = await response.json()
        if (data.success) {
            alert("Success! You've Added Thread")
            nav("/")
            setThreads(data.threads)
        } else {
            alert(data.errorMessage)
        }

    }

    return (
        <div className='d-flex flex-column m-5 border'>
            <h2>Add Thread</h2>
            <input className='w-100' ref={threadRef} placeholder='Thread Name... Max 20 Letters' type="text"/>
            <button onClick={addThread}>Add Thread</button>
        </div>
    );
};

export default AddThread;