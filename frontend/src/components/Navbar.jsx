
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faCog, faBell, faComments } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// import { NotificationContext } from '../utils/NotificationContext';
// import NotificationCard from './NotificationCard';
const API_URL = import.meta.env.VITE_APP_API_URL;

const Navbar = () => {
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const userId = useSelector(state => state.user.user_id);
    // const { notificationsCount, resetNotificationsCount, message } = useContext(NotificationContext);
    // const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get(`${API_URL}/api/image/get-profile-image/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Profile image:', response.data.profile_image_url);
                setProfileImageUrl(response.data.profile_image_url);
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        fetchProfileImage();
    }, []);

    useEffect(() => {
        // Close the dropdown if clicking outside of it
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
    };

    // const handleBellClick = () => {
    //     resetNotificationsCount();  // reset notificationsCount to 0 when the bell is clicked
    //     setShowNotification(prev => !prev);  // toggle notification card visibility
    // };

    return (
        <nav className=" w-full top-0 flex justify-end items-center p-2 bg-transparent z-0 mt-2 mb-2 mr-4">
            <div className="flex items-center space-x-4">
                <Link to={`/new-chat/${userId}`}>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:py-1 sm:px-2">
                        <div className="flex justify-content-center">
                        <FontAwesomeIcon icon={faComments} className="p-1 text-xl   " />
                        <div className=" hide_newchat_text p-1"> New Chat </div>
                        </div>
                    </button>
                </Link>
                <FontAwesomeIcon icon={faCog} className="text-white text-3xl" />
                <div className="flex items-center space-x-2 text-white relative" ref={dropdownRef}>
                    {/* Profile picture or default icon */}
                    <button onClick={() => setShowDropdown(!showDropdown)}>
                        {profileImageUrl ? (
                            <img
                                src={profileImageUrl}
                                alt="Profile"
                                className="h-12 w-12 rounded-full object-cover object-center"
                            />
                        ) : (
                            <FontAwesomeIcon icon={faUser} className='text-3xl' />
                        )}
                    </button>

                    {/* Dropdown menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-20 w-48 bg-white rounded-md shadow-xl z-20">
                            <Link to={`/profile/${userId}`} className="block px-4 py-2 text-black hover:bg-gray-100">
                                Profile
                            </Link>
                            <Link to="/login" onClick={handleLogout} className="block px-4 py-2 text-black hover:bg-gray-100">
                                Log out
                            </Link>
                        </div>
                    )}
                </div>

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
