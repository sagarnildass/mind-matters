
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faCog, faBell } from '@fortawesome/free-solid-svg-icons';

// import { NotificationContext } from '../utils/NotificationContext';
// import NotificationCard from './NotificationCard';

const Navbar = () => {

    // const { notificationsCount, resetNotificationsCount, message } = useContext(NotificationContext);
    // const [showNotification, setShowNotification] = useState(false);


    const handleLogout = () => {
        localStorage.clear();
    };

    // const handleBellClick = () => {
    //     resetNotificationsCount();  // reset notificationsCount to 0 when the bell is clicked
    //     setShowNotification(prev => !prev);  // toggle notification card visibility
    // };

    return (
        <nav className="fixed w-full top-0 flex justify-end items-center p-5 pr-10 bg-transparent z-10 mt-10">
            <div className="flex items-center space-x-5">
                <div className="flex items-center border-2 border-gray-800 p-2 rounded-full">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-800 text-2xl" />
                    <input
                        className="ml-2 bg-transparent outline-none placeholder-gray-800 text-gray-200"
                        type="text"
                        placeholder="Type here..."
                    />
                </div>
                <div className="flex items-center space-x-2 text-white">
                    <FontAwesomeIcon icon={faUser} className='text-2xl' />
                    <Link to="/login" onClick={handleLogout}>
                        <p>Log out</p>
                    </Link>
                </div>
                <FontAwesomeIcon icon={faCog} className="text-white text-2xl" />

                {/* Display the notification count as a badge */}
                {/* <button onClick={handleBellClick} className="relative inline-block">
                    <FontAwesomeIcon icon={faBell} className="text-white cursor-pointer text-2xl" />
                    {notificationsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 h-5 w-5 rounded-full flex items-center justify-center text-white text-sm">
                            {notificationsCount}
                        </span>
                    )}
                </button>
                {showNotification &&
                    <div className="absolute right-0 w-64 transform translate-y-full mt-5 py-2 bg-white border rounded shadow-xl">
                        <NotificationCard message={message} />
                    </div>
                } */}
            </div>
        </nav>
    );
};

export default Navbar;