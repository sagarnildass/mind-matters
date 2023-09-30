import React, { useState, useEffect, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentChat, selectRecentChat } from '../utils/recentChatSlice';

import NavbarHeader from '../components/NavbarHeader';

import Sidebar from '../components/Sidebar';
import signupBg from '../assets/signup-bg.png';
import ChatCards from '../components/ChatCards';
import ChatcardContent from '../components/ChatcardContent';
import { Link } from 'react-router-dom';

const ChatPage = () => {
    const dispatch = useDispatch();

    // Fetch the token from local storage
    const token = localStorage.getItem('access_token');

    // Fetch recent chats when component mounts
    useEffect(() => {
        if (token) {
            dispatch(fetchRecentChat(token));
        }
    }, [dispatch, token]);

    const recentChats = useSelector(selectRecentChat);

    const userId = useSelector(state => state.user.user_id);

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const sidebarToggle = async () => {
        setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible);
        //alert("Ok");
    };

    return (
               <div className="bg-app mx-auto" >
            <div className="min-h-screen flex flex-col">

                <NavbarHeader  sidebarToggle={sidebarToggle} />
                <div className="flex flex-1">
                    {isSidebarVisible &&   <Sidebar />  }

                    <main className=" flex-1 p-4 overflow-hidden">
                    {/*MAIN */}
                     <div className="left-0 top-0 text-white text-xl font-bold ml-4">
                        <h1>Your Recent Chat History</h1>
                    </div>




                     <div className="flex flex-1 flex-col md:flex-row lg:flex-row mx-0 mt-4 " >


                    <div className=" w-full top-2/4 flex flex-col items-center">
                    {/* Here's the new heading */}
                    <div className="mt-4 w-3/4 flex flex-wrap justify-start">
                        {recentChats.slice(-5).map(chat => (
                            <ChatCards className="flex-grow" key={chat.session_id}>
                                <ChatcardContent title={`Session ${chat.session_id}`} number={chat.content} userId={userId} sessionId={chat.session_id} />
                            </ChatCards>
                        ))}
                    </div>
                    <Link to={`/new-chat/${userId}`}>
                        <button className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-8 mt-10">
                            Start New Chat
                        </button>
                    </Link>
                </div>





                     </div>

                    {/*END MAIN*/}
                    </main>

                </div>
            </div>
        </div>
    );
};

export default ChatPage;
