import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentChat, selectRecentChat } from '../utils/recentChatSlice';

import Navbar from '../components/Navbar';
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

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 relative">
                <div
                    className="w-full h-full fixed top-0 left-0 z-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${signupBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Navbar />

                <div className="absolute w-full top-1/4 flex flex-col items-center">
                    {/* Here's the new heading */}
                    <h2 className="text-3xl text-white mt-4">Your Recent Chat History</h2>

                    <div className="mt-6 w-3/4 flex flex-wrap justify-start">
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
        </div>
    );
};

export default ChatPage;
