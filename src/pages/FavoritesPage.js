import React from 'react';
import {useNavigate} from "react-router-dom";

const FavoritesPage = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    const nav = useNavigate()
    return (
        <div>
            <h1>Favorite Threads</h1>
            {storedFavorites && storedFavorites.map((x,i) => {
                return(
                    <div key={i}>
                        <button onClick={() => nav(`/threads/${x._id}`)} className='thread d-flex justify-content-between'>
                            <div className='flex-grow-1 w-200 d-flex justify-content-start'><b>{x.name}</b></div>
                            <div className='flex-grow-1 w-200'>
                                Created By: <b>{x.user.username}</b>
                            </div>
                            <div className='flex-grow-1 w-200'>
                                Comments: <b>{x.comments.length}</b>
                            </div>


                        </button>
                    </div>

                )
            })}
        </div>
    );
};

export default FavoritesPage;