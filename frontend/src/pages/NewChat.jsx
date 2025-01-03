import React, { useState, useEffect, useRef } from "react";
import "regenerator-runtime";
import Webcam from "react-webcam";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPlus,
  faRobot,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import NavbarHeader from "../components/NavbarHeader";
import TherapistCard from "../components/TherapistCard";
import Sidebar from "../components/Sidebar";
import signupBg from "../assets/signup-bg.png";
import { fetchUserData, selectUsername } from "../utils/userSlice";
import GoogleMapReact from "google-map-react";

const API_URL = import.meta.env.VITE_APP_API_URL;

const NewChat = () => {
  const dispatch = useDispatch();
  // const user_id = useSelector(state => state.user.user_id);  // Use selectors to get user data from the Redux store
  const { user_id, session_id } = useParams();
  // console.log("URL Params:", { user_id, session_id });

  // console.log('User id:', user_id);
  const [messages, setMessages] = useState([]);
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [therapistLocations, setTherapistLocations] = useState([]);
  const [showTherapistMap, setShowTherapistMap] = useState(false);
  const textToSpeechEnabledRef = useRef(true);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imageDescription, setImageDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const websocketRef = useRef(null); // Reference to manage WebSocket
  const chatContainerRef = useRef(null);
  const webcamRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const transcriptTimeoutRef = useRef(null);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const sidebarToggle = async () => {
    setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible);
    //alert("Ok");
  };

  const UserMarker = () => (
    <div
      style={{
        width: "25px",
        height: "25px",
        backgroundColor: "blue",
        borderRadius: "50%",
        border: "2px solid white", // give it a border to make it more distinguishable
        cursor: "pointer",
      }}
      title="Your Location"
    />
  );

  const handleSelectAddress = (address) => {
    setAddress(address); // Add this line
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        // Now that you have the latitude and longitude based on the user's selection
        // You can search for therapists nearby
        searchTherapistsNearby(latLng.lat, latLng.lng);
      })
      .catch((error) => console.error("Error", error));
  };

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Once we get the location, search for therapists
          searchTherapistsNearby(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error("Error obtaining location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // maximum length of time (milliseconds) that is allowed to pass
          maximumAge: 0, // indicates the maximum age in milliseconds of a possible cached position that the application will accept
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const searchTherapistsNearby = (lat, lng) => {
    // URL to your FastAPI route
    const FASTAPI_URL = `${API_URL}/maps/therapists?lat=${lat}&lng=${lng}`;

    axios
      .get(FASTAPI_URL)
      .then((response) => {
        const therapists = response.data; // Get the entire therapists data
        setTherapistLocations(
          therapists.map((therapist) => therapist.location)
        ); // If you use this elsewhere, keep this line
        const newMessage = {
          direction: "ai",
          type: "map",
          location: {
            lat: lat,
            lng: lng,
          },
          therapists: therapists, // Store the entire therapists data in the message
        };
        // console.log("New message:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      })
      .catch((error) => {
        console.error("Error searching for therapists:", error);
      });
  };

  const handleImageUpload = async () => {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${API_URL}/api/image/upload-image/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Send WebSocket messages
      if (response.data.filename) {
        websocketRef.current.send(`USER_SENT_IMAGE:${response.data.filename}`);
        websocketRef.current.send(imageDescription);
      }

      setShowModal(false);
      alert("You can now chat about the image you sent.");
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };

  async function checkCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Permission granted, close the stream and return true
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      // Permission denied or any other error occurred
      console.error("Camera permission error:", err);
      return false;
    }
  }

  // useEffect(() => {
  //     checkCameraPermission().then(hasPermission => {
  //         if (hasPermission) {
  //             // If permission granted, tell the server to start the webcam
  //             if (websocketRef.current) {
  //                 websocketRef.current.send('start-cam');
  //             }
  //         } else {
  //             // Inform the user about the need for camera permissions
  //             alert("Camera permission is required for emotion analysis.");
  //         }
  //     });
  // }, []);

  useEffect(() => {
    checkCameraPermission().then((hasPermission) => {
      if (hasPermission) {
        // If permission granted, start capturing frames and sending them to the backend
        startSendingFrames();
      } else {
        // Inform the user about the need for camera permissions
        alert("Camera permission is required for emotion analysis.");
      }
    });
  }, []);

  const startSendingFrames = () => {
    const intervalId = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!websocketRef.current) {
          console.log("WebSocket ref is not initialized.");
        } else if (websocketRef.current.readyState !== WebSocket.OPEN) {
          console.log(
            "WebSocket is not open. Current state:",
            websocketRef.current.readyState
          );
        } else if (!imageSrc) {
          console.log("No imageSrc captured from the webcam.");
        }

        if (
          websocketRef.current &&
          websocketRef.current.readyState === WebSocket.OPEN &&
          imageSrc
        ) {
          // Now, send this imageSrc (which is a data URL) to the backend via your websocket
          websocketRef.current.send(`FRAME:${imageSrc}`);
        }
      }
    }, 1000); // Send frame every second. Adjust this value as needed.

    return () => clearInterval(intervalId); // Clear the interval when done.
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    dispatch(fetchUserData(token)); // Assuming you have access to the token
  }, [dispatch]);

  const speak = (text) => {
    // console.log(textToSpeechEnabled)
    // console.log('SPEAK invoked:', text);
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
      ? `wss://mentalhealthapi.artelus.in/chat/${user_id}/${session_id}`
      : `wss://mentalhealthapi.artelus.in/chat/${user_id}`;

    // console.log('wsUrl:', wsUrl);

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
        if (textToSpeechEnabledRef.current) {
          // Use the useRef here
          speak(content);
        }
      } else {
        direction = event.data.startsWith("Chatbot:") ? "ai" : "user";
        content = event.data.replace("Chatbot:", "").trim(); // <--- This line removes 'Chatbot'
        if (direction === "ai" && textToSpeechEnabledRef.current) {
          // Check if text-to-speech is enabled
          speak(content);
        }
      }

      if (event.data.startsWith("ALERT: SUICIDAL TENDENCY")) {
        requestUserLocation();
        return;
      }

      const receivedMessage = {
        direction: direction,
        content: content,
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
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${API_URL}/api/image/get-profile-image/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileImageUrl(response.data.profile_image_url);
    };
    fetchProfileImage();
  }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleSendMessage = () => {
    if (websocketRef.current) {
      let messageToSend = currentMessage || transcript; // 'or' condition for typed or spoken message

      websocketRef.current.send(messageToSend);

      // Manually add the user's message to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        { direction: "user", content: messageToSend },
      ]);

      setCurrentMessage("");
      resetTranscript(); // Reset the transcript once the message is sent
    }
  };

  // useEffect(() => {
  //     if (!listening && transcript) {
  //         setCurrentMessage(transcript);
  //     }
  // }, [listening, transcript]);

  useEffect(() => {
    if (listening) {
      if (transcript !== lastTranscriptRef.current) {
        // Clear any existing timeout if the transcript changes.
        if (transcriptTimeoutRef.current) {
          clearTimeout(transcriptTimeoutRef.current);
        }

        // Set a timeout to check if the transcript remains unchanged.
        transcriptTimeoutRef.current = setTimeout(() => {
          handleSendMessage();
          resetTranscript();
          lastTranscriptRef.current = ""; // Reset the last transcript reference.
        }, 5000); // Adjust this duration as per your needs.

        lastTranscriptRef.current = transcript;
      }
    } else if (!listening && transcriptTimeoutRef.current) {
      // Clear the timeout if listening stops.
      clearTimeout(transcriptTimeoutRef.current);
    }
  }, [listening, transcript]);

  useEffect(() => {
    return () => {
      if (transcriptTimeoutRef.current) {
        clearTimeout(transcriptTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [messages]);

  useEffect(() => {
    console.log("textToSpeechEnabled changed:", textToSpeechEnabled);
  }, [textToSpeechEnabled]);

  // Utility function to convert URLs in text to clickable hyperlinks
  function linkify(inputText) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return inputText.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" style="color:blue;" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  }

  // Utility function to format pointwise responses
  function formatList(inputText) {
    const splitText = inputText.split(/\d+\./).filter((item) => item.trim());
    return splitText
      .map((item) => `<div>${item.trim()}</div><div><br></div>`)
      .join("");
  }

  return (
    <div className="bg-app mx-auto" >
      <div className="min-h-screen flex flex-col">

        <NavbarHeader sidebarToggle={sidebarToggle} />
        <div className="flex flex-1">
          {isSidebarVisible && <Sidebar />}


          <main className="  flex-1  p-4  xs:p-2sm:p-4 md:p-6 lg:p-8 xl:p-12 2xl:p-32 3xl:p-32   flex-1  overflow-hidden">

            {/*MAIN  <main className=" flex-1 p-4 overflow-hidden"> */}

            <div className="w-5/6 border-t border-gray-600 mb-4 justify-center">
              <div className="justify-center">
                <PlacesAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={handleSelectAddress} >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="relative">
                      <input
                        {...getInputProps({
                          placeholder: "Search Therapists near you ...",
                          className: "w-full p-4 border rounded-md border-gray-600 bg-gray-700 text-white"
                        })}
                      />
                      <div className="absolute top-full left-0 mt-2 w-full bg-gray-700 border border-gray-600 z-10">
                        {loading && <div className="p-2 text-white">Loading...</div>}
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            {...getSuggestionItemProps(suggestion, {
                              className: "p-2 text-white hover:bg-gray-600 cursor-pointer"
                            })}
                          >
                            {suggestion.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>

              </div>
            </div>


            <div className="absolute  items-center w-5/6 h-4/6 bg-gray-800 p-6 rounded-lg shadow-lg mr-4">
              <div className="h-4/6 overflow-y-scroll mb-4 border-b-2 border-gray-600" ref={chatContainerRef}>
                {messages.map((message, idx) => {
                  {/* console.log(message.therapists);  // Log each message to inspect its structure */ }

                  return (
                    <div key={idx} className={`flex mb-2 ${message.direction === 'user' ? 'justify-start' : 'justify-end'}`}>
                      {message.direction === 'user' && <img src={profileImageUrl} alt="User" className="w-8 h-8 rounded-full object-cover object-center mr-2" />}
                      {message.type === "map" ? (
                        <div className="h-96 w-3/4 rounded-lg shadow-lg">
                          <GoogleMapReact
                            bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
                            defaultCenter={{ lat: message.location?.lat, lng: message.location?.lng }}
                            center={{ lat: message.location?.lat, lng: message.location?.lng }}
                            defaultZoom={14}
                            margin={[50, 50, 50, 50]}
                            options={""}
                          >
                            <UserMarker
                              lat={message.location?.lat}
                              lng={message.location?.lng}
                            />
                            {message.therapists?.map((therapist, index) => (
                              <TherapistCard
                                key={index}
                                therapist={therapist}
                                lat={therapist.location?.lat}
                                lng={therapist.location?.lng}
                              />
                            ))}
                          </GoogleMapReact>
                        </div>
                      ) : (
                        <div className={`text-left p-2 rounded-md ${message.direction === 'user' ? 'bg-blue-400' : 'bg-gray-400'}`}>
                          <span dangerouslySetInnerHTML={{ __html: linkify(formatList(message.content)) }} />
                        </div>
                      )}
                      {message.direction === 'ai' && <FontAwesomeIcon icon={faRobot} className="w-8 h-8 ml-2 text-gray-500" />}
                    </div>
                  );
                })}

              </div>
              <div className="flex flex-col sm:flex-row items-center mt-2 mb-2">
                <div className="flex items-center mb-2 sm:mb-0">
                  {browserSupportsSpeechRecognition && (
                    <button
                      style={{ width: "60px", height: "60px" }}
                      onClick={() => {
                        listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true });
                      }}
                      className="bg-red-700 text-white rounded-md mr-2"
                    >
                      <FontAwesomeIcon icon={listening ? faMicrophoneSlash : faMicrophone} />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const newValue = !textToSpeechEnabled;
                      setTextToSpeechEnabled(newValue);
                    }}
                    style={{ height: "60px" }}
                    className="p-2 bg-green-700 text-white rounded-md mr-2">
                    {textToSpeechEnabled ? "Disable TTS" : "Enable TTS"}
                  </button>

                  <button
                    style={{ width: "60px", height: "60px" }}
                    className="p-2 bg-blue-700 text-white rounded-md mr-2"
                    onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                <div className="flex flex-shrink-0 items-center w-full sm:w-auto">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                        e.preventDefault();
                      }
                    }}
                    className="flex-grow p-4 border-t border-b rounded-l-md border-gray-600 bg-gray-700 text-white mr-2 xl:min-w-[900px]"
                    placeholder="Type a message..."
                    style={{ height: "53px" }}
                  />

                  <button
                    style={{ width: "60px", height: "53px" }}
                    onClick={handleSendMessage}
                    className="p-2 bg-gray-700 text-white rounded-r-md border-t border-b border-gray-600 bg-gray-700">
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              </div>
            </div>

            {/*EOD MAIN*/}
          </main>

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
      <Webcam
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    videoConstraints={{ width: 320, height: 240 }}
    style={{
        position: 'fixed',
        bottom: '20px', // Adjust for a higher value if necessary
        right: '20px', 
        left: '50%', // Centering horizontally on small screens
        transform: 'translateX(-50%)', // Centering translation
        width: '200px',
        height: '150px',
        zIndex: 10, // This ensures it stays on top if needed
    }}
    className="sm:bottom-20 sm:right-auto"  // Overriding the right property on small screens and adjusting the bottom
/>
    </div>
  );
};

export default NewChat;
