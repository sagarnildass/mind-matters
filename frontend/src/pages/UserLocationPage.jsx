import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";  // assuming you have Navbar in a separate file
import Sidebar from "../components/Sidebar";  // and Sidebar too
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import TherapistCard from "../components/TherapistCard";  // Your therapist card component
import signupBg from '../assets/signup-bg.png';


const UserLocationPage = () => {
    const [address, setAddress] = useState('');
    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [userLocation, setUserLocation] = useState(null);
    const [therapistLocations, setTherapistLocations] = useState([]);

    useEffect(() => {
        requestUserLocation();
    }, []);

    const UserMarker = () => (
        <div style={{
            width: '25px',
            height: '25px',
            backgroundColor: 'blue',
            borderRadius: '50%',
            border: '2px solid white', // give it a border to make it more distinguishable
            cursor: 'pointer'
        }} title="Your Location" />
    );

    // Your provided functions
    const handleSelectAddress = address => {
        setAddress(address); // Add this line
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                searchTherapistsNearby(latLng.lat, latLng.lng);
                setMapCenter(latLng);
            })
            .catch(error => console.error("Error", error));
    };

    const requestUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setMapCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    // Once we get the location, search for therapists
                    searchTherapistsNearby(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error obtaining location:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,  // maximum length of time (milliseconds) that is allowed to pass
                    maximumAge: 0    // indicates the maximum age in milliseconds of a possible cached position that the application will accept
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    const searchTherapistsNearby = (lat, lng) => {
        // URL to your FastAPI route
        const FASTAPI_URL = `http://127.0.0.1:8000/maps/therapists?lat=${lat}&lng=${lng}`;

        axios.get(FASTAPI_URL)
            .then(response => {
                const therapists = response.data;  // Get the entire therapists data
                setTherapistLocations(therapists); // If you use this elsewhere, keep this line
            })
            .catch(error => {
                console.error("Error searching for therapists:", error);
            });
    }

    useEffect(() => {
        console.log("Updated Therapists:", therapistLocations);
    }, [therapistLocations]);

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

                    {/* Search Bar positioned above the map */}
                    <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-8/12 px-4 py-2 z-10">
                        <PlacesAutocomplete
                            value={address}
                            onChange={setAddress}
                            onSelect={handleSelectAddress}
                        >
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
                                        {suggestions.map(suggestion => (
                                            <div
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

                    {/* Map positioned below the search bar */}
                    <div className="absolute top-60 left-80 w-3/4 h-3/4 z-0">
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyBv_mtu61MCcuQeyud2XB62OMqBM8n3fKY" }}
                            defaultCenter={{ lat: userLocation?.lat || 0, lng: userLocation?.lng || 0 }}
                            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
                            defaultZoom={14}
                        >
                            <UserMarker
                                lat={userLocation?.lat}
                                lng={userLocation?.lng}
                            />
                            {therapistLocations.map((therapist, index) => (
                                <TherapistCard
                                    key={index}
                                    therapist={therapist}
                                    lat={therapist.location?.lat}
                                    lng={therapist.location?.lng}
                                />
                            ))}
                        </GoogleMapReact>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLocationPage;