import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import signupBg from '../assets/signup-bg.png';
import axios from 'axios';


import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';


const HomePage = () => {


    return (
        <div className="flex min-h-screen">
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
                    <div className="absolute left-80 top-28 text-white text-4xl font-bold">
                        <h1>Home</h1>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HomePage;