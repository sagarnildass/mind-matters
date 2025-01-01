import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const API_URL = import.meta.env.VITE_APP_API_URL;

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any field is blank
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        const requestBody = {
            username: username,
            password: password,
            remember_me: rememberMe, // Include the "Remember me" flag in the request body

        };

        // Create a request body with the form data
        // const requestBody = `remember_me=true&grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`;

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, requestBody, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.status === 200) {
                // Login successful
                console.log('Login successful');
                console.log(response.data)
                // Perform any necessary actions after successful login

                // Reset form fields
                setUsername('');
                setPassword('');
                setError('');
                setAccessToken(response.data.access_token)
                localStorage.setItem('access_token', response.data.access_token)
                localStorage.setItem('username', username)


                if (rememberMe) {
                    // Save the "Remember me" flag in local storage
                    localStorage.setItem('remember_me', rememberMe);
                } else {
                    // Clear the saved "Remember me" flag from local storage
                    localStorage.removeItem('remember_me');
                }

                // Navigate to the root URL ("/")
                navigate('/');
            } else {
                // Login failed
                console.error('Login failed');
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                setError(error.response.data.detail);
            } else {
                setError('An error occurred during login. Please try again.');
            }
        }
    }



    // Check if there is a saved "Remember me" flag in local storage
    // and set the state accordingly
    useEffect(() => {
        // Check if there is a saved "Remember me" flag in local storage
        // and set the state accordingly
        const savedRememberMe = localStorage.getItem('remember_me');
        const savedAccessToken = localStorage.getItem('access_token');

        if (savedRememberMe) {
            setRememberMe(true);
        }
        if (savedAccessToken) {
            setAccessToken(savedAccessToken);
        }

        // Set the access token as a default header for all subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedAccessToken}`;

        // Function to fetch user information
        const fetchUserInformation = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/me`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${savedAccessToken}`
                    }
                });

                if (response.status === 200) {
                    // User information received successfully
                    const { username } = response.data;
                    console.log('Username:', username);
                } else {
                    // Failed to fetch user information
                    console.error('Failed to fetch user information');
                    navigate('/login'); // Redirect the user to the login screen
                }
            } catch (error) {
                console.error('An error occurred while fetching user information:', error);
                navigate('/login'); // Redirect the user to the login screen
            }
        };

        // Fetch user information initially
        fetchUserInformation();

        // Fetch user information every 30 minutes
        const intervalId = setInterval(fetchUserInformation, 30 * 60 * 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.login}>
            <div className={styles.background}>
                <div className={styles.backgroundChild} />
                <div className={styles.alreadyHaveAnContainer}>
                    <span>
                        <span className={styles.alreadyHaveAn1}>Do not have an account?</span>
                        <b className={styles.b}>{` `}</b>
                    </span>
                    <b className={styles.b}>
                        <Link to="/signup">Sign up</Link>
                    </b>
                </div>
                <div className={styles.registerWith}>
                    <div className={styles.title}>
                        <b className={styles.register}>Login</b>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.name}>
                        <input
                            type="text"
                            className={styles.inputfieldtext}
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="name" className={styles.password1}>
                            Username
                        </label>
                    </div>

                    <div className={styles.password}>
                        <input
                            type="password"
                            className={styles.inputfieldtext}
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password" className={styles.password1}>
                            Password
                        </label>
                    </div>

                    <button type="submit" className={styles.widthStructure}>
                        <div className={styles.buttonbase}>
                            <div className={styles.buttonText}>LOGIN</div>
                        </div>
                    </button>
                </form>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.rememberMe}>
                    <input
                        type="checkbox"
                        id="remember"
                        className={styles.switchbase}
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember" className={styles.rememberMe1}>
                        Remember me
                    </label>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
