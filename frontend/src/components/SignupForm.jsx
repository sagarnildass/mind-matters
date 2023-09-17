import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);


    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any field is blank
        if (!username || !email || !password || !firstName || !lastName || !gender || !age) {
            setError('No field can be blank');
            return;
        }

        if (!/(?=.*[A-Za-z])(?=.*\d).{7,}/.test(password)) {
            setError('Password must be at least 7 characters long and contain both letters and numbers');
            return;
        }

        // Check email domain
        const validDomains = ['artelus.ai', 'artelus.in', 'artelus.com'];
        const emailDomain = email.includes('@') ? email.split('@')[1] : '';
        if (!validDomains.includes(emailDomain)) {
            setError('Invalid email domain. Only artelus domains are allowed');
            return;
        }

        // Create a request body with the form data
        const requestBody = {
            user_id: 0,
            username: username,
            email: email,
            password: password,
            first_name: firstName, // Added this line
            last_name: lastName,   // Added this line
            gender: gender,       // Added this line
            age: age,             // Added this line
            creation_date: new Date().toISOString('en-IN', { timeZone: 'Asia/Kolkata' }),
            remember_me: rememberMe, // Include the "Remember me" flag in the request body
        };

        try {
            const response = await axios.post('https://mentalhealthapi.artelus.in/api/auth/register', requestBody);

            if (response.status === 200) {
                // Registration successful
                console.log('Registration successful');
                // Perform any necessary actions after successful registration

                // Reset form fields
                setUsername('');
                setEmail('');
                setPassword('');
                setError('');

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
                // Registration failed
                console.error('Registration failed');
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred during registration. Please try again.');
            }
        }
    };

    // Check if there is a saved "Remember me" flag in local storage
    // and set the state accordingly
    React.useEffect(() => {
        const savedRememberMe = localStorage.getItem('remember_me');

        if (savedRememberMe) {
            setRememberMe(true);
        }
    }, []);

    return (
        <div className={styles.signUp}>
            <div className={styles.background}>
                <div className={styles.backgroundChild} />
                <div className={styles.alreadyHaveAnContainer}>
                    <span>
                        <span className={styles.alreadyHaveAn1}>Already have an account?</span>
                        <b className={styles.b}>{` `}</b>
                    </span>
                    <b className={styles.b}>
                        <Link to="/login">Login</Link>
                    </b>
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

                    <div className={styles.email1}>
                        <input
                            type="email"
                            className={styles.inputfieldtext}
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email" className={styles.password1}>
                            Email
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
                    <div className={styles.firstName}>
                        <input
                            type="text"
                            className={styles.inputfieldtext}
                            placeholder="Your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label htmlFor="firstName" className={styles.password1}>
                            First Name
                        </label>
                    </div>
                    <div className={styles.lastName}>
                        <input
                            type="text"
                            className={styles.inputfieldtext}
                            placeholder="Your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label htmlFor="lastName" className={styles.password1}>
                            Last Name
                        </label>
                    </div>
                    <div className={styles.genderAgeContainer}>
                        <div className={styles.gender}>
                            <select
                                className={styles.inputfieldtext}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <label htmlFor="gender" className={styles.password1}>
                                Gender
                            </label>
                        </div>

                        {/* For Age */}
                        <div className={styles.age}>
                            <input
                                type="number"
                                className={styles.inputfieldtext}
                                placeholder="Age"
                                min="0"
                                max="150" // You can adjust this based on the maximum age you want to accept.
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            <label htmlFor="age" className={styles.password1}>
                                Age
                            </label>
                        </div>
                    </div>


                    <button type="submit" className={styles.widthStructure}>
                        <div className={styles.buttonbase}>
                            <div className={styles.buttonText}>SIGN UP</div>
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

                <div className={styles.registerWith}>
                    <div className={styles.title}>
                        <b className={styles.register}>Register</b>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
