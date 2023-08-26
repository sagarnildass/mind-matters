import React from 'react';
import { useSelector } from 'react-redux';
import { selectRecentChat } from '../utils/recentChatSlice';

const RecentChatSummary = () => {
    const recentChat = useSelector(selectRecentChat);

    // Get the last 2 messages for the snippet
    const snippet = recentChat.slice(-2).map(chat => {
        const sender = chat.sentiment === null ? "AI: " : "You: ";
        const color = chat.sentiment === null ? "text-gray-300" : "text-blue-500";
        return <span className={`${color} block mt-2`}>{sender + chat.content}</span>;
    });

    return (
        <div className="absolute top-28 right-2 w-1/4 p-4 rounded-3xl shadow-lg" // Used absolute positioning
            style={{
                backgroundImage: 'linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)',
                Color: 'rgba(0, 0, 0, 0.87)'
            }}
        >
            <h3 className="text-xl font-bold mb-2 text-white">Recent Chat</h3>
            <div className="text-m mb-2">
                {snippet}
            </div>
            <button className="bg-blue-500 text-white px-2 py-1 text-m rounded hover:bg-blue-600 mt-2">Continue Chat</button>
        </div>
    );
};

export default RecentChatSummary;
