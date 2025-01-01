import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import NewChat from "./pages/NewChat";
import EmergencyContactPage from "./pages/EmergencyContactPage";
import UserLocationPage from "./pages/UserLocationPage";

import { Provider } from "react-redux";
import { store } from "./utils/store";

import "./index.css";

// Function to load Google Maps script dynamically
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      resolve(); // Script already loaded
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${apiKey}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
};

// Use the API key from environment variables
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Load the Google Maps script before rendering the app
if (googleMapsApiKey) {
  loadGoogleMapsScript(googleMapsApiKey)
    .then(() => {
      // Render the React app after the script is loaded
      ReactDOM.createRoot(document.getElementById("root")).render(
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="new-chat/:user_id" element={<NewChat />} />
              <Route path="new-chat/:user_id/:session_id" element={<NewChat />} />
              <Route path="emergency-contacts" element={<EmergencyContactPage />} />
              <Route path="therapists-nearby" element={<UserLocationPage />} />
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      );
    })
    .catch((error) => {
      console.error("Error loading Google Maps script:", error);
    });
} else {
  console.error("Google Maps API key is missing! Please set VITE_GOOGLE_MAPS_API_KEY in your .env.local file.");
}
