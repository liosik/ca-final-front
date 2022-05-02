import React, {useContext, useRef, useState, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import mainContext from "../context/mainContext";
import {Pagination} from "react-bootstrap";
import io from "socket.io-client";


const SingleThread = () => {
    const {id} = useParams()
    const {threads, user, setThreads} = useContext(mainContext)
    const thisThread = threads.find(x => x._id === id)
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"))
    const isFavorite = storedFavorites.find(x => x._id === id)
    const nav = useNavigate()
    const commmentRef = useRef()
    const socket = io.connect("http://localhost:4001")
    const postsPerPage = 10
    const [currentPage, setCurrentPage] = useState(1)
    const indexOfLastComment = currentPage * postsPerPage
    const indexOfFirstComment = indexOfLastComment - postsPerPage
    const currentComments = thisThread.comments.slice(indexOfFirstComment, indexOfLastComment)

    const items = [];

    for (let number = 1; number <= Math.ceil(Number(thisThread.comments.length) / postsPerPage); number++) {
        items.push(
            <Pagination.Item onClick={() => setCurrentPage(number)} key={number} active={number === currentPage}>
                {number}
            </Pagination.Item>,
        );
    }

    const addToFavorites = () => {
        if (storedFavorites) {
            if (isFavorite) {
                alert("Already in Favorites")
            } else {
                storedFavorites.push(thisThread)
                localStorage.setItem("favorites", JSON.stringify(storedFavorites))
                alert("Added to Favorites")
                nav('/favorites')
            }
        } else {
            const favorites = []
            favorites.push(thisThread)
            localStorage.setItem("favorites", JSON.stringify(favorites))

        }


    }
    const removeFromFavorites = () => {
        const filteredFavorites = storedFavorites.filter(x => x._id !== id)
        localStorage.setItem("favorites", JSON.stringify(filteredFavorites))
        alert("Removed From Favorites")
        nav('/favorites')
    }
    const addComment = async () => {
        const item = {
            id,
            comment: commmentRef.current.value,
            user
        }
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        }
        const response = await fetch(`http://localhost:4000/addcomment`, options)
        const data = await response.json()
        if (data.success) {
            alert("Success! You've Added Comment")
            setThreads(data.threads)
        } else {
            alert(data.errorMessage)
        }
        await socket.emit("new_comment", item)
    }

    useEffect(() => {
        socket.emit("join_thread", id)
    }, [])

    useEffect(() =>{
        socket.on("update_thread", (data) => {
            setThreads(data)
        })
    }, [socket])
    return (
        <div className='d-flex mt-5 flex-column align-items-center justify-content-center'>
            <b><h1>{thisThread.name}</h1></b>
            <div className='d-flex align-items-center flex-column'>
                {!isFavorite &&
                <button onClick={addToFavorites} className='w-100'>Add to favorites</button>
                }
                {isFavorite &&
                <button onClick={removeFromFavorites}>Remove From Favorites</button>}


                <img className='roundImg m-2' src={thisThread.user.picture} alt=""/>
                <h3>Created by: {thisThread.user.username}</h3>
            </div>
            <Pagination>{items}</Pagination>
            {thisThread.comments && currentComments.map((x, i) => {
                return (
                    <div key={i} className='d-flex justify-content-between w-100'>
                        <div className='d-flex flex-column align-items-center justify-content-center border w-200'>
                            <img className='roundImg' src={x.user.picture} alt=""/>
                            <h3><b>{x.user.username}</b></h3>
                        </div>
                        <div className='d-flex flex-column align-items-center justify-content-center w-100 border'>
                            {x.comment.includes("http") ? <iframe src={x.comment} frameBorder="0"/> : <b>{x.comment}</b>}
                        </div>

                    </div>
                )
            })}
            <div className='d-flex flex-column m-5 w-100'>
                <h2>Add Comment</h2>
                <input ref={commmentRef} className='w-100' placeholder='Thread Name... Max 20 Letters' type="text"/>
                <button onClick={addComment}>Add Comment</button>
            </div>


        </div>
    );
};

export default SingleThread;