import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';

import StarRating from './StarRating'; // Adjust path as necessary

const TherapistCard = ({ therapist }) => {
    return (
        <div className="bg-white rounded-lg shadow-md w-64">
            <img className="w-full h-40 rounded-t-lg object-cover" src={therapist.photo} alt={therapist.name} />
            <div className="p-4">
                <h5 className="text-lg font-semibold">{therapist.name}</h5>
                <div className="my-2 flex justify-between">
                    <StarRating rating={therapist.rating} />
                    <span>{therapist.num_rating} review{therapist.num_rating > 1 && 's'}</span>
                </div>
                <div className="my-2 flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    <p>{therapist.address}</p>
                </div>
                {/* Uncomment below if therapists have phone numbers in the future
        <div className="my-2 flex items-center text-gray-600">
          <FontAwesomeIcon icon={faPhone} className="mr-2" />
          <p>{therapist.phone}</p>
        </div>
        */}
            </div>
            <div className="border-t p-4">
                <button
                    onClick={() => window.open(therapist.link, "_blank")}
                    className="text-blue-500 hover:underline"
                >
                    View on Google Maps
                </button>
            </div>
        </div>
    );
};

export default TherapistCard;
