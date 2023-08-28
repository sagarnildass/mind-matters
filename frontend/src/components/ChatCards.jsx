import React from 'react';

const ChatCards = ({ children, className }) => (
    <div className={`max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4 ${className}`}>
        {children}
    </div>
);

export default ChatCards;
