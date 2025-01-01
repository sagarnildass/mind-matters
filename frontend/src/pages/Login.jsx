import React from 'react';

import LoginForm from '../components/LoginForm';
import signupBg from '../assets/signup-bg.png';
import signupDesign from '../assets/signup-design.png';

const Login = () => {
    return (
        <div className="bg-app"
            style={{
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    background: `url(${signupDesign})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '185vh',
                    height: '50vh',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1, // Set the z-index to 1
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '12%', // Adjusted to 35% to move it up
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2, // Set the z-index to 2 to bring the text to the front
                    }}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Roboto',
                            fontWeight: '400',
                            lineHeight: 14,
                            letterSpacing: 2.52,
                            wordWrap: 'break-word',
                            color: '#FFFFFF',
                            marginBottom: '1rem',
                        }}
                    >
                        MIND MATTERS
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: '30%', // Adjusted to 50% to move it up
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 32,
                            fontFamily: 'Roboto',
                            fontWeight: '700',
                            lineHeight: 32,
                            wordWrap: 'break-word',
                            marginTop: '2rem',
                        }}
                    >
                        Welcome!
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '50rem',
                        marginRight: '27rem', // Adjust the marginLeft value to move the SignupForm to the left
                    }}
                >
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default Login;
