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

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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

                    <main className=" flex-1 p-8 overflow-hidden">
                    {/*MAIN */}
                     <div className="left-0 top-0 text-white text-xl 2xl:text-3xl font-bold ml-0  mr-0  mt-0 mb-0">
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


<div className="flex mt-0 p-0 w-full w-100">
                  {showModal && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-md shadow-lg w-1/3">
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <textarea
                          className="border p-2 w-full mt-2"
                          placeholder="Describe the image or ask a question..."
                          onChange={(e) => setImageDescription(e.target.value)}
                        ></textarea>
                        <button
                          className="bg-blue-500 text-white p-2 mt-2 rounded"
                          onClick={handleImageUpload}
                        >
                          Upload and Send
                        </button>
                        <button
                          className="bg-red-500 text-white p-2 mt-2 rounded ml-2"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ width: 320, height: 240 }} // Adjust for a smaller resolution
                    style={{
                      position: "fixed",
                      bottom: "80px",
                      right: "20px",
                      width: "200px",
                      height: "150px", // Adjust the width and height to make it much smaller and in bottom right
                    }}
                  />
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
