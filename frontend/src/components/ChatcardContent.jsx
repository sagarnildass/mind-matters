import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

// eslint-disable-next-line react/prop-types
const ChatcardContent = ({ title, number, userId, sessionId }) => {

    const deleteSession = async (sessionId, token) => {
        const url = `${API_URL}/sessions/delete_session/${sessionId}/`;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
        };
    
        try {
            await axios.delete(url, { headers });
        } catch (error) {
            console.error("Error deleting session:", error);
            // Handle error accordingly, maybe return a message or throw the error to be caught in the calling function
        }
    };

    // This function will be called when delete button is clicked
    const handleDelete = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            await deleteSession(sessionId, token);
            // Handle successful deletion, e.g., refresh the chat cards or show a success message
            window.location.reload(false);
        } else {
            console.error("Token not found");
        }
    };

    return (
        <div className="flex flex-col h-full justify-between items-start w-full p-3">
            <div className="flex-grow overflow-hidden">
                <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{title}</h5>
                </a>
                <p className="font-normal text-gray-700 dark:text-gray-400 overflow-ellipsis overflow-hidden">{number}</p>
            </div>
            <Link to={`/new-chat/${userId}/${sessionId}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Resume Session
                <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </Link>
            <button 
                onClick={handleDelete} 
                className="mt-2 px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none">
                Delete Session
            </button>
        </div>
    )
};

export default ChatcardContent;
