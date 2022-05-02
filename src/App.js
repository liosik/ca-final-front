import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import mainContext from "./context/mainContext";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import RegisterUser from "./pages/RegisterUser";
import LoginUser from "./pages/LoginUser";
import AddThread from "./pages/AddThread";
import AllThreads from "./pages/AllThreads";
import MyAccount from "./pages/MyAccount";
import SingleThread from "./pages/SingleThread";
import FavoritesPage from "./pages/FavoritesPage";

const App = () => {
    const [user, setUser] = useState(null)
    const [threads, setThreads] = useState([])
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"))

    async function check() {
        const item = {
            userSecret: localStorage.getItem('userSecret')
        }

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(item)
        }


        const response = await fetch(`http://localhost:4000/check`, options)
        const data = await response.json()

        if (data.success) {
            setUser(data.user)
            setThreads(data.threads)
        } else {
            alert(data.errorMessage)
            setThreads(data.threads)
        }
        if(!(storedFavorites)){
            localStorage.setItem("favorites", JSON.stringify([]))
        }

    }


    useEffect(() => {
        check()
    }, [])
    return (
        <mainContext.Provider value={{
            user,
            setUser,
            threads,
            setThreads,
            storedFavorites
        }}>
            <div className='mainbody'>
                <div className='container d-flex flex-column'>
                    <Router>
                        <div className='d-flex justify-content-between align-items-center'>
                            <Link to='/'>
                                <button>All Threads</button>
                            </Link>
                            <Link to='/favorites'>
                                <button>Favorites</button>
                            </Link>
                            {user && <Link to='/addthread'>
                                <button>Add Thread</button>
                            </Link>}

                            {!user &&
                            <div className='d-flex justify-content-between align-items-center'><Link to='/register'>
                                <button>Register</button>
                            </Link>
                                <Link to='/login'>
                                    <button>Login</button>
                                </Link>
                            </div>

                            }

                            {user &&
                            <div className='d-flex f justify-content-between align-items-center'>
                                <div>

                                </div>
                                <h3 className='m-1'>Logged in As:<Link to='/myaccount'>{user.username} </Link></h3>
                            </div>

                            }
                        </div>
                        <Routes>
                            <Route path="/register" element={<RegisterUser/>}/>
                            <Route path="/login" element={<LoginUser/>}/>
                            <Route path="/addthread" element={<AddThread/>}/>
                            <Route path="/" element={<AllThreads/>}/>
                            <Route path="/myaccount" element={<MyAccount/>}/>
                            <Route path="/threads/:id" element={<SingleThread/>}/>
                            <Route path="/favorites" element={<FavoritesPage/>}/>
                        </Routes>
                    </Router>
                </div>
            </div>
        </mainContext.Provider>
    );
};

export default App;