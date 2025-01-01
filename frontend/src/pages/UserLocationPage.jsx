import React, { useState, useEffect } from "react";
import NavbarHeader from '../components/NavbarHeader';
import Sidebar from "../components/Sidebar";  // and Sidebar too
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import TherapistCard from "../components/TherapistCard";  // Your therapist card component
import signupBg from '../assets/signup-bg.png';

const API_URL = import.meta.env.VITE_APP_API_URL;

const UserLocationPage = () => {
    const [address, setAddress] = useState('');
    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [userLocation, setUserLocation] = useState(null);
    const [therapistLocations, setTherapistLocations] = useState([]);
   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const sidebarToggle = async () => {
        setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible);
        //alert("Ok");
    };
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
        const FASTAPI_URL = `${API_URL}/maps/therapists?lat=${lat}&lng=${lng}`;

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
               <div className="bg-app mx-auto" >
            <div className="min-h-screen flex flex-col">

                <NavbarHeader  sidebarToggle={sidebarToggle} />
                <div className="flex flex-1">
                    {isSidebarVisible &&   <Sidebar />  }

                    <main className=" flex-1 xs:p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12 xxl:p-16 2xl:p-16 3xl:p-16 overflow-hidden  ">
                    {/*MAIN */}

                    {/* Search Bar positioned above the map */}
                    <div className=" top-2    px-4 py-2 z-10">
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
                                            // eslint-disable-next-line react/jsx-key
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
                    <div className=" top-4 ml-4 mr-4 w-100 fullscreen z-0">
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
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

                    {/*EOD MAIN*/}
                    </main>

                </div>
            </div>
        </div>
    );
}

export default UserLocationPage;
