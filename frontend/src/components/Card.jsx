import React from 'react';

const Card = ({ children, className }) => (
  <div className={`p-6 rounded-3xl bg-black bg-opacity-60 border border-gray-800 shadow-lg flex flex-col items-start space-y-4 ${className} bg-card-my`}>
    {children}
  </div>
);

export default Card;
