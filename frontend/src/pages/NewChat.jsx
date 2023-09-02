import React, { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPlus, faRobot, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import signupBg from '../assets/signup-bg.png';
import { fetchUserData, selectUsername } from '../utils/userSlice';

const NewChat = () => {
    const dispatch = useDispatch();
    // const user_id = useSelector(state => state.user.user_id);  // Use selectors to get user data from the Redux store
    const { user_id, session_id } = useParams();
    console.log("URL Params:", { user_id, session_id });

    // console.log('User id:', user_id);
    const [messages, setMessages] = useState([]);
    const textToSpeechEnabledRef = useRef(true);
    const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
    const [currentMessage, setCurrentMessage] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [imageDescription, setImageDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const websocketRef = useRef(null); // Reference to manage WebSocket
    const chatContainerRef = useRef(null);

    const handleImageUpload = async () => {
        const token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/image/upload-image/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Send WebSocket messages
            if (response.data.filename) {
                websocketRef.current.send(`USER_SENT_IMAGE:${response.data.filename}`);
                websocketRef.current.send(imageDescription);
            }

            setShowModal(false);
            alert('You can now chat about the image you sent.');
        } catch (error) {
            console.error("Error uploading the image:", error);
        }
    };



    async function checkCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Permission granted, close the stream and return true
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (err) {
            // Permission denied or any other error occurred
            console.error("Camera permission error:", err);
            return false;
        }
    }

    useEffect(() => {
        checkCameraPermission().then(hasPermission => {
            if (hasPermission) {
                // If permission granted, tell the server to start the webcam
                if (websocketRef.current) {
                    websocketRef.current.send('start-cam');
                }
            } else {
                // Inform the user about the need for camera permissions
                alert("Camera permission is required for emotion analysis.");
            }
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        dispatch(fetchUserData(token)); // Assuming you have access to the token
    }, [dispatch]);

    const speak = (text) => {
        // console.log(textToSpeechEnabled)
        console.log('SPEAK invoked:', text);
        if (!textToSpeechEnabled) {
            return; // Exit early if TTS is disabled
        }

        window.speechSynthesis.cancel();
        const chunkLength = 200;
        let pos = 0;

        while (pos < text.length) {
            const chunk = text.slice(pos, pos + chunkLength);
            const msg = new SpeechSynthesisUtterance(chunk);
            window.speechSynthesis.speak(msg);
            pos += chunkLength;
        }
    };

    useEffect(() => {
        textToSpeechEnabledRef.current = textToSpeechEnabled;
    }, [textToSpeechEnabled]);


    useEffect(() => {
        if (!user_id) return; // Exit early if user_id is not available
        // Initialize the WebSocket connection when the component mounts
        const wsUrl = session_id
            ? `ws://0.0.0.0:8000/chat/${user_id}/${session_id}`
            : `ws://0.0.0.0:8000/chat/${user_id}`;

        console.log('wsUrl:', wsUrl);

        websocketRef.current = new WebSocket(wsUrl);

        // Event listeners for WebSocket
        websocketRef.current.onopen = () => {
            console.log("WebSocket connected!");
        };

        websocketRef.current.onmessage = (event) => {
            let direction;
            let content;

            if (event.data.startsWith("User:")) {
                direction = "user";
                content = event.data.replace("User:", "").trim();
            } else if (event.data.startsWith("Ai:")) {
                direction = "ai";
                content = event.data.replace("Ai:", "").trim();
                if (textToSpeechEnabledRef.current) { // Use the useRef here
                    speak(content);
                }
            } else {
                direction = event.data.startsWith("Chatbot:") ? "ai" : "user";
                content = event.data.replace("Chatbot:", "").trim();  // <--- This line removes 'Chatbot'
                if (direction === "ai" && textToSpeechEnabledRef.current) { // Check if text-to-speech is enabled
                    speak(content);
                }
            }

            const receivedMessage = {
                direction: direction,
                content: content
            };

            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        };

        websocketRef.current.onclose = () => {
            console.log("WebSocket closed!");
        };

        return () => {
            // Close the WebSocket connection when the component unmounts
            websocketRef.current.close();
        };
    }, [user_id, session_id]); // Only run once on component mount

    useEffect(() => {
        if (chatContainerRef.current) {
            const chatContainer = chatContainerRef.current;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const fetchProfileImage = async () => {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://127.0.0.1:8000/api/image/get-profile-image/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfileImageUrl(response.data.profile_image_url);
        };
        fetchProfileImage();
    }, []);


    // const handleSendMessage = () => {
    //     if (websocketRef.current) {
    //         websocketRef.current.send(currentMessage);

    //         // Manually add the user's message to the state
    //         setMessages((prevMessages) => [...prevMessages, { direction: 'user', content: currentMessage }]);

    //         setCurrentMessage("");
    //     }
    // };
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const handleSendMessage = () => {
        if (websocketRef.current) {
            let messageToSend = currentMessage || transcript; // 'or' condition for typed or spoken message

            websocketRef.current.send(messageToSend);

            // Manually add the user's message to the state
            setMessages((prevMessages) => [...prevMessages, { direction: 'user', content: messageToSend }]);

            setCurrentMessage("");
            resetTranscript(); // Reset the transcript once the message is sent
        }
    };

    useEffect(() => {
        if (!listening && transcript) {
            setCurrentMessage(transcript);
        }
    }, [listening, transcript]);

    useEffect(() => {
        console.log("textToSpeechEnabled changed:", textToSpeechEnabled);
    }, [textToSpeechEnabled]);

    // Utility function to convert URLs in text to clickable hyperlinks
    function linkify(inputText) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return inputText.replace(urlRegex, url => `<a href="${url}" style="color:blue;" target="_blank" rel="noopener noreferrer">${url}</a>`);
    }

    // Utility function to format pointwise responses
    function formatList(inputText) {
        const splitText = inputText.split(/\d+\./).filter(item => item.trim());
        return splitText.map(item => `<div>${item.trim()}</div><div><br></div>`).join("");
    }

    // ... Inside

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
                    <div className="absolute top-36 right-60 w-3/4 h-5/6 bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="h-5/6 overflow-y-scroll mb-4 border-b-2 border-gray-600" ref={chatContainerRef}>
                            {messages.map((message, idx) => (
                                <div key={idx} className={`flex mb-2 ${message.direction === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    {message.direction === 'user' && <img src={profileImageUrl} alt="User" className="w-8 h-8 rounded-full object-cover object-center mr-2" />}
                                    <div className={`text-left p-2 rounded-md ${message.direction === 'user' ? 'bg-blue-400' : 'bg-gray-400'}`}>
                                        <span dangerouslySetInnerHTML={{ __html: linkify(formatList(message.content)) }} />
                                    </div>
                                    {message.direction === 'ai' && <FontAwesomeIcon icon={faRobot} className="w-8 h-8 ml-2 text-gray-500" />}
                                </div>
                            ))}

                        </div>
                        <div className="flex mt-2 p-10">
                            <button
                                style={{ width: "60px", height: "60px" }}
                                className="p-2 bg-blue-700 text-white rounded-l-md"
                                onClick={() => setShowModal(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            {browserSupportsSpeechRecognition && (
                                <div>
                                    <button
                                        style={{ width: "60px", height: "60px" }}
                                        onClick={() => {
                                            listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening();
                                        }}
                                        className="p-2 bg-red-700 text-white rounded-l-md"
                                    >
                                        <FontAwesomeIcon icon={listening ? faMicrophoneSlash : faMicrophone} />
                                    </button>
                                </div>
                            )}
                            <input
                                type="text"
                                value={currentMessage}
                                onChange={e => setCurrentMessage(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleSendMessage();
                                        e.preventDefault(); // Prevent default behavior (like a newline in some browsers)
                                    }
                                }}
                                className="flex-1 p-4 border-t border-b rounded-none border-gray-600 bg-gray-700 text-white"
                                placeholder="Type a message..."
                            />
                            <button style={{ width: "60px", height: "60px" }} onClick={handleSendMessage} className="p-2 bg-gray-700 text-white rounded-r-md">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                            <button
                                onClick={() => {
                                    const newValue = !textToSpeechEnabled;
                                    console.log("Before click:", textToSpeechEnabled);
                                    console.log("Intending to set to:", newValue);
                                    setTextToSpeechEnabled(newValue);
                                }}
                                className="p-2 bg-green-700 text-white rounded-l-md"
                            >
                                {textToSpeechEnabled ? "Disable TTS" : "Enable TTS"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md shadow-lg w-1/3">
                        <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
                        <textarea
                            className="border p-2 w-full mt-2"
                            placeholder="Describe the image or ask a question..."
                            onChange={e => setImageDescription(e.target.value)}
                        ></textarea>
                        <button
                            className="bg-blue-500 text-white p-2 mt-2 rounded"
                            onClick={handleImageUpload}
                        >
                            Upload and Send
                        </button>
                        <button
                            className="bg-red-500 text-white p-2 mt-2 rounded ml-2"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default NewChat;