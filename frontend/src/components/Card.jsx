import React from 'react';

const Card = ({ children, className }) => (
  <div className={`p-6 rounded-3xl bg-black bg-opacity-60 border border-gray-800 shadow-lg flex flex-col items-start space-y-4 ${className}`}
    style={{
      backgroundImage: 'linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)',
      Color: 'rgba(0, 0, 0, 0.87)'
    }}>
    {children}
  </div>
);

export default Card;
