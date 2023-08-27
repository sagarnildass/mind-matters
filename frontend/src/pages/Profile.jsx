import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import signupBg from '../assets/signup-bg.png';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { fetchUserData, selectUsername } from '../utils/userSlice';  // Import the fetchUserData action and the selectUsername selector

const ProfilePage = () => {
    const dispatch = useDispatch();  // Use the useDispatch hook from 'react-redux'
    const firstName = useSelector(state => state.user.first_name);  // Use selectors to get user data from the Redux store
    const lastName = useSelector(state => state.user.last_name);
    console.log('First name:', firstName);
    console.log('Last name:', lastName);

    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [showUploadCard, setShowUploadCard] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);


    useEffect(() => {

        const fetchProfileImage = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/api/image/get-profile-image/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProfileImageUrl(response.data.profile_image_url);
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        fetchProfileImage();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        dispatch(fetchUserData(token));  // Dispatch the fetchUserData action to get user data


    }, [dispatch]);

    const handleProfileImageChange = () => {
        setShowUploadCard(true);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('http://127.0.0.1:8000/api/image/upload-profile-picture/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message === "Profile picture updated successfully!") {
                // Refresh the page to reflect the new image
                window.location.reload();
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
        }
    };

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 relative">
                <div className="relative h-full">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${signupBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    <Navbar />

                    <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6/12 text-center">
                        <div className="text-white">
                            {/* User Information Section */}
                            {profileImageUrl ? (
                                <img src={profileImageUrl} alt="Profile" className="h-64 w-64 mx-auto rounded-full object-cover object-center" />
                            ) : (
                                <div className="h-64 w-64 mx-auto bg-gray-600 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUser} className="text-6xl text-white" />
                                </div>
                            )}
                            <h1 className="text-4xl font-bold mt-8">{firstName} {lastName}</h1>
                            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none" onClick={handleProfileImageChange}>
                                Change Profile Picture
                            </button>

                            {/* Emotion Insights Section */}
                            <div className="mt-16">
                                <h2 className="text-2xl">Your Emotion Insights</h2>
                                {/* Display emotion insights and weekly summary similar to the HomePage */}
                            </div>
                        </div>

                        {showUploadCard && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 bg-white p-8 rounded-lg shadow-2xl border border-gray-200">
                                <h2 className="text-2xl mb-4 font-semibold text-center">Upload New Profile Picture</h2>
                                <div className="border-b-2 border-gray-200 mb-4"></div> {/* Horizontal line */}
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border-2 border-gray-200 rounded"
                                    />
                                </div>
                                <div className="flex justify-between mt-4 space-x-4">
                                    <button
                                        className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none transition duration-300 ease-in-out"
                                        onClick={handleFileUpload}>
                                        Upload
                                    </button>
                                    <button
                                        className="w-1/2 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 focus:outline-none transition duration-300 ease-in-out"
                                        onClick={() => setShowUploadCard(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
